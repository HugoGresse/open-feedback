import { alpha, darken, lighten, type Theme } from '@mui/material/styles'
import { Card, type CardProps } from '@mui/material'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        boxShadow: 'none',
        border: `1px solid
    ${
        theme.palette.mode === 'light'
            ? lighten(alpha(theme.palette.divider, 1), 0.88)
            : darken(alpha(theme.palette.divider, 1), 0.68)
    }`,
    },
}))

export type OFCardProps = CardProps

export const OFCard = (props: OFCardProps) => {
    const classes = useStyles()

    return (
        <Card
            {...props}
            classes={{
                root: classes.root,
            }}
        />
    )
}
