import React from 'react'
import RadioGroup from '@material-ui/core/RadioGroup'
import {ErrorMessage} from 'formik'

const RadioButtonGroup = ({
                              fieldName,
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
