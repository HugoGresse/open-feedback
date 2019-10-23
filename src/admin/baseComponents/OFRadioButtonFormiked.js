import React from 'react'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Radio from '@material-ui/core/Radio'
import makeStyles from '@material-ui/core/styles/makeStyles'

const useStyles = makeStyles(theme => ({
    root: {
        alignItems: 'start',
    },
    label: {
        padding: 4
    }
}))

const OFRadioButtonFormiked = ({
                                   field: {name, value, onChange, onBlur},
                                   id,
                                   label,
                                   className,
                                   ...props
                               }) => {
    const classes = useStyles()

    return <FormControlLabel
        name={name}
        id={id}
        value={id} // could be something else for output?
        checked={id === value}
        onChange={onChange}
        onBlur={onBlur}
        control={<Radio color="primary"/>}
        label={label}
        classes={{
            root: classes.root,
            label: classes.label
        }}
        {...props}
    />
}

export default OFRadioButtonFormiked
