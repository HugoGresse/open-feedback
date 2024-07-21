import { DateRange } from '../hooks/useProjects.ts'

const getYearlyDateRanges = (
    startYear: number,
    numYears: number
): DateRange[] => {
    const currentYear = new Date().getFullYear()

    return Array.from({ length: numYears }, (_, i) => {
        const year = startYear + i
        if (year > currentYear) return null

        return {
            name: `${year}`,
            startDate: new Date(year, 0, 1), // January 1st of the given year
            endDate: new Date(year, 11, 31), // December 31st of the given year
        }
    }).filter((range): range is DateRange => range !== null)
}
export const getInitialDateRanges = (): DateRange[] => {
    const last365D = new Date()
    last365D.setFullYear(last365D.getFullYear() - 1)

    const last90D = new Date()
    last90D.setDate(last90D.getDate() - 90)

    const last30D = new Date()
    last30D.setDate(last30D.getDate() - 30)

    const numberOfYearsSince2021 = new Date().getFullYear() - 2021 + 1

    return [
        {
            name: '-365d',
            startDate: last365D,
            endDate: new Date(),
        },
        {
            name: '-90d',
            startDate: last90D,
            endDate: new Date(),
        },
        {
            name: '-30d',
            startDate: last30D,
            endDate: new Date(),
        },
        ...getYearlyDateRanges(2021, numberOfYearsSince2021).reverse(),
    ]
}
