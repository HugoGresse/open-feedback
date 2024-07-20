import { Trans } from 'react-i18next'
import { Typography } from '@mui/material'
import React from 'react'

const TranslatedTypography = ({
    children,
    i18nKey,
    count = 1,
    ...otherProps
}) => {
    return (
        <Typography {...otherProps}>
            <Trans i18nKey={i18nKey} count={count}>
                {children}
            </Trans>
        </Typography>
    )
}

export default TranslatedTypography
