import React from 'react'
import Typography from '@material-ui/core/Typography'
import TranslatedTypography from '../../../TranslatedTypography'
import OFButton from '../../../button/OFButton'
import makeStyles from '@material-ui/core/styles/makeStyles'
import COLORS from '../../../../../constants/colors'
import { useTranslation } from 'react-i18next'
import OFFormControlInputFormiked from '../../../form/formControl/OFFormControlInputFormiked'
import Divider from '@material-ui/core/Divider'

const useStyles = makeStyles(() => ({
    dropZone: {
        border: props =>
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
        margin: '16px 0',
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
}))
const SidePanelUploadForm = ({
    fieldName,
    fieldValue,
    isSubmitting,
    helpText,
    isDragActive,
    onInputClick,
    getInputProps,
    files,
}) => {
    const { t } = useTranslation()
    const classes = useStyles({
        isDragActive: isDragActive,
    })

    console.log(files)

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
                isSubmitting={isSubmitting}
            />

            <div className={classes.preview}>
                <TranslatedTypography i18nKey="common.preview" />
                <div className={classes.checkerboard}>
                    <img src={(files[0] && files[0].preview) || fieldValue} />
                </div>
            </div>

            <OFButton>
                Upload File
                <input type="file" style={{ display: 'none' }} />
            </OFButton>
        </>
    )
}

export default SidePanelUploadForm
