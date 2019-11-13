import React from 'react'
import RadioGroup from '@material-ui/core/RadioGroup'
import {ErrorMessage} from 'formik'
import {Typography} from '@material-ui/core'

const RadioButtonGroup = ({
                              fieldName,
                              children
                          }) => {
    return (
        <RadioGroup>
            {children}
            <ErrorMessage name={fieldName}
                          render={msg => <Typography style={{color: 'red'}}>{msg}</Typography>}/>
        </RadioGroup>
    )
}

export default RadioButtonGroup
