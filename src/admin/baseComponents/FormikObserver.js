import {useEffect} from 'react'

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
export function FormikObserver({value, onChange}) {
    useEffect(() => {
        onChange(value)
        // eslint-disable-next-line
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Object.values(value).join(', ')])
    return null
}
