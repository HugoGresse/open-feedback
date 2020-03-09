import React from 'react'
import SearchIcon from '@material-ui/icons/Search'
import { setTalksFilter } from '../../core/talks/talksActions'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useTheme, makeStyles } from '@material-ui/core'
import InputAdornment from '@material-ui/core/InputAdornment'
import InputBase from '@material-ui/core/InputBase'

const useStyles = makeStyles(theme => ({
    container: {
        marginTop: 10,
        backgroundColor: theme.palette.background.paper,
    },
    wrapper: {
        width: '100%',
        marginLeft: 'auto',
        marginRight: 'auto',

        [theme.breakpoints.up('md')]: {
            width: 900,
        },
    },
    input: {
        height: 55,

        [theme.breakpoints.down('sm')]: {
            paddingLeft: 10,
            paddingRight: 10,
        },
    },
}))

const SearchBar = () => {
    const { t } = useTranslation()
    const theme = useTheme()
    const classes = useStyles()
    const dispatch = useDispatch()

    return (
        <div className={classes.container}>
            <div className={classes.wrapper}>
                <InputBase
                    className={classes.input}
                    placeholder={t('searchPlaceholder')}
                    fullWidth
                    onChange={event =>
                        dispatch(setTalksFilter(event.target.value))
                    }
                    startAdornment={
                        <InputAdornment position="start">
                            <SearchIcon
                                style={{ color: theme.palette.text.secondary }}
                            />
                        </InputAdornment>
                    }
                />
            </div>
        </div>
    )
}
export default SearchBar
