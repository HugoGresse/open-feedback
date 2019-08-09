import React, { useCallback, useEffect, useState } from 'react'
import SideBar from './project/layout/SideBar'
import Box from '../baseComponents/design/Box'
import { connect } from 'react-redux'
import { getProjects } from './project/core/projectActions'
import withStyles from '@material-ui/core/styles/withStyles'
import Header from './project/layout/Header'
import COLORS from '../constants/colors'
import Container from '@material-ui/core/Container'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core'

const innerTheme = createMuiTheme({
    palette: {
        type: 'light',
        primary: {
            light: '#ff9c76',
            main: '#ff6a49',
            dark: '#c6381e',
            contrastText: '#fff'
        }
    }
})

const styles = () => ({
    container: {
        padding: 24
    },
    sidebar: {
        overflow: 'auto',
        flexGrow: 1
    }
})

function AdminLayout(props) {
    const { classes, match, children, getProjects } = props

    useEffect(() => {
        getProjects()
    }, [getProjects])

    const [scrollTargetRef, setRef] = useState(undefined)

    const scrollRef = useCallback(node => {
        if (node !== null) {
            setRef(node)
        }
    }, [])

    return (
        <Box
            flex
            flexDirection="row"
            justifyContent="flex-start"
            flexGrow="1"
            height="100vh"
            background={COLORS.ADMIN_BACKGROUND_LIGHT}
        >
            <SideBar match={match} className={classes.sidebar} />
            <div className={classes.sidebar} ref={scrollRef}>
                <Header refTarget={scrollTargetRef} />

                <Container maxWidth="lg" className={classes.container}>
                    <MuiThemeProvider theme={innerTheme}>
                        {children}
                    </MuiThemeProvider>
                </Container>
            </div>
        </Box>
    )
}

const mapStateToProps = () => ({})

const mapDispatchToProps = Object.assign(
    {},
    {
        getProjects: getProjects
    }
)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(AdminLayout))
