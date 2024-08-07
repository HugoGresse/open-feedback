import React from 'react'
import Typography from '@mui/material/Typography'
import TranslatedTypography from '../../../TranslatedTypography.jsx'
import OFButton from '../../../button/OFButton.jsx'
import { makeStyles } from '@mui/styles'
import COLORS from '../../../../../constants/colors'
import { useTranslation } from 'react-i18next'
import OFFormControlInputFormiked from '../../../form/formControl/OFFormControlInputFormiked.jsx'

const useStyles = makeStyles(() => ({
    dropZone: {
        border: (props) =>
            `2px dashed ${
                props.isDragActive ? COLORS.RED_ORANGE : COLORS.LIGHT_GRAY
            }`,
        background: 'rgba(0,0,0,0.04)',
        color: COLORS.GRAY,
        transition: 'all 300ms',
        borderRadius: 6,
        textAlign: 'center',
        padding: 16,
        marginTop: 16,
        marginBottom: 16,
    },
    uploadButton: {
        marginTop: 16,
    },
    or: {
        borderTop: '1px solid #DDD',
        lineHeight: 0,
        marginTop: 32,
        textAlign: 'center',
        '& span': {
            backgroundColor: 'white',
            color: '#BBB',
            padding: 4,
        },
    },
    preview: {
        borderRadius: 4,
        border: '4px solid #EEE',
        textAlign: 'center',
        textTransform: 'uppercase',
        marginTop: 16,
        width: 'fit-content',
        '& img': {
            maxWidth: '100%',
            display: 'block',
        },
    },
    checkerboard: {
        backgroundImage:
            'linear-gradient(45deg, #BBB 25%, transparent 25%), linear-gradient(-45deg, #BBB 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #BBB 75%), linear-gradient(-45deg, transparent 75%, #BBB 75%)',
        backgroundSize: '20px 20px',
        backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
    },
    saveButton: {
        marginTop: 32,
    },
}))

const SidePanelUploadForm = ({
    fieldName,
    fieldValue,
    helpText,
    isDragActive,
    onInputClick,
    getInputProps,
    file,
    onSaveClick,
    uploading,
}) => {
    const { t } = useTranslation()
    const classes = useStyles({
        isDragActive: isDragActive,
    })

    const previewImage = (file && file.preview) || fieldValue

    return (
        <>
            <Typography>{helpText}</Typography>

            <div className={classes.dropZone} onClick={onInputClick}>
                <input {...getInputProps()} />
                {isDragActive ? (
                    <div className={classes.dropConfirm}>
                        <TranslatedTypography
                            i18nKey={'common.dropzone.image.confirm'}
                        />
                    </div>
                ) : (
                    <TranslatedTypography
                        i18nKey={'common.dropzone.image.indication'}
                    />
                )}

                {!isDragActive && (
                    <OFButton
                        className={classes.uploadButton}
                        style={{
                            customBg: '#FFFFFF',
                            customText: COLORS.GRAY,
                        }}>
                        {t('common.dropzone.image.button')}
                    </OFButton>
                )}
            </div>

            <div className={classes.or}>
                <span>{t('common.or')}</span>
            </div>

            <OFFormControlInputFormiked
                name={t('baseComponents.imageUrl')}
                fieldName={fieldName}
                type="text"
                isSubmitting={!!file}
            />

            {previewImage && (
                <div className={classes.preview}>
                    <TranslatedTypography i18nKey="common.preview" />
                    <div className={classes.checkerboard}>
                        <img src={previewImage} alt="" />
                    </div>
                </div>
            )}

            <OFButton
                id="uploadImage"
                onClick={onSaveClick}
                disabled={uploading}
                loading={uploading}
                className={classes.saveButton}>
                {t('baseComponents.uploadImage')}
            </OFButton>
        </>
    )
}

export default SidePanelUploadForm
