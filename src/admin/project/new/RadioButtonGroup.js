import React from 'react'
import RadioGroup from '@material-ui/core/RadioGroup'
import {ErrorMessage} from 'formik'
import FormControl from '@material-ui/core/FormControl'
import {Typography} from '@material-ui/core'

const RadioButtonGroup = ({
                              fieldName,
                              value,
                              error,
                              touched,
                              className,
                              children
                          }) => {
    return (
        <RadioGroup>
            {children}
            <ErrorMessage name={fieldName}/>
        </RadioGroup>
    )
}

export default RadioButtonGroup
