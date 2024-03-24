import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import CheckIcon from '@mui/icons-material/Check'
import Fade from '@mui/material/Fade'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'

const AutoSaveNotice = ({ saveDate }) => {
    const [isDisplayed, setDisplay] = useState(false)
    const { t } = useTranslation()

    useEffect(() => {
        if (saveDate) {
            setDisplay(true)
            setTimeout(() => {
                setDisplay(false)
            }, 2000)
        } else {
            setDisplay(false)
        }
    }, [saveDate])

    return (
        <Box margin={1} textAlign="right">
            <Fade in={isDisplayed}>
                <Typography>
                    <CheckIcon
                        style={{ color: 'green', verticalAlign: 'text-bottom' }}
                    />
                    {t('common.saved')}
                </Typography>
            </Fade>
        </Box>
    )
}

export default AutoSaveNotice
