import Grid from '@mui/material/Grid'
import OFInput from '../form/input/OFInput.jsx'
import Fade from '@mui/material/Fade'
import CircularProgress from '@mui/material/CircularProgress'
import OFButton from '../button/OFButton.jsx'
import React from 'react'
import { makeStyles } from '@mui/styles'
import { Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'

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
        [theme.breakpoints.down('xl')]: {
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
                                    onClick={() => filterChange('')}
                                    size="large">
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

                {buttonText && (
                    <OFButton onClick={() => buttonClick()}>
                        {buttonText}
                    </OFButton>
                )}
            </Grid>
        </Grid>
    );
}
export default OFListHeader
