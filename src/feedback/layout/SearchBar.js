import React from 'react'
import SearchIcon from '@material-ui/icons/Search'
import { setTalksFilter } from '../../core/talks/talksActions'
import BigInput from '../../baseComponents/design/BigInput'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useTheme, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
    container: {
        marginTop: 10,
        backgroundColor: theme.palette.background.paper,
    },
    wrapper: {
        width: '100%',
        marginLeft: 'auto',
        marginRight: 'auto',

        [theme.breakpoints.up(900)]: {
            width: 900,
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
                <BigInput
                    onChange={event =>
                        dispatch(setTalksFilter(event.target.value))
                    }
                    icon={
                        <SearchIcon
                            style={{ color: theme.palette.text.secondary }}
                        />
                    }
                    placeholder={t('searchPlaceholder')}
                />
            </div>
        </div>
    )
}
export default SearchBar
