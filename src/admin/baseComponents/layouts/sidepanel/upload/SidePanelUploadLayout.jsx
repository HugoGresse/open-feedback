import React, { useCallback, useEffect, useState } from 'react'
import SidePanelLayout from '../SidePanelLayout.jsx'
import { useField } from 'formik'
import { makeStyles } from '@mui/styles'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'
import OFFormControl from '../../../form/formControl/OFFormControl.jsx'
import { useDropzone } from 'react-dropzone'
import COLORS from '../../../../../constants/colors'
import SidePanelUploadForm from './SidePanelUploadForm.jsx'
import { uploadImage } from '../../../../project/utils/storage/uploadImage'
import { useDispatch } from 'react-redux'
import { addNotification } from '../../../../notification/notifcationActions'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles(() => ({
    imageButton: {
        width: 100,
        minWidth: 100,
        minHeight: 50,
        background: 'none',
        padding: 0,
        textAlign: 'center',
        color: '#CCC',
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
        border: (props) =>
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
    finalImageWidthHeight = 500,
}) => {
    const { t } = useTranslation()
    const classes = useStyles()
    const dispatch = useDispatch()
    const [isOpen, setOpen] = useState(false)
    // eslint-disable-next-line
    const [field, meta, helpers] = useField(fieldName)
    const [upload, setUpload] = useState(null)
    const [uploading, setUploading] = useState(false)

    const uploadAndSave = async () => {
        try {
            if (upload) {
                setUploading(true)
                const imageUrl = await dispatch(
                    uploadImage(upload.file, finalImageWidthHeight)
                )

                setUploading(false)
                if (!imageUrl) {
                    return
                }
                helpers.setValue(imageUrl)
                setUpload(null)
            }

            setOpen(false)
        } catch (error) {
            dispatch(
                addNotification({
                    type: 'error',
                    i18nkey: 'common.dropzone.image.failUpload',
                    message: error.message,
                })
            )
            setUploading(false)
        }
    }

    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            setUpload({
                file: acceptedFiles[0],
                preview: URL.createObjectURL(acceptedFiles[0]),
            })
        }
    }, [])

    useEffect(
        () => () => {
            // Avoid memory leaks
            if (upload && upload.preview) URL.revokeObjectURL(upload.preview)
        },
        [upload]
    )

    const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        noClick: true,
        noKeyboard: true,
        accept: 'image/jpeg, image/png',
        maxSize: 1024 * 1024,
    })

    return (
        <>
            <OFFormControl name={name} fieldName={fieldName}>
                <button
                    type="button"
                    className={`addImage ${classes.imageButton}`}
                    onClick={() => setOpen(true)}
                    disabled={isSubmitting}>
                    {field.value && (
                        <img
                            src={field.value}
                            alt={`${t('common.edit')} ${name}`}
                            className={classes.previewImage}
                        />
                    )}
                    {!field.value && <AddAPhotoIcon />}
                </button>
            </OFFormControl>

            <SidePanelLayout
                isOpen={isOpen}
                onClose={() => {
                    setUpload(null)
                    setOpen(false)
                }}
                title={title}
                containerProps={{
                    ...getRootProps(),
                    sx: {
                        zIndex: 1300,
                    },
                }}>
                <SidePanelUploadForm
                    fieldName={fieldName}
                    fieldValue={field.value}
                    helpText={helpText}
                    isDragActive={isDragActive}
                    onInputClick={open}
                    file={upload}
                    getInputProps={getInputProps}
                    onSaveClick={uploadAndSave}
                    uploading={uploading}
                />
            </SidePanelLayout>
        </>
    )
}

export default SidePanelUploadLayout
