import type { ProjectExport } from './projectExport'
import {
    type CsvDelimiter,
    commentsToCsv,
    CSV_BOM,
    getCsvDelimiter,
    talksToCsv,
} from './projectExportCsv'

export interface ExportFormat {
    i18nKey: string
    /** File name suffix, before the extension. */
    suffix: string
    extension: string
    type: string
    serialize: (projectExport: ProjectExport) => string
}

const csvFormat = (
    i18nKey: string,
    suffix: string,
    toCsvText: (projectExport: ProjectExport, delimiter: CsvDelimiter) => string
): ExportFormat => ({
    i18nKey,
    suffix,
    extension: 'csv',
    type: 'text/csv;charset=utf-8',
    serialize: (projectExport) =>
        CSV_BOM + toCsvText(projectExport, getCsvDelimiter(navigator.language)),
})

export const EXPORT_FORMATS: ExportFormat[] = [
    {
        i18nKey: 'dashboard.exportJson',
        suffix: 'data',
        extension: 'json',
        type: 'application/json',
        serialize: (projectExport) => JSON.stringify(projectExport, null, 2),
    },
    csvFormat('dashboard.exportCsvTalks', 'votes', talksToCsv),
    csvFormat('dashboard.exportCsvComments', 'comments', commentsToCsv),
]
