import React from 'react'
import Menu from '@mui/material/Menu'
import CardContent from '@mui/material/CardContent'
import TranslatedTypography from '../../baseComponents/TranslatedTypography.jsx'
import OFFormControlInputFormiked from '../../baseComponents/form/formControl/OFFormControlInputFormiked.jsx'
import Box from '@mui/material/Box'
import OFButton from '../../baseComponents/button/OFButton.jsx'
import { useTranslation } from 'react-i18next'


const ProjectIdChange = ({ anchorElement, disableSave, onSave, onCancel }) => {
    const { t } = useTranslation()

    return (
        <Menu
            anchorEl={anchorElement}
            keepMounted
            open={Boolean(anchorElement)}
            onClose={onCancel}>
            <CardContent sx={{maxWidth: 400, '&:focus': "none"}}>
                <TranslatedTypography
                    variant="h6"
                    i18nKey="newEvent.step1.eventIdName">
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
                        style={{ design: 'text', marginRight: 20 }}>
                        {t('common.cancel')}
                    </OFButton>
                    <OFButton
                        disabled={disableSave}
                        onClick={onSave}
                        style={{ customBg: '#FF2222' }}>
                        {t('common.save')}
                    </OFButton>
                </Box>
            </CardContent>
        </Menu>
    )
}

export default ProjectIdChange
