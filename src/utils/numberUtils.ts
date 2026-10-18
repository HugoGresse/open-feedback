export const round1Decimals = (value: number) => Math.round(value * 10) / 10

export const twoDigits = (value: number | string) => ('0' + value).slice(-2)
