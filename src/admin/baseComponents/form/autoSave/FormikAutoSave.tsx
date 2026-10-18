import { useEffect, useRef, useState, type ReactNode } from 'react'
import { isEqual, debounce } from 'lodash'
import { useFormikContext, type FormikValues } from 'formik'
import { DateTime } from 'luxon'

const usePrevious = <T,>(value: T): T | undefined => {
    const ref = useRef<T>()
    useEffect(() => {
        ref.current = value
    })
    return ref.current
}

export interface FormikAutoSaveRenderProps {
    isSaving: boolean
    lastSavedDate: DateTime | null
    // Never provided by FormikAutoSave: kept optional so existing render
    // callbacks destructuring it keep compiling.
    saveError?: undefined
}

export interface FormikAutoSaveProps<Values extends FormikValues> {
    onSave: (values: Values) => Promise<unknown>
    render: (state: FormikAutoSaveRenderProps) => ReactNode
}

/**
 * Must be rendered inside a <Formik> form: saves the form values (debounced)
 * each time they change.
 */
export const FormikAutoSave = <Values extends FormikValues>({
    onSave,
    render,
}: FormikAutoSaveProps<Values>) => {
    const { values } = useFormikContext<Values>()
    const previousValues = usePrevious(values)
    const [isSaving, setSaving] = useState(false)
    const [lastSavedDate, setSaveDate] = useState<DateTime | null>(null)

    const callback = (value: unknown) => {
        setSaving(false)
        setSaveDate(DateTime.local().minus({ seconds: 1 }))
        return value
    }

    const save = debounce(() => {
        if (
            previousValues &&
            Object.keys(previousValues).length &&
            !isEqual(previousValues, values)
        ) {
            setSaving(true)
            onSave(values).then(callback, callback)
        }
    }, 400)

    useEffect(() => {
        save()
    }, [values, save])

    return render({ isSaving, lastSavedDate })
}
