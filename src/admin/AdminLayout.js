import React, { useCallback, useEffect, useState } from 'react'
import SideBar from './project/layout/SideBar'
import Box from '../baseComponents/design/Box'
import { connect } from 'react-redux'
import { getProjects } from './project/core/projectActions'
import { Grid } from '@material-ui/core'
import withStyles from '@material-ui/core/styles/withStyles'
import Header from './project/layout/Header'

const styles = theme => ({
    sidebar: {
        overflow: 'auto',
        flexGrow: 1
    }
})

function AdminLayout(props) {
    const { classes, match, children, getProjects } = props

    useEffect(() => {
        getProjects()
    }, [])

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
            textAlign="center"
            height="100vh"
        >
            <SideBar match={match} className={classes.sidebar} />
            <div className={classes.sidebar} ref={scrollRef}>
                <Header refTarget={scrollTargetRef} />
                <div>
                    <Grid container>
                        <Grid item xs={12}>
                            {children}
                        </Grid>
                    </Grid>
                </div>
            </div>
        </Box>
    )
}

const mapStateToProps = state => ({})

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
