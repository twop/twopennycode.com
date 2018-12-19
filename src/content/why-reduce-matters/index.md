---
layout: blog-post
title: 'Why reduce matters?'
date: 2018-12-11
---

### Linked list as an example

Let's start with defining immutable linked list

```ts
const Empty = null // give null precise meaning
type Opt<T> = T | typeof Empty // either a value or Empty
const isEmpty = <T>(v: Opt<T>): v is typeof Empty => v === Empty

// Element always has a value and maybe a reference to the next
type Elem<T> = { val: T; next: Opt<Elem<T>> }

// Either Empty or contains at least one element
type List<T> = Opt<Elem<T>>
```

### Define operations for it

Let's try to implement `sum` and `findElement` functions:

`sum` would simply sums all numbers in a list:

```ts
const sum = (list: List<number>): number => {
  let s = 0 // initial value

  // iteration
  let next = list
  while (!isEmpty(next)) {
    s = s + next.val // operation
    next = next.next
  }
  return s // result
}
```

`findElement` returns either a first element that satisfies the predicate or `Empty`

```ts
const findElement = (
  list: List<number>,
  pred: (v: number) => boolean
): Opt<number> => {
  let elem: Opt<number> = Empty // initial value

  // iteration
  let next = list
  //terminate early if we found an element
  while (!isEmpty(next) && !isEmpty(elem)) {
    elem = pred(next.val) ? next.val : Empty // operation
    next = next.next
  }
  return elem // result
}
```

Look similar, right?
Let's try to extract common parts into a separate function and name it `doStuff`

```ts
const doStuff = <R>(
  list: List<number>,
  operation: (res: R, n: number) => R,
  initial: R
): R => {
  let result = initial // initial value

  // iteration
  let next = list
  while (!isEmpty(next)) {
    result = operation(result, next.val) // apply operation
    next = next.next
  }

  return result // result
}
```

Express `sum` and `findElement` with our new function.

```ts
//iterate over the list and perform (+) operation starting from 0
const sum = (list: List<number>) => doStuff(list, (s, n) => s + n, 0)

const findElement = (list: List<number>, pred: (v: number) => boolean) =>
  doStuff(
    list,
    (prev, n) => {
      // maybe we already found it
      if (!isEmpty(prev)) return prev

      // test the current value
      return pred(n) ? n : prev
    },
    Empty as Opt<number>
  )
```

Note that we lost early termination for `findElement`! But we did get a lot of code reuse in the process :)

Let's give `doStuff` function a proper name and implement it via recursion

```ts
const reduce = <T, R>(l: List<T>, op: (r: R, v: T) => R, initVal: R): R =>
  // if list is empty return what we currently have
  // otherwise move on to the next element applying the operator
  isEmpty(l) ? initVal : reduce(l.next, op, op(initVal, l.val))
```

### Now we have a superpower!

It seems that reduce is a general abstraction over iteration. You can probably think about it as a `for` loop but without unnecessary ceremony.

Now, let's try to build `map` and `filter` functions.

```ts
// we need a way to create lists
const addInFront = <T>(l: List<T>, val: T): List<T> => ({ val, next: l })

// filter out elements that don't satisfy the predicate
const filter = <T>(list: List<T>, pred: (v: T) => boolean): List<T> =>
  reduce(list, (r: List<T>, el) => (pred(el) ? addInFront(r, el) : r), Empty)
```

But you may notice that the elements in the result are in reverse order. Let's fix that

```ts
// recreates a list in reverse order
const reverse = <T>(l: List<T>): List<T> =>
  isEmpty(l) ? l : { val: l.val, next: reverse(l.next) }

const filter = <T>(list: List<T>, pred: (v: T) => boolean): List<T> =>
  reverse(
    reduce(list, (r: List<T>, el) => (pred(el) ? addInFront(r, el) : r), Empty)
  )
```

`map` is a function that accepts a list and a function that transforms each element to something else (for example: `const f = (n: number) => n.toString()`).

```ts
const map = <A, B>(list: List<A>, f: (a: A) => B): List<B> =>
  reverse(reduce(list, (r: List<B>, el) => addInFront(r, f(el)), Empty))
```

That was easy! Maybe something more challenging? Something like [pairwise](https://rxjs-dev.firebaseapp.com/api/operators/pairwise) rxjs operator.

```ts
// list of full pairs plus optional tail if the length is odd
type PairwiseRes<T> = { paired: List<[T, T]>; left: Opt<T> }

// a helper to make ts happy with [T,T] type
const pair = <T>(a: T, b: T): [T, T] => [a, b]

const pairOperator = <T>(
  { paired, left }: PairwiseRes<T>,
  el: T
): PairwiseRes<T> =>
  isEmpty(left)
    ? // wait for the next
      { paired, left: el }
    : // we have two, add them to the list
      { paired: addInFront(paired, pair(left, el)), left: Empty }

const pairwise = <T>(list: List<T>): PairwiseRes<T> =>
  // Note we need to reverse it first
  reduce(reverse(list), pairOperator, { paired: Empty, left: Empty })
```

### Wait, `Array` also has a `reduce` function!

The best part is that all our operators would just work with Array too (and with all other collections that support reduce)!

```ts
const arr = [1, 2, 3, 4]
arr.reduce(pairOperator, {
  paired: Empty,
  left: Empty
})
// paired: { val: [3, 4], next: { val: [1, 2], next: null } }
// left: null

pairwise(arrToList(arr))
// paired: { val: [3, 4], next: { val: [1, 2], next: null } }
// left: null
```

And of course, simply adding numbers would also work

```ts
const add = (a: number, b: number) => a + b

const arr = [1, 2, 3, 4]
const list = arrToList(arr)

reduce(list, add, 0) // 10
arr.reduce(add, 0) // 10
```

### Summary

I hope, that next time you would use `arr.reduce` you would feel a little bit more power attached to it!

P.S.: [redux](https://redux.js.org/) is a form of reduce pattern. You can think about actions as a collection of events happening overtime.

[Back to the list.](/)
