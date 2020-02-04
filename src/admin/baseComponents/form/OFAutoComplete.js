import React from 'react'
import Autocomplete from '@material-ui/lab/Autocomplete'
import Tag from './Tag'
import OFInput from './input/OFInput'
import styled from 'styled-components'

const AutoCompleteInput = styled(({ forwardedRef2, ...props }) => (
    <OFInput {...props} forwardedRef={forwardedRef2} />
))`
    height: auto;
    min-height: 40px;
    padding-left: 4px;
`

const OFAutoComplete = ({ field, form, dataArray, keyToDisplay, ...other }) => {
    const getLabel = option => (keyToDisplay ? option[keyToDisplay] : option)
    let inputChangeValue = null

    return (
        <Autocomplete
            {...other}
            options={dataArray}
            value={field.value}
            getOptionLabel={option => getLabel(option)}
            id={field.name}
            disabled={!!form.isSubmitting}
            defaultValue={field.value}
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
            renderInput={params => {
                // eslint-disable-next-line no-unused-vars
                const {
                    InputProps,
                    InputLabelProps,
                    inputProps,
                    ...other
                } = params
                const { ref, ...otherInputProps } = InputProps

                return (
                    <AutoCompleteInput
                        {...other}
                        {...otherInputProps}
                        inputProps={inputProps}
                        forwardedRef2={ref}
                        onKeyPress={ev => {
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
