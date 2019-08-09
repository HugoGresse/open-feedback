import React from 'react'
import logo from '../../assets/logo-openfeedback-white.png'
import withStyles from '@material-ui/core/styles/withStyles'
import COLORS from '../../constants/colors'

const styles = () => ({
    container: {
        background: COLORS.RED_ORANGE,
        padding: 32,
        marginBottom: -300,
        minHeight: 300
    },
    logo: {
        width: 200
    }
})

function RootHeader({ classes }) {
    return (
        <div className={classes.container}>
            <img className={classes.logo} src={logo} alt="open feedback logo" />
        </div>
    )
}

export default withStyles(styles)(RootHeader)
