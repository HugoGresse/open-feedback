import OFAutoComplete from './OFAutoComplete.jsx'
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
    title: 'Admin/AutoComplete',
}

export const DefaultUsage = () => {
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
                initialValues: {
                    myField: '',
                },
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
            initialValues: {
                myField: '',
            },
            setFieldValue: () => {},
        }}
    />
)

export const FreeSolo = () => {
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
                initialValues: {
                    myField: '',
                },
                setFieldValue: (name, value) => {
                    setFieldValue(value)
                },
            }}
        />
    )
}

export const OnlyOneValue = () => {
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
                initialValues: {
                    myField: '',
                },
                setFieldValue: (name, value) => {
                    setFieldValue(value)
                },
            }}
        />
    )
}

export const FromAnArrayOfObject = () => {
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
                initialValues: {
                    myField: '',
                },
                setFieldValue: (name, value) => {
                    setFieldValue(value)
                },
            }}
        />
    )
}

export const ManyKeysFromAnArrayOfObject = () => {
    const [value, setFieldValue] = useState([])

    return (
        <OFAutoComplete
            name="myField"
            label="Field label"
            placeholder="Placeholder"
            dataArray={objectData}
            keysToDisplay={['nativeName', 'tag']}
            field={{
                value: value,
            }}
            form={{
                isSubmitting: false,
                initialValues: {
                    myField: '',
                },
                setFieldValue: (name, value) => {
                    setFieldValue(value)
                },
            }}
        />
    )
}
