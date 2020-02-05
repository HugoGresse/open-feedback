import OFAutoComplete from './OFAutoComplete'
import React, { useState } from 'react'

const data = ['Web', 'Back', 'Cloud', 'UX', 'Design', 'Food', 'Biking']

export default {
    component: OFAutoComplete,
    title: 'Admin|AutoComplete',
}

export const defaultUsage = () => {
    const [value, setFieldValue] = useState([])

    return (
        <OFAutoComplete
            name="myField"
            label="Field label"
            placeholder="Placeholder"
            dataArray={data}
            multiple={true}
            field={{
                value: value,
            }}
            form={{
                isSubmitting: false,
                setFieldValue: (name, value) => {
                    setFieldValue(value)
                },
            }}
        />
    )
}

export const submitting = () => (
    <OFAutoComplete
        name="myField"
        label="Field label"
        placeholder="Placeholder"
        dataArray={data}
        multiple={true}
        field={{
            value: ['toto', 'titi'],
        }}
        form={{
            isSubmitting: true,
            setFieldValue: () => {},
        }}
    />
)

export const freesolo = () => {
    const [value, setFieldValue] = useState([])

    return (
        <OFAutoComplete
            name="myField"
            label="Field label"
            placeholder="Placeholder"
            dataArray={data}
            multiple={true}
            freeSolo={true}
            field={{
                value: value,
            }}
            form={{
                isSubmitting: false,
                setFieldValue: (name, value) => {
                    setFieldValue(value)
                },
            }}
        />
    )
}

export const onlyOneValue = () => {
    const [value, setFieldValue] = useState([])

    return (
        <OFAutoComplete
            name="myField"
            label="Field label"
            placeholder="Placeholder"
            dataArray={data}
            field={{
                value: value,
            }}
            form={{
                isSubmitting: false,
                setFieldValue: (name, value) => {
                    setFieldValue(value)
                },
            }}
        />
    )
}
