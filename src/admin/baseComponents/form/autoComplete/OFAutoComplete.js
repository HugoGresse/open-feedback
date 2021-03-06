import React from 'react'
import Autocomplete from '@material-ui/lab/Autocomplete'
import Tag from './Tag'
import OFInput from '../input/OFInput'
import styled from 'styled-components'

const AutoCompleteInput = styled(({ forwardedRef2, ...props }) => (
    <OFInput {...props} forwardedRef={forwardedRef2} />
))`
    height: auto;
    min-height: 40px;
    padding-left: 4px;
`

const OFAutoComplete = ({
    field,
    form,
    dataArray,
    keyToDisplay,
    keysToDisplay,
    ...other
}) => {
    const getLabel = (option) => {
        if (keyToDisplay && option[keyToDisplay]) {
            return option[keyToDisplay]
        }

        if (keysToDisplay) {
            return keysToDisplay.map((key) => option[key]).join(' - ')
        }
        return option
    }
    let inputChangeValue = null

    return (
        <Autocomplete
            {...other}
            options={dataArray}
            value={field.value}
            getOptionLabel={(option) => getLabel(option)}
            getOptionSelected={(a, b) => getLabel(a) === getLabel(b)}
            id={field.name}
            disabled={!!form.isSubmitting}
            defaultValue={form.initialValues[field.name]}
            blurOnSelect={true}
            onClose={() => {
                if (
                    other.freeSolo &&
                    other.multiple &&
                    inputChangeValue &&
                    inputChangeValue.length > 0 &&
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
            onChange={(event, elements) =>
                form.setFieldValue(field.name, elements, false)
            }
            onInputChange={(event, value) => {
                inputChangeValue = value
                if (other.freeSolo && !other.multiple) {
                    form.setFieldValue(field.name, value, false)
                }
            }}
            renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                    <Tag
                        label={getLabel(option)}
                        key={getLabel(option)}
                        {...getTagProps({ index })}
                    />
                ))
            }
            renderInput={(params) => {
                /* eslint-disable no-unused-vars */
                const {
                    InputProps,
                    InputLabelProps,
                    inputProps,
                    ...other
                } = params
                /* eslint-disable no-unused-vars */
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

export default OFAutoComplete
