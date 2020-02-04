import Grid from '@material-ui/core/Grid'
import OFInput from '../form/input/OFInput'
import Fade from '@material-ui/core/Fade'
import CircularProgress from '@material-ui/core/CircularProgress'
import OFButton from '../OFButton'
import React from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { Typography } from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import InputAdornment from '@material-ui/core/InputAdornment'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'

const useStyles = makeStyles(theme => ({
    progress: {
        width: 30,
        height: 30,
        marginRight: 10,
        position: 'relative',
        verticalAlign: 'middle',
    },
    header: {
        padding: 20,
    },
    headerRight: {
        textAlign: 'right',
        [theme.breakpoints.down('sm')]: {
            marginTop: props => (props.title ? 0 : 12),
        },
    },
}))

const OFListHeader = ({
    title,
    filterValue,
    filterChange,
    disableFilter,
    buttonProcessing,
    buttonClick,
    buttonText,
}) => {
    const { t } = useTranslation()
    const classes = useStyles({ title: !!title })

    return (
        <Grid container className={classes.header}>
            {title && (
                <Grid item xs={8} sm={6} component={Typography} variant="h6">
                    {title}
                </Grid>
            )}
            {!disableFilter && (
                <Grid item xs={12} sm={6}>
                    <OFInput
                        placeholder={t('baseComponents.search')}
                        value={filterValue}
                        onChange={event => filterChange(event.target.value)}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="Remove current search"
                                    onClick={() => filterChange('')}>
                                    {filterValue ? <CloseIcon /> : ''}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </Grid>
            )}

            <Grid
                item
                xs={title ? 4 : 12}
                sm={6}
                className={classes.headerRight}>
                <Fade in={buttonProcessing}>
                    <CircularProgress size={30} className={classes.progress} />
                </Fade>

                <OFButton onClick={() => buttonClick()}>{buttonText}</OFButton>
            </Grid>
        </Grid>
    )
}
export default OFListHeader
