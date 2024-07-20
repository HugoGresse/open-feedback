import React from 'react'
import CollapsePanel from './CollapsePanel.jsx'

export default {
    component: CollapsePanel,
    title: 'Admin/CollapsePanel',
}

export const defaultUsage = () => (
    <CollapsePanel buttonText="Click me button">
        <ul>
            <li>Some content</li>
            <li>Some content</li>
            <li>Some content</li>
            <li>Some content</li>
            <li>Some content</li>
        </ul>
    </CollapsePanel>
)
