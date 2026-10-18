import type { ReactNode } from 'react'
import Grid from '@mui/material/Grid'
import { OFInput } from '../form/input/OFInput.tsx'
import Fade from '@mui/material/Fade'
import CircularProgress from '@mui/material/CircularProgress'
import { OFButton } from '../button/OFButton.tsx'
import { makeStyles } from '@mui/styles'
import type { Theme } from '@mui/material/styles'
import { Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'

const useStyles = makeStyles((theme: Theme) => ({
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
            marginTop: (props: { title: boolean }) => (props.title ? 0 : 12),
        },
    },
}))

export interface OFListHeaderProps {
    title?: ReactNode
    filterValue?: string
    // Required unless `disableFilter` is set
    filterChange?: (value: string) => void
    disableFilter?: boolean
    buttonProcessing?: boolean
    // Required when `buttonText` is set
    buttonClick?: () => void
    buttonText?: ReactNode
}

export const OFListHeader = ({
    title,
    filterValue,
    filterChange,
    disableFilter,
    buttonProcessing,
    buttonClick,
    buttonText,
}: OFListHeaderProps) => {
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
                        onChange={(event) => filterChange?.(event.target.value)}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="Remove current search"
                                    onClick={() => filterChange?.('')}
                                    size="large"
                                >
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
                className={classes.headerRight}
            >
                <Fade in={buttonProcessing}>
                    <CircularProgress size={30} className={classes.progress} />
                </Fade>

                {buttonText && (
                    <OFButton onClick={() => buttonClick?.()}>
                        {buttonText}
                    </OFButton>
                )}
            </Grid>
        </Grid>
    )
}
