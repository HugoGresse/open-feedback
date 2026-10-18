import type { FieldProps } from 'formik'
import MuiSwitch, { type SwitchProps } from '@mui/material/Switch'

export interface OFSwitchProps
    extends Omit<SwitchProps, 'form'>,
        Pick<FieldProps<boolean>, 'field' | 'form'> {}

const fieldToSwitch = ({
    field,
    form: { isSubmitting },
    disabled,
    ...props
}: OFSwitchProps) => {
    return {
        disabled: disabled !== undefined ? disabled : isSubmitting,
        color: 'primary' as const,
        ...props,
        ...field,
        value: Boolean(field.name),
        checked: field.value,
    }
}

// Note: MuiSwitch has no `input` prop; the `input={<OFInput />}` previously
// passed here only ended up as a meaningless DOM attribute and was removed.
export const OFSwitch = (props: OFSwitchProps) => (
    <MuiSwitch {...fieldToSwitch(props)} />
)
