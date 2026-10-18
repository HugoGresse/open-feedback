import SearchIcon from '@mui/icons-material/Search'
import { setTalksFilter } from '../../core/talks/talksActions'
import { useAppDispatch } from '../../store'
import { useTranslation } from 'react-i18next'
import { type Theme, useTheme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import InputAdornment from '@mui/material/InputAdornment'
import InputBase from '@mui/material/InputBase'
import { grey } from '@mui/material/colors'

const useStyles = makeStyles((theme: Theme) => ({
    container: {
        backgroundColor:
            theme.palette.mode === 'dark'
                ? theme.palette.background.paper
                : grey[100],
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

        [theme.breakpoints.down('lg')]: {
            paddingLeft: 10,
            paddingRight: 10,
        },
    },
}))

export const SearchBar = () => {
    const { t } = useTranslation()
    const theme = useTheme()
    const classes = useStyles()
    const dispatch = useAppDispatch()

    return (
        <div className={classes.container}>
            <div className={classes.wrapper}>
                <InputBase
                    className={classes.input}
                    placeholder={t('searchPlaceholder')}
                    fullWidth
                    onChange={(event) =>
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
