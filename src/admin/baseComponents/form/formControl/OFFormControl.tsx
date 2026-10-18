import type { ReactNode } from 'react'
import InputLabel, { type InputLabelProps } from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import { ErrorMessage, useField } from 'formik'
import { makeStyles } from '@mui/styles'
import Typography from '@mui/material/Typography'
import { useTheme, type PaletteColor } from '@mui/material'
import type { Theme } from '@mui/material/styles'

// `inputLabel` is a custom palette key set on the admin theme (AdminApp.tsx);
// the MUI Palette type is not augmented with it, hence the local narrowing.
type PaletteColorWithInputLabel = PaletteColor & { inputLabel?: string }

const useStyles = makeStyles((theme: Theme) => ({
    focusedLabel: {
        color: `${(theme.palette.primary as PaletteColorWithInputLabel).inputLabel} !important`,
    },
}))

export interface OFFormControlProps {
    // Label displayed above the field
    name?: ReactNode
    fieldName: string
    displayErrorMessageDirectly?: boolean
    children?: ReactNode
    noTopMargin?: boolean
    color?: InputLabelProps['color']
    // Ignored, accepted for call-site compatibility
    type?: string
}

export const OFFormControl = ({
    name,
    fieldName,
    displayErrorMessageDirectly,
    children,
    noTopMargin,
    color,
}: OFFormControlProps) => {
    const theme = useTheme()
    const classes = useStyles({
        noTopMargin,
    })
    const [, meta] = useField(fieldName)

    return (
        <FormControl
            sx={{
                width: '100%',
                marginTop: !noTopMargin ? 3 : 0,
            }}
        >
            <InputLabel
                shrink
                htmlFor={fieldName}
                variant="standard"
                sx={{
                    fontSize: theme.typography.fontSize * 1.2,
                    position: 'relative',
                }}
                classes={{
                    focused: classes.focusedLabel,
                }}
                color={color}
            >
                {name}
            </InputLabel>
            {children}
            {displayErrorMessageDirectly && meta.error && (
                <Typography
                    sx={{
                        color: 'red',
                    }}
                    role="alert"
                >
                    {meta.error}
                </Typography>
            )}
            {!displayErrorMessageDirectly && (
                <ErrorMessage
                    name={fieldName}
                    render={(msg) => (
                        <Typography role="alert">{msg}</Typography>
                    )}
                />
            )}
        </FormControl>
    )
}
