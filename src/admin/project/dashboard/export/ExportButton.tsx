import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import DownloadIcon from '@mui/icons-material/FileDownloadOutlined'
import { useAppSelector } from '../../../../store'
import { getSelectedProjectSelector } from '../../core/projectSelectors'
import { getSortedVoteItemsSelector } from '../../settings/votingForm/votingFormSelectors'
import {
    getTalksAsArraySelector,
    isTalkLoadedSelector,
} from '../../../../core/talks/talksSelectors'
import { getSpeakersListSelector } from '../../../../core/speakers/speakerSelectors'
import {
    getTalkVotesSelector,
    isTalkVotesLoadedSelector,
} from '../dashboardSelectors'
import {
    buildProjectExport,
    type ProjectExport,
    toExportFileName,
} from './projectExport'
import { commentsToCsv, CSV_BOM, talksToCsv } from './projectExportCsv'
import { downloadFile } from './downloadFile'

interface ExportFormat {
    i18nKey: string
    suffix: string
    extension: string
    type: string
    serialize: (projectExport: ProjectExport) => string
}

const EXPORT_FORMATS: ExportFormat[] = [
    {
        i18nKey: 'dashboard.exportJson',
        suffix: 'data',
        extension: 'json',
        type: 'application/json',
        serialize: (projectExport) => JSON.stringify(projectExport, null, 2),
    },
    {
        i18nKey: 'dashboard.exportCsvTalks',
        suffix: 'votes',
        extension: 'csv',
        type: 'text/csv;charset=utf-8',
        serialize: (projectExport) => CSV_BOM + talksToCsv(projectExport),
    },
    {
        i18nKey: 'dashboard.exportCsvComments',
        suffix: 'comments',
        extension: 'csv',
        type: 'text/csv;charset=utf-8',
        serialize: (projectExport) => CSV_BOM + commentsToCsv(projectExport),
    },
]

const menuId = 'dashboard-export-menu'

export const ExportButton = () => {
    const { t } = useTranslation()
    const [anchor, setAnchor] = useState<HTMLElement | null>(null)
    const project = useAppSelector(getSelectedProjectSelector)
    const voteItems = useAppSelector(getSortedVoteItemsSelector)
    const talks = useAppSelector(getTalksAsArraySelector)
    const speakers = useAppSelector(getSpeakersListSelector)
    const talkVotes = useAppSelector(getTalkVotesSelector)
    const isTalkLoaded = useAppSelector(isTalkLoadedSelector)
    const isTalkVotesLoaded = useAppSelector(isTalkVotesLoadedSelector)

    const onExport = (format: ExportFormat) => {
        setAnchor(null)
        if (!project) {
            return
        }
        const projectExport = buildProjectExport({
            project,
            voteItems,
            talks,
            speakers,
            talkVotes,
            exportedAt: new Date(),
        })
        downloadFile(
            toExportFileName(project.name, format.suffix, format.extension),
            format.serialize(projectExport),
            format.type
        )
    }

    return (
        <>
            <Button
                size="small"
                startIcon={<DownloadIcon />}
                aria-controls={menuId}
                aria-haspopup="true"
                disabled={!project || !isTalkLoaded || !isTalkVotesLoaded}
                onClick={(event) => setAnchor(event.currentTarget)}
            >
                {t('dashboard.export')}
            </Button>
            <Menu
                id={menuId}
                anchorEl={anchor}
                open={!!anchor}
                onClose={() => setAnchor(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                {EXPORT_FORMATS.map((format) => (
                    <MenuItem
                        key={format.i18nKey}
                        onClick={() => onExport(format)}
                    >
                        {t(format.i18nKey)}
                    </MenuItem>
                ))}
            </Menu>
        </>
    )
}
