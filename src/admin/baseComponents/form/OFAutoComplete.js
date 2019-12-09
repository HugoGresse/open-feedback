import React from 'react'
import Autocomplete from '@material-ui/lab/Autocomplete'
import Tag from './Tag'
import OFInput from './OFInput'
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

    return (
        <Autocomplete
            {...other}
            options={dataArray}
            getOptionLabel={option => getLabel(option)}
            id={field.name}
            disabled={!!form.isSubmitting}
            defaultValue={field.value}
            onChange={(event, elements) =>
                form.setFieldValue(field.name, elements, false)
            }
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
