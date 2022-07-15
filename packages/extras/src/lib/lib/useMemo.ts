import { writable } from 'svelte/store'

export const useMemo = <U extends any>(callback: () => U) => {
  let initialCallDone = false
  const memoized = writable<U>(callback())
  const memoize = (...args: any[]) => {
    if (!initialCallDone) {
      initialCallDone = true
      return
    }
    memoized.set(callback())
  }
  return {
    ...memoized,
    memoize
  }
}
