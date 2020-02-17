import React, { useCallback, useState } from 'react'
import SideBar from './SideBar'
import Box from '../../../baseComponents/design/Box'
import Header from './Header'
import COLORS from '../../../constants/colors'
import Container from '@material-ui/core/Container'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core'
import useTheme from '@material-ui/core/styles/useTheme'
import useMediaQuery from '@material-ui/core/useMediaQuery/useMediaQuery'
import makeStyles from '@material-ui/core/styles/makeStyles'

const innerTheme = createMuiTheme({
    palette: {
        type: 'light',
        primary: {
            light: '#ff9c76',
            main: '#ff6a49',
            dark: '#c6381e',
            contrastText: '#fff',
        },
    },
})

const useStyles = makeStyles(() => ({
    container: {
        padding: 24,
    },
    containerWrapped: {
        position: 'relative',
    },
    sidebar: {
        overflow: 'auto',
        flexGrow: 1,
    },
}))

const ProjectLayout = ({ baseUrl, children }) => {
    const classes = useStyles()

    const [scrollTargetRef, setRef] = useState(undefined)

    const scrollRef = useCallback(node => {
        if (node !== null) {
            setRef(node)
        }
    }, [])

    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
    const [state, setState] = React.useState({
        drawerOpen: !isMobile,
    })

    const toggleDrawer = open => event => {
        if (
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return
        }

        if (!isMobile) {
            // Menu always open is mobile
            return
        }

        setState({ ...state, drawerOpen: open })
    }

    return (
        <Box
            flex
            flexDirection="row"
            justifyContent="flex-start"
            flexGrow="1"
            height="100vh"
            background={COLORS.ADMIN_BACKGROUND_LIGHT}>
            <SideBar
                baseUrl={baseUrl}
                className={classes.sidebar}
                drawerOpen={state.drawerOpen}
                isMobile={isMobile}
                toggleDrawer={toggleDrawer(false)}
            />

            <div className={classes.sidebar} ref={scrollRef}>
                <Header
                    refTarget={scrollTargetRef}
                    toggleDrawer={toggleDrawer(true)}
                />

                <div className={classes.containerWrapped}>
                    <Container maxWidth="lg" className={classes.container}>
                        <MuiThemeProvider theme={innerTheme}>
                            {children}
                        </MuiThemeProvider>
                    </Container>
                </div>
            </div>
        </Box>
    )
}

export default ProjectLayout
