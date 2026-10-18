import Paper, { type PaperProps } from '@mui/material/Paper'
import { darken, alpha, lighten, type Theme } from '@mui/material/styles'
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

export type OFPaperProps = PaperProps

export const OFPaper = (props: OFPaperProps) => {
    const classes = useStyles()

    return (
        <Paper
            {...props}
            classes={{
                root: classes.root,
            }}
        />
    )
}
