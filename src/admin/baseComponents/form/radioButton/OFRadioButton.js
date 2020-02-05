import React from 'react'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Radio from '@material-ui/core/Radio'
import makeStyles from '@material-ui/core/styles/makeStyles'

const useStyles = makeStyles(() => ({
    root: {
        alignItems: 'start',
    },
    label: {
        padding: 4,
    },
}))

const OFRadioButton = ({
    field: { name, value, onChange, onBlur },
    id,
    label,
    ...props
}) => {
    const classes = useStyles()

    return (
        <FormControlLabel
            name={name}
            id={id}
            value={id}
            checked={id === value}
            onChange={onChange}
            onBlur={onBlur}
            control={<Radio color="primary" />}
            label={label}
            classes={{
                root: classes.root,
                label: classes.label,
            }}
            {...props}
        />
    )
}

export default OFRadioButton
