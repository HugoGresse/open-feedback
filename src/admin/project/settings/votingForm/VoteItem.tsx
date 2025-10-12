import React, { useEffect, useState } from 'react'
// @ts-expect-error - JS module without types
import OFInput from '../../../baseComponents/form/input/OFInput.jsx'
import DeleteIcon from '@mui/icons-material/Delete'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import IconButton from '@mui/material/IconButton'
import Grid from '@mui/material/Grid'
import OFListItem from '../../../baseComponents/layouts/OFListItem.tsx'
import { makeStyles } from '@mui/styles'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { SelectChangeEvent } from '@mui/material/Select'
import { useTranslation } from 'react-i18next'
import {
    VOTE_TYPE_BOOLEAN,
    VOTE_TYPE_SEPARATOR,
    VOTE_TYPE_TEXT,
    VOTE_TYPE_TITLE,
    // @ts-expect-error - JS module without types
} from '../../../../core/contants'
// @ts-expect-error - JS module without types
import langMap from 'langmap'
// @ts-expect-error - JS module without types
import InputLangAdornment from './InputLangAdornment.jsx'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

// Types
export interface VoteItemType {
    id: string
    name: string | null
    position: number
    type: string
    local?: boolean
    oldId?: string
    languages?: Record<string, string>
}

interface VoteType {
    type: string
    name: string
}

interface VoteItemProps {
    id: string
    item: VoteItemType
    languages: string[]
    onChange: (_newValue: string) => void
    onLanguagesChange: (_langTag: string, _value: string) => void
    onDelete: () => void
    onEnterPressed: () => void
    onTypeChange: (_type: string) => void
    onFocus: () => void
    focusId?: string
    noBorderBottom?: boolean
}

const useStyles = makeStyles((_theme) => ({
    cell: {
        paddingRight: 12,
    },
    inputLang: {
        marginTop: 8,
    },
    typeCell: {},
    buttonCell: {
        textAlign: 'right',
    },
    dragIndicator: {
        cursor: 'grab',
        '&:active': {
            cursor: 'grabbing',
        },
    },
    sortableItem: {
        transition: 'transform 200ms ease',
    },
}))

const getTypes = (t: (_key: string) => string): VoteType[] => [
    {
        type: VOTE_TYPE_BOOLEAN,
        name: t('settingsVotingForm.typeBoolean'),
    },
    {
        type: VOTE_TYPE_TEXT,
        name: t('settingsVotingForm.typeText'),
    },
    {
        type: VOTE_TYPE_TITLE,
        name: t('settingsVotingForm.typeTitle'),
    },
    {
        type: VOTE_TYPE_SEPARATOR,
        name: t('settingsVotingForm.typeSeparator'),
    },
]

const VoteItem = ({
    id,
    item,
    languages,
    onChange,
    onLanguagesChange,
    onDelete,
    onEnterPressed,
    onTypeChange,
    onFocus,
    focusId,
    noBorderBottom,
}: VoteItemProps) => {
    const { t } = useTranslation()
    const classes = useStyles()
    const types = getTypes(t)
    const [focusedLangIndex, setFocusLangIndex] = useState<number>(-1)

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id })

    useEffect(() => {
        if (focusId !== item.id && focusedLangIndex >= 0) {
            setFocusLangIndex(-1)
        }
    }, [focusId, focusedLangIndex, item.id])

    const isSeparator = item.type === VOTE_TYPE_SEPARATOR

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    const handleInputKeyPress = (
        event: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (event.key === 'Enter') {
            if (languages.length > 0) {
                setFocusLangIndex(0)
            } else {
                onEnterPressed()
            }
            event.preventDefault()
        }
    }

    const handleLangInputKeyPress = (
        event: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (event.key === 'Enter') {
            if (focusedLangIndex >= languages.length - 1) {
                setFocusLangIndex(-1)
                onEnterPressed()
            } else if (languages.length > 0) {
                setFocusLangIndex(focusedLangIndex + 1)
            } else {
                setFocusLangIndex(-1)
                onEnterPressed()
            }
            event.preventDefault()
        }
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value)
    }

    const handleLangInputChange = (
        langTag: string,
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        onLanguagesChange(langTag, event.target.value)
    }

    const handleTypeChange = (event: SelectChangeEvent<string>) => {
        onTypeChange(event.target.value)
    }

    const handleInputFocus = () => {
        onFocus()
        if (focusedLangIndex >= 0) {
            setFocusLangIndex(-1)
        }
    }

    const handleLangInputFocus = (index: number) => {
        onFocus()
        setFocusLangIndex(index)
    }

    const shouldFocusInput = (input: HTMLInputElement | null): boolean => {
        return Boolean(input && focusId === item.id && focusedLangIndex === -1)
    }

    const shouldFocusLangInput = (
        input: HTMLInputElement | null,
        index: number
    ): boolean => {
        return Boolean(
            input && focusId === item.id && focusedLangIndex === index
        )
    }

    return (
        <OFListItem
            ref={setNodeRef}
            style={{
                paddingLeft: 20,
                paddingRight: 20,
                ...style,
            }}
            noBorderBottom={noBorderBottom}
            data-testid="VoteItem"
            className={classes.sortableItem}>
            <Grid item xs={12} sm={6} className={classes.cell}>
                <OFInput
                    value={item.name}
                    inputRef={(input: HTMLInputElement | null) =>
                        shouldFocusInput(input) && input?.focus()
                    }
                    disabled={isSeparator}
                    autoFocus={!item.name}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    onKeyPress={handleInputKeyPress}
                />
                {!isSeparator &&
                    languages.map((langTag, index) => (
                        <OFInput
                            key={langTag}
                            value={item.languages?.[langTag] || ''}
                            inputRef={(input: HTMLInputElement | null) =>
                                shouldFocusLangInput(input, index) &&
                                input?.focus()
                            }
                            className={classes.inputLang}
                            disabled={isSeparator}
                            onChange={(
                                event: React.ChangeEvent<HTMLInputElement>
                            ) => handleLangInputChange(langTag, event)}
                            onFocus={() => handleLangInputFocus(index)}
                            onKeyPress={(
                                event: React.KeyboardEvent<HTMLInputElement>
                            ) => handleLangInputKeyPress(event)}
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
                    onChange={handleTypeChange}
                    input={<OFInput />}>
                    {types.map((type) => (
                        <MenuItem key={type.type} value={type.type}>
                            {type.name}
                        </MenuItem>
                    ))}
                </Select>
            </Grid>
            <Grid item xs={12} sm={4} className={classes.buttonCell}>
                <IconButton
                    aria-label="drag to reorder"
                    size="large"
                    className={classes.dragIndicator}
                    {...attributes}
                    {...listeners}>
                    <DragIndicatorIcon />
                </IconButton>

                <IconButton aria-label="delete" onClick={onDelete} size="large">
                    <DeleteIcon />
                </IconButton>
            </Grid>
        </OFListItem>
    )
}

VoteItem.displayName = 'VoteItem'

export default VoteItem
