import type { ElementType, ReactNode } from 'react'
import { Trans } from 'react-i18next'
import { Typography, type TypographyProps } from '@mui/material'

export type TranslatedTypographyProps = Omit<
    TypographyProps<'span', { component?: ElementType }>,
    'children'
> & {
    i18nKey: string
    count?: number
    children?: ReactNode
}

export const TranslatedTypography = ({
    children,
    i18nKey,
    count = 1,
    ...otherProps
}: TranslatedTypographyProps) => {
    return (
        <Typography {...otherProps}>
            <Trans i18nKey={i18nKey} count={count}>
                {children}
            </Trans>
        </Typography>
    )
}
