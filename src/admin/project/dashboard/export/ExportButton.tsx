import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import DownloadIcon from '@mui/icons-material/FileDownloadOutlined'
import { useAppDispatch, useAppSelector } from '../../../../store'
import {
    getSelectedProjectSelector,
    isProjectApiInitSelector,
} from '../../core/projectSelectors'
import { EXPORT_FORMATS, type ExportFormat } from './exportFormats'
import { exportProject } from './exportProjectActions'

const buttonId = 'dashboard-export-button'
const menuId = 'dashboard-export-menu'

export const ExportButton = () => {
    const { t } = useTranslation()
    const dispatch = useAppDispatch()
    const [anchor, setAnchor] = useState<HTMLElement | null>(null)
    const [isExporting, setExporting] = useState(false)
    const project = useAppSelector(getSelectedProjectSelector)
    const isProjectApiInit = useAppSelector(isProjectApiInitSelector)
    const isOpen = !!anchor

    const onExport = (format: ExportFormat) => {
        setAnchor(null)
        setExporting(true)
        dispatch(exportProject(format)).finally(() => setExporting(false))
    }

    return (
        <>
            <Button
                id={buttonId}
                size="small"
                startIcon={<DownloadIcon />}
                aria-controls={isOpen ? menuId : undefined}
                aria-haspopup="true"
                aria-expanded={isOpen ? 'true' : undefined}
                disabled={!project || !isProjectApiInit || isExporting}
                onClick={(event) => setAnchor(event.currentTarget)}
            >
                {t('dashboard.export')}
            </Button>
            <Menu
                id={menuId}
                anchorEl={anchor}
                open={isOpen}
                onClose={() => setAnchor(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                MenuListProps={{ 'aria-labelledby': buttonId }}
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
