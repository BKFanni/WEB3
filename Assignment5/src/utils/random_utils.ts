// A function that returns a (possibly) random number from 0 to bound - 1
export type Randomizer = (bound: number) => number

// Uniformly selected pseudo-random number
export const standardRandomizer: Randomizer = n => Math.floor(Math.random() * n)

// A function that shuffles the given array
export type Shuffler<T> = (ts: Readonly<T[]>) => T[]

// Perfect shuffle using the Fisher-Yates method
export function standardShuffler<T>(ts: Readonly<T[]>): T[] {
  const shuffled = [...ts]
  for(let i = 0; i < shuffled.length - 1; i++) {
    const j = Math.floor(Math.random() * (shuffled.length - i) + i)
    const temp = shuffled[j]
    shuffled[j] = shuffled[i]
    shuffled[i] = temp
  }
  return shuffled
}
