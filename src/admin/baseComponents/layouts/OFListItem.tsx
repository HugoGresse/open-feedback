import Grid, { GridProps } from '@mui/material/Grid'
import React, { forwardRef } from 'react'
import { darken, alpha, lighten } from '@mui/material/styles'
import { styled } from '@mui/material/styles'

type OFListItemProps = GridProps & {
    noBorderBottom?: boolean
}

const StyledGrid = styled(Grid)<OFListItemProps>(
    ({ theme, noBorderBottom }) => ({
        padding: '12px 30px',
        borderBottom: noBorderBottom
            ? 'none'
            : `1px solid ${
                  theme.palette.mode === 'light'
                      ? lighten(alpha(theme.palette.divider, 1), 0.88)
                      : darken(alpha(theme.palette.divider, 1), 0.68)
              }`,
        alignItems: 'flex-start',
    })
)

const OFListItem = forwardRef<HTMLDivElement, OFListItemProps>(
    ({ children, ...props }, ref) => {
        return (
            <StyledGrid ref={ref} container component="li" {...props}>
                {children}
            </StyledGrid>
        )
    }
)

OFListItem.displayName = 'OFListItem'

export default OFListItem
