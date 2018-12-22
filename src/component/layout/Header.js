import { Component } from "react"
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles'

import React from "react"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import { fade } from '@material-ui/core/styles/colorManipulator'
import InputBase from "@material-ui/core/InputBase"
import SearchIcon from '@material-ui/icons/Search'
import * as sessionActions from "../session/core/sessionActions"
import connect from "react-redux/es/connect/connect"
import logo from "./logo.svg"

const styles = theme => ({

    layout: {
        width: '100%',
        boxSizing: 'border-box',
        [theme.breakpoints.up(900 + theme.spacing.unit * 2 * 2)]: {
            width: 900,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    appBar: {
        color: theme.palette.text.secondary,
        borderColor: theme.palette.augmentColor,
        boxShadow: 'none'
    },
    logo: {
        margin: '5px 0'
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.5),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.8),
        },
        marginRight: theme.spacing.unit * 2,
        marginLeft: theme.spacing.unit * 2,
        width: '100%'
    },
    searchIcon: {
        width: theme.spacing.unit * 6,
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
        width: '100%',
    },
    inputInput: {
        paddingTop: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
        paddingLeft: theme.spacing.unit * 6,
        transition: theme.transitions.create('width'),
        width: '100%'
    },
})


class Header extends Component {

    onFilterChanged = (event) => {
        this.props.setSessionFilter(event.target.value)
    }

    render() {
        const {classes} = this.props

        return (

            <AppBar position="sticky" color="default" className={classes.appBar}>
                <Toolbar className={classes.layout}>

                    <img src={logo} width={60} height={60} className={classes.logo} alt="logo"/>

                    <div className={classes.search}>
                        <div className={classes.searchIcon}>
                            <SearchIcon/>
                        </div>
                        <InputBase
                            onChange={this.onFilterChanged}
                            placeholder="Search…"
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}
                        />
                    </div>
                </Toolbar>
            </AppBar>
        )
    }
}


Header.propTypes = {
    classes: PropTypes.object.isRequired
}

const mapDispatchToProps = Object.assign({}, sessionActions)

export default connect(null, mapDispatchToProps)(withStyles(styles)(Header))
