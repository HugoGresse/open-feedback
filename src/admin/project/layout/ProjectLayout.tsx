import { useCallback, useState, type ReactNode } from 'react'
import { SideBar } from './SideBar.tsx'
import { Header } from './Header.tsx'
import { HEX_COLORS } from '../../../constants/colors'
import { Helmet } from 'react-helmet-async'
import { useAppSelector } from '../../../store'
import { getSelectedProjectSelector } from '../core/projectSelectors'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { makeStyles } from '@mui/styles'
import { useTheme } from '@mui/material'
import useMediaQuery from '@mui/material/useMediaQuery'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'

const innerTheme = createTheme({
    palette: {
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

/** What the drawer toggle reads from the triggering event. */
export interface DrawerToggleEvent {
    type?: string
    key?: string
}

export type DrawerToggleHandler = (event: DrawerToggleEvent) => void

export interface ProjectLayoutProps {
    baseUrl: string
    children?: ReactNode
}

export const ProjectLayout = ({ baseUrl, children }: ProjectLayoutProps) => {
    const classes = useStyles()

    const project = useAppSelector(getSelectedProjectSelector)
    const [scrollTargetRef, setRef] = useState<HTMLDivElement | undefined>(
        undefined
    )

    const scrollRef = useCallback((node: HTMLDivElement | null) => {
        if (node !== null) {
            setRef(node)
        }
    }, [])

    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    const [state, setState] = useState({
        drawerOpen: !isMobile,
    })

    const toggleDrawer =
        (open: boolean): DrawerToggleHandler =>
        (event) => {
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
            bgcolor={HEX_COLORS.ADMIN_BACKGROUND_LIGHT}
        >
            {project && (
                <Helmet>
                    <title>{project.name} - Admin</title>
                </Helmet>
            )}

            <SideBar
                baseUrl={baseUrl}
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
