import React from 'react'
import Menu from '@material-ui/core/Menu'
import CardContent from '@material-ui/core/CardContent'
import TranslatedTypography from '../../baseComponents/TranslatedTypography'
import OFFormControlInputFormiked from '../../baseComponents/form/OFFormControlInputFormiked'
import Box from '@material-ui/core/Box'
import OFButton from '../../baseComponents/OFButton'
import { useTranslation } from 'react-i18next'
import makeStyles from '@material-ui/core/styles/makeStyles'

const useStyles = makeStyles({
    cardContent: {
        maxWidth: 400,
        '&:focus': {
            outline: 'none',
        },
    },
})

const ProjectIdChange = ({ anchorElement, disableSave, onSave, onCancel }) => {
    const { t } = useTranslation()
    const classes = useStyles()

    return (
        <Menu
            anchorEl={anchorElement}
            keepMounted
            open={Boolean(anchorElement)}
            onClose={onCancel}>
            <CardContent className={classes.cardContent}>
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
