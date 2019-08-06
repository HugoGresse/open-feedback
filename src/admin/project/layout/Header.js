import React, { Component } from 'react'
import { COLORS } from '../../../constants/colors'
import { connect } from 'react-redux'
import { createMuiTheme, withStyles, useScrollTrigger } from '@material-ui/core'
import useScrollTrigger from '@material-ui/core/useScrollTrigger'
import { MuiThemeProvider } from '@material-ui/core/styles'
import Slide from '@material-ui/core/Slide'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

const innerTheme = createMuiTheme({
    typography: {
        useNextVariants: true
    },
    palette: {
        //type: 'dark',
    }
})

const styles = theme => ({
    container: {
        background: COLORS.RED_ORANGE
    }
})

function HideOnScroll(props) {
    const { children, window } = props

    return (
        <Slide appear={false} direction="down" in={useScrollTrigger()}>
            {children}
        </Slide>
    )
}

class Header extends Component {
    render() {
        const { classes, match } = this.props

        return (
            <MuiThemeProvider theme={innerTheme}>
                <HideOnScroll {...this.props}>
                    <AppBar>
                        <Toolbar>
                            <Typography variant="h6">
                                Scroll to Hide App Bar
                            </Typography>
                        </Toolbar>
                    </AppBar>
                </HideOnScroll>

                <Toolbar />
                <div className={classes.container}>
                    Haa <br />
                    Haa <br />
                    Haa <br />
                    Haa <br />
                    Haa <br />
                    Haa <br />
                    Haa <br />
                    Haa <br />
                    Haa <br />
                    Haa <br />
                    Haa <br />
                    Haa <br />
                    Haa <br />
                    Haa <br />
                    Haa <br />
                    Haa <br />
                    Haa <br />
                    Haa <br />
                    Haa <br />
                    Haa <br />
                    Haa <br />
                    Haa <br />
                    Haa <br />
                    Haa <br />
                    Haa <br />
                    Haa <br />
                    Haa <br />
                    Haa <br />
                    Haa <br />
                    Haa <br />
                    Haa <br />
                    Haa <br />
                    Haa <br />
                    Haa <br />
                    Haa <br />
                    Haa <br />
                    Haa <br />
                    Haa <br />
                    Haa <br />
                    Haa <br />
                    Haa <br />
                    Haa <br />
                    Haa <br />
                    Haa <br />
                    Haa <br />
                    Haa <br />
                    Haa <br />
                    Haa <br />
                    Haa <br />
                    Haa <br />
                    Haa <br />
                    Haa <br />
                    Haa <br />
                    Haa <br />
                    Haa <br />
                </div>
            </MuiThemeProvider>
        )
    }
}

const mapStateToProps = state => ({})

const mapDispatchToProps = Object.assign({}, {})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(Header))
