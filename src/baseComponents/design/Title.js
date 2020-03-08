import React from 'react'
import Typography from '@material-ui/core/Typography'

const Title = ({ children, component, color, ...props }) => {
    return (
        <Typography variant={component} color={color} {...props}>
            {children}
        </Typography>
    )
}

export default Title
