import OFButton from './OFButton'
import React from 'react'

export default {
    component: OFButton,
    title: 'Admin|Button',
}

export const defaultUsage = () => <OFButton>Click me</OFButton>

export const noBackground = () => (
    <OFButton style={{ design: 'text' }}>Cancel</OFButton>
)

export const customBackground = () => (
    <OFButton style={{ customBg: '#4499BB' }}>Cancel</OFButton>
)
