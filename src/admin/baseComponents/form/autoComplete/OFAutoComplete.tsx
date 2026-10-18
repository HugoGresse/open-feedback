import type { ReactNode, Ref } from 'react'
import Autocomplete, {
    type AutocompleteProps,
} from '@mui/material/Autocomplete'
import { Tag } from './Tag.tsx'
import { OFInput, type OFInputProps } from '../input/OFInput.tsx'
import styled from 'styled-components'

interface AutoCompleteInputProps extends OFInputProps {
    forwardedRef2?: Ref<HTMLDivElement>
}

const AutoCompleteInputBase = ({
    forwardedRef2,
    ...props
}: AutoCompleteInputProps) => (
    <OFInput {...props} forwardedRef={forwardedRef2} />
)

const AutoCompleteInput = styled(AutoCompleteInputBase)`
    height: auto;
    min-height: 40px;
    padding-left: 4px;
`

/**
 * An option is either a plain string or an object whose label is built from
 * `keyToDisplay`/`keysToDisplay`.
 */
export type OFAutoCompleteOption = string | Record<string, unknown>

export type OFAutoCompleteValue =
    | OFAutoCompleteOption
    | OFAutoCompleteOption[]
    | null

/**
 * Subset of Formik's `FieldProps` used by the component (it is usually rendered
 * through `<Field component={OFAutoComplete} />`).
 */
export interface OFAutoCompleteField {
    name: string
    value: OFAutoCompleteValue
}

export interface OFAutoCompleteForm {
    isSubmitting: boolean
    initialValues: Record<string, unknown>
    setFieldValue: (
        field: string,
        value: unknown,
        shouldValidate?: boolean
    ) => unknown
}

type MuiAutocompleteProps = AutocompleteProps<
    OFAutoCompleteOption,
    boolean | undefined,
    boolean | undefined,
    boolean | undefined
>

export interface OFAutoCompleteProps
    extends Omit<
        Partial<MuiAutocompleteProps>,
        | 'options'
        | 'value'
        | 'getOptionLabel'
        | 'isOptionEqualToValue'
        | 'id'
        | 'disabled'
        | 'defaultValue'
        | 'onClose'
        | 'onChange'
        | 'onInputChange'
        | 'renderTags'
        | 'renderInput'
    > {
    field: OFAutoCompleteField
    form: OFAutoCompleteForm
    dataArray: readonly OFAutoCompleteOption[]
    keyToDisplay?: string
    keysToDisplay?: string[]
}

export const OFAutoComplete = ({
    field,
    form,
    dataArray,
    keyToDisplay,
    keysToDisplay,
    ...other
}: OFAutoCompleteProps) => {
    const getLabel = (option: OFAutoCompleteOption): string => {
        if (typeof option === 'string') {
            return option
        }
        if (keyToDisplay && option[keyToDisplay]) {
            return String(option[keyToDisplay])
        }

        if (keysToDisplay) {
            return keysToDisplay.map((key) => option[key]).join(' - ')
        }
        return String(option)
    }
    let inputChangeValue: string | null = null

    return (
        <Autocomplete
            {...other}
            options={dataArray}
            value={field.value}
            getOptionLabel={(option) => getLabel(option)}
            isOptionEqualToValue={(a, b) => getLabel(a) === getLabel(b)}
            id={field.name}
            disabled={!!form.isSubmitting}
            defaultValue={form.initialValues[field.name] as OFAutoCompleteValue}
            blurOnSelect={true}
            onClose={() => {
                if (
                    other.freeSolo &&
                    other.multiple &&
                    inputChangeValue &&
                    inputChangeValue.length > 0 &&
                    Array.isArray(field.value) &&
                    field.value.indexOf(inputChangeValue) === -1
                ) {
                    // If the field can have arbitrary value (freeSolo) && can have multiple value, when the field is
                    // blurred, we update the value
                    form.setFieldValue(
                        field.name,
                        [...field.value, inputChangeValue],
                        false
                    )
                }
            }}
            onChange={(_event, elements) =>
                form.setFieldValue(field.name, elements, false)
            }
            onInputChange={(_event, value) => {
                inputChangeValue = value
                if (other.freeSolo && !other.multiple) {
                    form.setFieldValue(field.name, value, false)
                }
            }}
            renderTags={(value, getTagProps) =>
                value.map((option, index): ReactNode => {
                    const { key, ...tagProps } = getTagProps({ index })
                    return (
                        <Tag label={getLabel(option)} key={key} {...tagProps} />
                    )
                })
            }
            renderInput={(params) => {
                const { InputProps, InputLabelProps, inputProps, ...other } =
                    params
                const { ref, ...otherInputProps } = InputProps

                return (
                    <AutoCompleteInput
                        {...other}
                        {...otherInputProps}
                        inputProps={inputProps}
                        forwardedRef2={ref}
                        onKeyPress={(ev) => {
                            if (ev.key === 'Enter') {
                                ev.preventDefault()
                            }
                        }}
                    />
                )
            }}
        />
    )
}
