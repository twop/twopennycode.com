const Empty = null
type Opt<T> = T | typeof Empty
const isEmpty = <T>(v: Opt<T>): v is typeof Empty => v === Empty

type Elem<T> = { val: T; prev: Opt<Elem<T>> }
type List<T> = Opt<Elem<T>>

const append = <T>(l: List<T>, val: T): List<T> => ({ val, prev: l })

const reverse = <T>(l: List<T>): List<T> =>
  isEmpty(l) ? l : { val: l.val, prev: reverse(l.prev) }

export const sum_ = (list: List<number>): number => {
  let s = 0 // initial value

  // iteration
  let el = list
  while (!isEmpty(el)) {
    s = s + el.val // operation
    el = el.prev
  }

  return s // result
}

export const findElem = <T>(list: List<T>, pred: (v: T) => boolean): Opt<T> => {
  let res: Opt<T> = Empty // initial value

  // iteration
  let el = list

  // terminate early if we found an element
  while (!isEmpty(el) && isEmpty(res)) {
    res = pred(el.val) ? el.val : Empty
    el = el.prev
  }

  return res // result
}

const doStuff = <R>(
  list: List<number>,
  operation: (r: R, n: number) => R,
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

export const sum = (list: List<number>) => reduce(list, (s, num) => s + num, 0)
export const sum2 = (list: List<number>) =>
  doStuff(list, (s, num) => s + num, 0)

export const findElem2 = (list: List<number>, pred: (v: number) => boolean) =>
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

export const tailReduce = <T, R>(
  l: List<T>,
  op: (r: R, v: T) => R,
  initVal: R
): R => (isEmpty(l) ? initVal : reduce(l.prev, op, op(initVal, l.val)))

export const reduce = <T, R>(
  l: List<T>,
  op: (r: R, v: T) => R,
  initVal: R
): R => (isEmpty(l) ? initVal : op(reduce(l.prev, op, initVal), l.val))

export const filter = <T>(list: List<T>, pred: (v: T) => boolean): List<T> =>
  reduce(list, (r: List<T>, el) => (pred(el) ? append(r, el) : r), Empty)

export const map = <A, B>(list: List<A>, f: (a: A) => B): List<B> =>
  reduce(list, (r: List<B>, el) => append(r, f(el)), Empty)

// list of full pairs plus one if the length is odd
type PairwiseRes<T> = { pairs: List<[T, T]>; left: Opt<T> }

// a helper to make ts happy with [T,T] type
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

const pairwise = <T>(list: List<T>): PairwiseRes<T> =>
  reduce(list, pairOperator, { pairs: Empty, left: Empty })

const arrToList = <T>(arr: T[]) =>
  arr.reduce((l: List<T>, el) => append(l, el), Empty)

const listToArray = <T>(list: List<T>) =>
  reduce(list, (arr: T[], val) => arr.concat(val), [])

const logj = <T>(val: T) => console.log(JSON.stringify(val))

logj(
  [1, 2, 3, 4].reduce<PairwiseRes<number>>(pairOperator, {
    pairs: Empty,
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
