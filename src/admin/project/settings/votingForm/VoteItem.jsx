import React, { useEffect, useState } from 'react'
import OFInput from '../../../baseComponents/form/input/OFInput.jsx'
import ArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import ArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import DeleteIcon from '@mui/icons-material/Delete'
import IconButton from '@mui/material/IconButton'
import Grid from '@mui/material/Grid'
import OFListItem from '../../../baseComponents/layouts/OFListItem.jsx'
import { makeStyles } from '@mui/styles'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { useTranslation } from 'react-i18next'
import { VOTE_TYPE_BOOLEAN, VOTE_TYPE_TEXT } from '../../../../core/contants'
import langMap from 'langmap'
import InputLangAdornment from './InputLangAdornment.jsx'

const useStyles = makeStyles((theme) => ({
    cell: {
        paddingRight: 12,
        [theme.breakpoints.down('xl')]: {
            paddingTop: 12,
            paddingRight: 0,
        },
    },
    inputLang: {
        marginTop: 8,
    },
    typeCell: {
        [theme.breakpoints.down('xl')]: {
            paddingTop: 12,
        },
    },
    buttonCell: {
        textAlign: 'right',
    },
}))

const getTypes = (t) => [
    {
        type: VOTE_TYPE_BOOLEAN,
        name: t('settingsVotingForm.typeBoolean'),
    },
    {
        type: VOTE_TYPE_TEXT,
        name: t('settingsVotingForm.typeText'),
    },
]

const VoteItem = ({
    item,
    languages,
    onChange,
    onLanguagesChange,
    onMoveUp,
    onMoveDown,
    onDelete,
    onEnterPressed,
    onTypeChange,
    onFocus,
    focusId,
}) => {
    const { t } = useTranslation()
    const classes = useStyles()
    const types = getTypes(t)
    const [focusedLangIndex, setFocusLangIndex] = useState(-1)

    useEffect(() => {
        if (focusId !== item.id && focusedLangIndex >= 0) {
            setFocusLangIndex(-1)
        }
    }, [focusId, setFocusLangIndex, focusedLangIndex, item.id])

    return (
        <OFListItem
            style={{ paddingLeft: 20, paddingRight: 20 }}
            data-testid="VoteItem">
            <Grid item xs={12} sm={6} className={classes.cell}>
                <OFInput
                    value={item.name}
                    inputRef={(input) =>
                        input &&
                        focusId === item.id &&
                        focusedLangIndex === -1 &&
                        input.focus()
                    }
                    autoFocus={!item.name}
                    onChange={(event) => onChange(event.target.value)}
                    onFocus={() => {
                        onFocus && onFocus(item)
                        if (focusedLangIndex >= 0) {
                            setFocusLangIndex(-1)
                        }
                    }}
                    onKeyPress={(ev) => {
                        if (ev.key === 'Enter') {
                            if (languages.length > 0) {
                                setFocusLangIndex(0)
                            } else {
                                onEnterPressed && onEnterPressed(item)
                            }
                            ev.preventDefault()
                        }
                    }}
                />
                {languages.map((langTag, index) => (
                    <OFInput
                        key={langTag}
                        value={item.languages ? item.languages[langTag] : ''}
                        inputRef={(input) => {
                            return (
                                input &&
                                focusId === item.id &&
                                focusedLangIndex === index &&
                                input.focus()
                            )
                        }}
                        className={classes.inputLang}
                        onChange={(event) =>
                            onLanguagesChange(langTag, event.target.value)
                        }
                        onFocus={() => {
                            onFocus && onFocus(item)
                            setFocusLangIndex(index)
                        }}
                        onKeyPress={(ev) => {
                            if (ev.key === 'Enter') {
                                if (focusedLangIndex >= languages.length - 1) {
                                    setFocusLangIndex(-1)
                                    onEnterPressed && onEnterPressed(item)
                                } else if (languages.length > 0) {
                                    setFocusLangIndex(focusedLangIndex + 1)
                                } else {
                                    setFocusLangIndex(-1)
                                    onEnterPressed && onEnterPressed(item)
                                }
                                ev.preventDefault()
                            }
                        }}
                        startAdornment={
                            <InputLangAdornment
                                tooltipContent={`${
                                    langMap[langTag].nativeName
                                } (${langTag}) - ${t(
                                    'settingsVotingForm.editLang'
                                )}`}>
                                {' '}
                                {langMap[langTag].nativeName}{' '}
                            </InputLangAdornment>
                        }
                    />
                ))}
            </Grid>
            <Grid item xs={12} sm={2} className={classes.typeCell}>
                <Select
                    id="vote-item-type"
                    value={item.type}
                    onChange={(event) => onTypeChange(event.target.value)}
                    input={<OFInput />}>
                    {types.map((type) => (
                        <MenuItem key={type.type} value={type.type}>
                            {type.name}
                        </MenuItem>
                    ))}
                </Select>
            </Grid>
            <Grid item xs={12} sm={4} className={classes.buttonCell}>
                <IconButton aria-label="move up" onClick={() => onMoveUp()} size="large">
                    <ArrowUpIcon />
                </IconButton>

                <IconButton aria-label="move down" onClick={() => onMoveDown()} size="large">
                    <ArrowDownIcon />
                </IconButton>

                <IconButton aria-label="delete" onClick={() => onDelete()} size="large">
                    <DeleteIcon />
                </IconButton>
            </Grid>
        </OFListItem>
    );
}

export default VoteItem
