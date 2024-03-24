import { useEffect, useRef, useState } from 'react'
import { isEqual, debounce } from 'lodash'
import { connect } from 'formik'
import { DateTime } from 'luxon'

const usePrevious = value => {
    const ref = useRef()
    useEffect(() => {
        ref.current = value
    })
    return ref.current
}

const AutoSave = ({ formik: { values }, onSave, render }) => {
    const previousValues = usePrevious(values)
    const [isSaving, setSaving] = useState(false)
    const [lastSavedDate, setSaveDate] = useState(null)

    const callback = value => {
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

export default connect(AutoSave)
