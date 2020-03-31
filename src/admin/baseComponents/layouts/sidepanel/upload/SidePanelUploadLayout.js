import React, { useCallback, useEffect, useState } from 'react'
import SidePanelLayout from '../SidePanelLayout'
import OFButton from '../../../button/OFButton'
import { useField } from 'formik'
import makeStyles from '@material-ui/core/styles/makeStyles'
import OFFormControl from '../../../form/formControl/OFFormControl'
import Typography from '@material-ui/core/Typography'
import { useDropzone } from 'react-dropzone'
import { useTranslation } from 'react-i18next'
import COLORS from '../../../../../constants/colors'
import TranslatedTypography from '../../../TranslatedTypography'
import SidePanelUploadForm from './SidePanelUploadForm'

const useStyles = makeStyles(() => ({
    imageButton: {
        width: 100,
        minWidth: 100,
        minHeight: 50,
        background: 'none',
        padding: 0,
        textAlign: 'left',
        borderRadius: 4,
        border: '1px solid #EEE',
        outline: 'none',
        userSelect: 'none',
        '&:hover': {
            boxShadow: '0 2px 8px 1px rgba(0,0,0,0.3)',
            cursor: 'pointer',
            borderColor: 'white',
        },
        '&:disabled': {
            opacity: 0.5,
        },
    },
    previewImage: {
        width: '100%',
    },
    dropZone: {
        border: props =>
            `3px dashed ${
                props.isDragActive ? 'royalblue' : COLORS.RED_ORANGE
            }`,
        background: 'rgba(0,0,0,0.04)',
        color: COLORS.GRAY,
        transition: 'all 300ms',
        borderRadius: 6,
        textAlign: 'center',
        padding: 16,
    },
}))

const SidePanelUploadLayout = ({
    name,
    fieldName,
    helpText,
    isSubmitting,
    title,
}) => {
    const classes = useStyles()
    const [isOpen, setOpen] = useState(true)
    const [field] = useField(fieldName)
    const [files, setFiles] = useState([])

    const onDrop = useCallback(acceptedFiles => {
        setFiles(
            acceptedFiles.map(file =>
                Object.assign(file, {
                    preview: URL.createObjectURL(file),
                })
            )
        )
        console.log('aa', acceptedFiles)
    }, [])

    useEffect(
        () => () => {
            // Make sure to revoke the data uris to avoid memory leaks
            files.forEach(file => URL.revokeObjectURL(file.preview))
        },
        [files]
    )

    const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
        onDrop,
        noClick: true,
        noKeyboard: true,
        accept: 'image/png',
        maxSize: 1024 * 1024,
    })

    return (
        <>
            <OFFormControl name={name} fieldName={fieldName}>
                <button
                    type="button"
                    className={classes.imageButton}
                    onClick={() => setOpen(true)}
                    disabled={isSubmitting}>
                    <img
                        src={field.value}
                        alt={name}
                        className={classes.previewImage}
                    />
                </button>
            </OFFormControl>

            <SidePanelLayout
                isOpen={isOpen}
                onClose={() => {
                    setOpen(false)
                }}
                title={title}
                containerProps={getRootProps()}>
                <SidePanelUploadForm
                    fieldName={fieldName}
                    fieldValue={field.value}
                    helpText={helpText}
                    isDragActive={isDragActive}
                    onInputClick={open}
                    files={files}
                    getInputProps={getInputProps}
                />
            </SidePanelLayout>
        </>
    )
}

export default SidePanelUploadLayout
