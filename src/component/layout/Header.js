import { Component } from "react"
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import React from "react"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import { fade } from '@material-ui/core/styles/colorManipulator';
import InputBase from "@material-ui/core/InputBase"
import SearchIcon from '@material-ui/icons/Search'

const styles = theme => ({

    layout: {
        width: '100%',
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(900 + theme.spacing.unit * 3 * 2)]: {
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
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.5),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.8),
        },
        marginRight: theme.spacing.unit * 2,
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing.unit * 3
        },
    },
    searchIcon: {
        width: theme.spacing.unit * 9,
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
        paddingLeft: theme.spacing.unit * 10,
        transition: theme.transitions.create('width'),
        width: '100%'
    },
});


class Header extends Component {

    onFilterChanged = (event) => {
        console.log(event.target.value)
    }

    render() {
        const {classes} = this.props;

        return (

            <AppBar position="sticky" color="default" className={classes.appBar}>
                <Toolbar className={classes.layout}>

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
};

export default withStyles(styles)(Header);