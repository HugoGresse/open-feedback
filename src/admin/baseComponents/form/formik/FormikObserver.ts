import { useEffect } from 'react'

/**
 * From https://github.com/jaredpalmer/formik/issues/271#issuecomment-500217679
 *
 * Usage:
 * <Formik>
 *      {({values}) => {
 *          <FormikObserver value={values} onChange={(values) => props.onFormChange(values)}/>
 *          }
 *      }
 * </Formik>
 * @return {null}
 */
export interface FormikObserverProps<Value extends object> {
    value: Value
    onChange: (value: Value) => void
}

export function FormikObserver<Value extends object>({
    value,
    onChange,
}: FormikObserverProps<Value>) {
    useEffect(() => {
        onChange(value)
    }, [Object.values(value).join(', ')])
    return null
}
