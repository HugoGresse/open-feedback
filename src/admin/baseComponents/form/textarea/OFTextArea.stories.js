import OFTextArea from './OFTextArea'
import React from 'react'

export default {
    component: OFTextArea,
    title: 'Admin|TextArea',
}

export const defaultUsage = () => (
    <OFTextArea name="myField" label="Field label" placeholder="Placeholder" />
)

export const disabled = () => (
    <OFTextArea
        name="myField"
        label="Field label"
        placeholder="Placeholder"
        disabled={true}
    />
)

export const controlled = () => (
    <OFTextArea
        name="myField1"
        label="Field label"
        placeholder="Placeholder"
        value="value"
    />
)
