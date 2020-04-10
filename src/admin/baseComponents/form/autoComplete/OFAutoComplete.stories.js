import OFAutoComplete from './OFAutoComplete'
import React, { useState } from 'react'

const data = ['Web', 'Back', 'Cloud', 'UX', 'Design', 'Food', 'Biking']
const objectData = [
    {
        tag: 'fr',
        nativeName: 'Français',
    },
    {
        tag: 'en',
        nativeName: 'English',
    },
    {
        tag: 'de',
        nativeName: 'Deutsch',
    },
]

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

export const fromAnArrayOfObject = () => {
    const [value, setFieldValue] = useState([])

    return (
        <OFAutoComplete
            name="myField"
            label="Field label"
            placeholder="Placeholder"
            dataArray={objectData}
            keyToDisplay="nativeName"
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

export const manyKeysFromAnArrayOfObject = () => {
    const [value, setFieldValue] = useState([])

    return (
        <OFAutoComplete
            name="myField"
            label="Field label"
            placeholder="Placeholder"
            dataArray={objectData}
            keyToDisplay={['nativeName', 'tag']}
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
