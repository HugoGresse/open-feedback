import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { SidePanelLayout } from '../SidePanelLayout.tsx'
import { useField } from 'formik'
import { makeStyles } from '@mui/styles'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'
import { OFFormControl } from '../../../form/formControl/OFFormControl.tsx'
import { useDropzone } from 'react-dropzone'
import { HEX_COLORS } from '../../../../../constants/colors'
import {
    SidePanelUploadForm,
    type SidePanelUpload,
} from './SidePanelUploadForm.tsx'
import { uploadImage } from '../../../../project/utils/storage/uploadImage'
import { addNotification } from '../../../../notification/notifcationActions'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from '../../../../../store.ts'

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
        border: (props: { isDragActive?: boolean }) =>
            `3px dashed ${
                props.isDragActive ? 'royalblue' : HEX_COLORS.RED_ORANGE
            }`,
        background: 'rgba(0,0,0,0.04)',
        color: HEX_COLORS.GRAY,
        transition: 'all 300ms',
        borderRadius: 6,
        textAlign: 'center',
        padding: 16,
    },
}))

export interface SidePanelUploadLayoutProps {
    // Label of the field, also used in the preview image alt
    name?: string
    fieldName: string
    helpText?: ReactNode
    isSubmitting?: boolean
    title?: ReactNode
    finalImageWidthHeight?: number
}

export const SidePanelUploadLayout = ({
    name,
    fieldName,
    helpText,
    isSubmitting,
    title,
    finalImageWidthHeight = 500,
}: SidePanelUploadLayoutProps) => {
    const { t } = useTranslation()
    // Same as the makeStyles default props: `dropZone` is not rendered here.
    const classes = useStyles({})
    const dispatch = useAppDispatch()
    const [isOpen, setOpen] = useState(false)
    const [field, , helpers] = useField<string>(fieldName)
    const [upload, setUpload] = useState<SidePanelUpload | null>(null)
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
                    message: error instanceof Error ? error.message : undefined,
                })
            )
            setUploading(false)
        }
    }

    const onDrop = useCallback((acceptedFiles: File[]) => {
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
        accept: {
            'image/jpeg': [],
            'image/png': [],
            'image/svg+xml': [],
        },
        maxSize: 10024 * 10024,
    })

    return (
        <>
            <OFFormControl name={name} fieldName={fieldName}>
                <button
                    type="button"
                    className={`addImage ${classes.imageButton}`}
                    onClick={() => setOpen(true)}
                    disabled={isSubmitting}
                >
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
                }}
            >
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
