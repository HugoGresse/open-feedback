import React, { useCallback, useState } from 'react'
import SideBar from './SideBar.jsx'
import Header from './Header.jsx'
import COLORS from '../../../constants/colors'
import { Helmet } from 'react-helmet-async'
import { useSelector } from 'react-redux'
import { getSelectedProjectSelector } from '../core/projectSelectors'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { makeStyles } from '@mui/styles'
import { useTheme } from '@mui/material'
import useMediaQuery from '@mui/material/useMediaQuery'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'

const innerTheme = createTheme({
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
    content: {
        overflow: 'auto',
        flexGrow: 1,
    },
}))

const ProjectLayout = ({ baseUrl, children }) => {
    const classes = useStyles()

    const project = useSelector(getSelectedProjectSelector)
    const [scrollTargetRef, setRef] = useState(undefined)

    const scrollRef = useCallback((node) => {
        if (node !== null) {
            setRef(node)
        }
    }, [])

    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
    const [state, setState] = React.useState({
        drawerOpen: !isMobile,
    })

    const toggleDrawer = (open) => (event) => {
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
            display="flex"
            flexDirection="row"
            justifyContent="flex-start"
            flexGrow="1"
            height="100vh"
            bgcolor={COLORS.ADMIN_BACKGROUND_LIGHT}
        >
            {project && (
                <Helmet>
                    <title>{project.name} - Admin</title>
                </Helmet>
            )}

            <SideBar
                baseUrl={baseUrl}
                className={classes.sidebar}
                drawerOpen={state.drawerOpen}
                isMobile={isMobile}
                toggleDrawer={toggleDrawer(false)}
            />

            <div className={classes.content} ref={scrollRef} id="content">
                <Header
                    refTarget={scrollTargetRef}
                    toggleDrawer={toggleDrawer(true)}
                />

                <div className={classes.containerWrapped}>
                    <Container
                        maxWidth="lg"
                        className={classes.container}
                        component="main"
                    >
                        <ThemeProvider theme={innerTheme}>
                            {children}
                        </ThemeProvider>
                    </Container>
                </div>
            </div>
        </Box>
    )
}

export default ProjectLayout
