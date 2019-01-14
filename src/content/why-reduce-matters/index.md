---
layout: blog-post
title: 'Why reduce matters?'
date: 2018-12-11
---

### Intro

When I started to learn "Redux" I was very confused what "reducer" actually meant. I knew that there is an `Array` method called `reduce` that accepts a function with a similar signature, but not much else. In this post I will try to share what I discovered.

Disclaimer: I'm not an expert in Functional Programming, so whatever I say is just my attempt to digest it myself.

Now, let's dive in!

### Linked list as an example

Let's start with defining an immutable linked list

```typescript
const Empty = null // give null precise meaning
type Opt<T> = T | typeof Empty // either a value or Empty
const isEmpty = <T>(v: Opt<T>): v is typeof Empty => v === Empty

// Element always has a value and maybe a reference to the prev
type Elem<T> = { val: T; prev: Opt<Elem<T>> }

// Either Empty or contains at least one element
type List<T> = Opt<Elem<T>>
```

Note that because of immutability we can only look at at the previous value. It means that we iterate newest -> oldest

### Define operations on it

Let's try to implement `sum` and `findElement` functions:

`sum` would simply sum all numbers in a list:

```ts
const sum = (list: List<number>): number => {
  let s = 0 // initial value

  // iteration
  let el = list
  while (!isEmpty(el)) {
    s = s + el.val // operation
    el = el.prev
  }

  return s // result
}
```

`findElement` returns either the first element that satisfies the predicate or `Empty`

```ts
const findElement = (
  list: List<number>,
  pred: (v: number) => boolean
): Opt<number> => {
  let res: Opt<number> = Empty // initial value

  // iteration
  let el = list

  // terminate early if we found an element
  while (!isEmpty(el) && isEmpty(res)) {
    res = pred(el.val) ? el.val : Empty
    el = el.prev
  }

  return res // result
}
```

Looks similar, right?
Let's try to extract the common parts into a separate function and name it `doStuff`

```ts
const doStuff = <R>(
  list: List<number>,
  operation: (res: R, n: number) => R,
  initial: R
): R => {
  let result = initial // initial value

  let el = list
  while (!isEmpty(el)) {
    result = operation(result, el.val) // apply operation
    el = el.prev
  }

  return result // result
}
```

Express `sum` and `findElement` via our new function.

```ts
//iterate over the list and perform (+) operation starting from 0
const sum = (list: List<number>) => doStuff(list, (s, num) => s + num, 0)
```

I love oneliners :)

```ts
const findElement = (list: List<number>, pred: (num: number) => boolean) =>
  doStuff(
    list,

    // operation
    (maybeResult, num) => {
      // maybe we already found it
      if (!isEmpty(maybeResult)) return maybeResult

      // test the current value
      return pred(num) ? num : Empty
    },

    Empty as Opt<number> // initial value
  )
```

The operation function looks a little bit more involved, but conceptually it is pretty simple: it is a switch between "found it!" and "not yet" states. Once we found a value we cannot "unfind" it back.

Note that we lost early termination of `findElement`. But we did get a lot of code reuse in the process :)

Let's give `doStuff` function a proper name and implement it via recursion

```ts
const reduce = <T, R>(l: List<T>, op: (r: R, v: T) => R, initVal: R): R =>
  // if list is empty return what we currently have
  // otherwise compute the result of the list minus last element
  // and apply operator to the result and to the current element value
  isEmpty(l) ? initVal : op(reduce(l.prev, op, initVal), l.val)
```

Note that this form iterates in the right order: oldest to newest. Exactly what we wanted and we are not mutating anything in the process!

### We have the superpower

It appears that reduce is a general abstraction over iteration. You can probably think about it as a `for` loop but without any unnecessary ceremony.

Now, let's try to feel the power and build `map` and `filter` functions. But first we need a way to actually grow lists.

```ts
// adds an element to the end of the list
const append = <T>(l: List<T>, val: T): List<T> => ({ val, prev: l })
```

operator for `filter` is pretty straightforward: "if I like you then welcome aboard, please next otherwise".

```ts
// filter out elements that don't satisfy the predicate
const filter = <T>(list: List<T>, pred: (v: T) => boolean): List<T> =>
  reduce(list, (r: List<T>, el) => (pred(el) ? append(r, el) : r), Empty)
```

`map` is a function that accepts a list and a function that transforms each element into something else (for example: `const f = (n: number) => n.toString()`).

```ts
const map = <A, B>(list: List<A>, f: (a: A) => B): List<B> =>
  reduce(list, (r: List<B>, el) => append(r, f(el)), Empty)
```

That was easy! Maybe something more challenging? Something like [pairwise](https://rxjs-dev.firebaseapp.com/api/operators/pairwise) rxjs operator.

In short, we need to form pairs out of a sequence of elements. For examples:
`[1,2,3,4]` would become `[[1,2], [3,4]]`. And if we have an odd number of elements we would have one "outsider" left: `[1,2,3]` -> `{pairs: [1,2], left: 3}`.

```ts
// list of full pairs plus optional tail if the length is odd
type PairwiseRes<T> = { paired: List<[T, T]>; left: Opt<T> }

// a helper to make typescript happy with [T,T] type
const pair = <T>(a: T, b: T): [T, T] => [a, b]

const pairOperator = <T>(
  { pairs, left }: PairwiseRes<T>,
  el: T
): PairwiseRes<T> =>
  isEmpty(left)
    ? // wait for the next
      { pairs, left: el }
    : // we have two
      { pairs: append(pairs, pair(left, el)), left: Empty }
```

When the operator sees a value it acts like so: "do I have one already? If so form a pair, wait for the next otherwise".

```ts
const pairwise = <T>(list: List<T>): PairwiseRes<T> =>
  reduce(list, pairOperator, { pairs: Empty, left: Empty })
```

Again, when we have a recipe what to do with elements one by one, actually applying it to the list is super easy.

### What about `Array.prototype.reduce`'?

The best part is that all our operators would just work with Array too (and with all other collections that support `reduce`).

```ts
const arr = [1, 2, 3, 4]
arr.reduce(pairOperator, {
  pairs: Empty,
  left: Empty
})
//  pairs:{"val":[3,4],"prev":{"val":[1,2],"prev":null}},
//  left:null

pairwise(arrToList(arr))
//  pairs:{"val":[3,4],"prev":{"val":[1,2],"prev":null}},
//  left:null
```

And addition:

```ts
const add = (a: number, b: number) => a + b

const arr = [1, 2, 3, 4]
const list = arrToList(arr)

reduce(list, add, 0) // 10
arr.reduce(add, 0) // 10
```

### Summary

I hope, that next time you would write a "reducer" or simply use `arr.reduce` you would appreciate this superpower a little bit more.

P.S.

- [redux](https://redux.js.org/) is a form of this pattern. You can think about actions as a collection of events happening overtime, where "reducer" itself is an operator.

- Our `reduce` implementation is not a tail recursion, which means that you cannot replace it with just a `while` loop (bad for performance). In practice, you iterate newest -> oldest, but before/after you reverse the list back with something like:

  ```ts
  const reverse = <T>(l: List<T>): List<T> =>
    isEmpty(l) ? l : { val: l.val, prev: reverse(l.prev) }
  ```

- `arrToList` implementation

  ```ts
  const arrToList = <T>(arr: T[]) =>
    arr.reduce((l: List<T>, el) => append(l, el), Empty)
  ```

- Another common term for `reduce` is `fold`.

You can find code snippets used for this post [here](https://github.com/twop/twopennycode.com/blob/master/src/content/why-reduce-matters/reduce-code.ts)

[Back to the list.](/)
