import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { isEqual, debounce } from 'lodash'
import { useFormikContext, type FormikValues } from 'formik'
import { DateTime } from 'luxon'

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
    const [isSaving, setSaving] = useState(false)
    const [lastSavedDate, setSaveDate] = useState<DateTime | null>(null)
    const previousValues = useRef(values)
    const latest = useRef({ values, onSave })

    useEffect(() => {
        latest.current = { values, onSave }
    })

    // Created once so that changes within 400ms are saved together, with the
    // latest values.
    const save = useMemo(
        () =>
            debounce(() => {
                const callback = (value: unknown) => {
                    setSaving(false)
                    setSaveDate(DateTime.local().minus({ seconds: 1 }))
                    return value
                }
                setSaving(true)
                latest.current
                    .onSave(latest.current.values)
                    .then(callback, callback)
            }, 400),
        []
    )

    // Save the pending changes when leaving the form
    useEffect(() => () => save.flush(), [save])

    useEffect(() => {
        const previous = previousValues.current
        previousValues.current = values
        if (Object.keys(previous).length && !isEqual(previous, values)) {
            save()
        }
    }, [values, save])

    return render({ isSaving, lastSavedDate })
}
