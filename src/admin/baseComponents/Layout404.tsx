import { Box } from '@mui/material'
import Typography from '@mui/material/Typography'
import { Trans, useTranslation } from 'react-i18next'
import { NavLinkMui } from '../project/layout/NavLinkMui.tsx'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { makeStyles } from '@mui/styles'
import type { Theme } from '@mui/material/styles'

const useStyles = makeStyles((theme: Theme) => ({
    quatrecentquatre: {
        animation: '$rainbow 2s step-start infinite',
    },
    '@keyframes rainbow': {
        '100%,0%': {
            color: 'rgb(255, 0, 0)',
        },
        '8%': {
            color: 'rgb(255, 127, 0)',
        },
        '16%': {
            color: 'rgb(255, 255, 0)',
        },
        '25%': {
            color: 'rgb(127, 255, 0)',
        },
        '33%': {
            color: 'rgb(0, 255, 0)',
        },
        '41%': {
            color: 'rgb(0, 255, 127)',
        },
        '50%': {
            color: 'rgb(0, 255, 255)',
        },
        '58%': {
            color: 'rgb(0, 127, 255)',
        },
        '66%': {
            color: 'rgb(0, 0, 255)',
        },
        '75%': {
            color: 'rgb(127, 0, 255)',
        },
        '83%': {
            color: 'rgb(255, 0, 255)',
        },
        '91%': {
            color: 'rgb(255, 0, 127)',
        },
    },
    link: {
        display: 'flex',
        alignItems: 'center',
        color: '#555',
        '&:hover': {
            color: theme.palette.primary.main,
        },
    },
}))

export const Layout404 = () => {
    const classes = useStyles()
    const pathname = window.location.pathname
    const { t } = useTranslation()
    // Resolved outside JSX: inside NavLink children, t() would infer its
    // return type from NavLink's render-prop children type.
    const goToAdminLabel: string = t('layout.goToAdmin')

    return (
        <Box padding={4} bgcolor="#eee">
            <Typography variant="h1" className={classes.quatrecentquatre}>
                404
            </Typography>

            <Typography>
                <Trans i18nKey="layout.404">
                    The requested URL {{ pathname }} was not found on this
                    server.
                </Trans>
            </Typography>

            <pre> ¯\_(ツ)_/¯</pre>

            <NavLinkMui to={`/admin`} className={classes.link}>
                <ArrowBackIcon fontSize="small" /> {goToAdminLabel}
            </NavLinkMui>
        </Box>
    )
}
