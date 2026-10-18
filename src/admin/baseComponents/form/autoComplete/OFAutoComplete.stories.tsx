import type { Meta } from '@storybook/react-vite'
import { OFAutoComplete, type OFAutoCompleteValue } from './OFAutoComplete.tsx'
import { useState } from 'react'

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

const meta = {
    component: OFAutoComplete,
    title: 'Admin/AutoComplete',
} satisfies Meta<typeof OFAutoComplete>
export default meta

export const DefaultUsage = () => {
    const [value, setFieldValue] = useState<OFAutoCompleteValue>([])

    return (
        <OFAutoComplete
            dataArray={data}
            multiple={true}
            field={{
                name: 'myField',
                value: value,
            }}
            form={{
                isSubmitting: false,
                initialValues: {
                    myField: '',
                },
                setFieldValue: (_name: string, value: unknown) => {
                    setFieldValue(value as OFAutoCompleteValue)
                },
            }}
        />
    )
}

export const submitting = () => (
    <OFAutoComplete
        dataArray={data}
        multiple={true}
        field={{
            name: 'myField',
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
    const [value, setFieldValue] = useState<OFAutoCompleteValue>([])

    return (
        <OFAutoComplete
            dataArray={data}
            multiple={true}
            freeSolo={true}
            field={{
                name: 'myField',
                value: value,
            }}
            form={{
                isSubmitting: false,
                initialValues: {
                    myField: '',
                },
                setFieldValue: (_name: string, value: unknown) => {
                    setFieldValue(value as OFAutoCompleteValue)
                },
            }}
        />
    )
}

export const OnlyOneValue = () => {
    const [value, setFieldValue] = useState<OFAutoCompleteValue>([])

    return (
        <OFAutoComplete
            dataArray={data}
            field={{
                name: 'myField',
                value: value,
            }}
            form={{
                isSubmitting: false,
                initialValues: {
                    myField: '',
                },
                setFieldValue: (_name: string, value: unknown) => {
                    setFieldValue(value as OFAutoCompleteValue)
                },
            }}
        />
    )
}

export const FromAnArrayOfObject = () => {
    const [value, setFieldValue] = useState<OFAutoCompleteValue>([])

    return (
        <OFAutoComplete
            dataArray={objectData}
            keyToDisplay="nativeName"
            field={{
                name: 'myField',
                value: value,
            }}
            form={{
                isSubmitting: false,
                initialValues: {
                    myField: '',
                },
                setFieldValue: (_name: string, value: unknown) => {
                    setFieldValue(value as OFAutoCompleteValue)
                },
            }}
        />
    )
}

export const ManyKeysFromAnArrayOfObject = () => {
    const [value, setFieldValue] = useState<OFAutoCompleteValue>([])

    return (
        <OFAutoComplete
            dataArray={objectData}
            keysToDisplay={['nativeName', 'tag']}
            field={{
                name: 'myField',
                value: value,
            }}
            form={{
                isSubmitting: false,
                initialValues: {
                    myField: '',
                },
                setFieldValue: (_name: string, value: unknown) => {
                    setFieldValue(value as OFAutoCompleteValue)
                },
            }}
        />
    )
}
