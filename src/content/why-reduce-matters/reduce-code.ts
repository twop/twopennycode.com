const Empty = null
type Opt<T> = T | typeof Empty
const isEmpty = <T>(v: Opt<T>): v is typeof Empty => v === Empty

type Elem<T> = { val: T; next: Opt<Elem<T>> }
type List<T> = Opt<Elem<T>>

const addInFront = <T>(l: List<T>, val: T): List<T> => ({ val, next: l })

const reverse = <T>(l: List<T>): List<T> =>
  isEmpty(l) ? l : { val: l.val, next: reverse(l.next) }

export const sum_ = (list: List<number>): number => {
  let s = 0
  let next = list
  while (!isEmpty(next)) {
    s = s + next.val
    next = next.next
  }
  return s
}

export const findElem = <T>(list: List<T>, pred: (v: T) => boolean): Opt<T> => {
  let elem: Opt<T> = Empty
  let next = list
  while (!isEmpty(next) && !isEmpty(elem)) {
    elem = pred(next.val) ? next.val : Empty
    next = next.next
  }
  return elem
}

const doStuff = <R>(
  list: List<number>,
  action: (r: R, n: number) => R,
  initial: R
): R => {
  let result = initial

  let next = list
  while (!isEmpty(next)) {
    result = action(result, next.val)
    next = next.next
  }

  return result
}

export const sum = (list: List<number>) => reduce(list, (s, n) => s + n, 0)
export const sum2 = (list: List<number>) => doStuff(list, (s, n) => s + n, 0)

export const findElem2 = (list: List<number>, pred: (v: number) => boolean) =>
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

export const reduce = <T, R>(
  l: List<T>,
  op: (r: R, v: T) => R,
  initVal: R
): R => (isEmpty(l) ? initVal : reduce(l.next, op, op(initVal, l.val)))

export const filter = <T>(list: List<T>, pred: (v: T) => boolean): List<T> =>
  reverse(
    reduce(list, (r: List<T>, el) => (pred(el) ? addInFront(r, el) : r), Empty)
  )

export const map = <A, B>(list: List<A>, f: (a: A) => B): List<B> =>
  reverse(reduce(list, (r: List<B>, el) => addInFront(r, f(el)), Empty))

// list of full pairs plus one if the length is odd
type PairwiseRes<T> = { paired: List<[T, T]>; left: Opt<T> }

// a helper to make ts happy with [T,T] type
const pair = <T>(a: T, b: T): [T, T] => [a, b]

const operator = <T>({ paired, left }: PairwiseRes<T>, el: T): PairwiseRes<T> =>
  isEmpty(left)
    ? // wait for the next
      { paired, left: el }
    : // we have two
      { paired: addInFront(paired, pair(left, el)), left: Empty }

export const pairwise = <T>(list: List<T>): PairwiseRes<T> =>
  // Note we need to reverse it first
  reduce(reverse(list), operator, { paired: Empty, left: Empty })

const arrToList = <T>(arr: T[]) =>
  arr.reduceRight((l: List<T>, el) => addInFront(l, el), Empty)

const listToArray = <T>(list: List<T>) =>
  reduce(reverse(list), (arr: T[], val) => arr.concat(val), [])

const logj = <T>(val: T) => console.log(JSON.stringify(val))

logj(
  [1, 2, 3, 4].reduce<PairwiseRes<number>>(operator, {
    paired: Empty,
    left: Empty
  })
)

logj(pairwise(arrToList([1, 2, 3, 4])))
logj(listToArray(arrToList([1, 2, 3, 4])))

const add = (a: number, b: number) => a + b

console.log(reduce(arrToList([1, 2, 3, 4]), add, 0))
console.log([1, 2, 3, 4].reduce(add, 0))

// sum
// find
// ----
// filter
// map
