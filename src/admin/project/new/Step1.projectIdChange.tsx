import Menu from '@mui/material/Menu'
import CardContent from '@mui/material/CardContent'
import { TranslatedTypography } from '../../baseComponents/TranslatedTypography.tsx'
import { OFFormControlInputFormiked } from '../../baseComponents/form/formControl/OFFormControlInputFormiked.tsx'
import Box from '@mui/material/Box'
import { OFButton } from '../../baseComponents/button/OFButton.tsx'
import { useTranslation } from 'react-i18next'

export interface ProjectIdChangeProps {
    anchorElement: HTMLElement | null
    disableSave: boolean
    onSave: () => void
    onCancel: () => void
}

export const ProjectIdChange = ({
    anchorElement,
    disableSave,
    onSave,
    onCancel,
}: ProjectIdChangeProps) => {
    const { t } = useTranslation()

    return (
        <Menu
            anchorEl={anchorElement}
            keepMounted
            open={Boolean(anchorElement)}
            onClose={onCancel}
        >
            <CardContent sx={{ maxWidth: 400, '&:focus': 'none' }}>
                <TranslatedTypography
                    variant="h6"
                    i18nKey="newEvent.step1.eventIdName"
                >
                    Event ID
                </TranslatedTypography>
                <TranslatedTypography i18nKey="newEvent.step1.eventIdDescription">
                    desc
                </TranslatedTypography>

                <OFFormControlInputFormiked
                    name={t('newEvent.step1.eventIdName')}
                    fieldName="id"
                    type="text"
                    autoFocus={true}
                    displayErrorMessageDirectly={true}
                />

                <Box marginTop={3} display="flex" justifyContent="flex-end">
                    <OFButton
                        onClick={onCancel}
                        style={{ design: 'text', marginRight: 20 }}
                    >
                        {t('common.cancel')}
                    </OFButton>
                    <OFButton
                        disabled={disableSave}
                        onClick={onSave}
                        style={{ customBg: '#FF2222' }}
                    >
                        {t('common.save')}
                    </OFButton>
                </Box>
            </CardContent>
        </Menu>
    )
}
