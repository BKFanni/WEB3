// https://stackoverflow.com/a/46545530
export function shuffleArray<T>(unshuffled: Array<T>): Array<T> {
    let shuffled = unshuffled
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)
    
    return shuffled
}