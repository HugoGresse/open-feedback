import { useHotkeys } from 'react-hotkeys-hook'
import { useFormikContext } from 'formik'

export const SaveShortcut = () => {
    const { submitForm } = useFormikContext()

    useHotkeys('ctrl+s, meta+s', (event) => {
        event.preventDefault()
        submitForm()
    })

    return null
}
