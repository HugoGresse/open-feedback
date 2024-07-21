import React, { useRef, useState } from 'react'
import InnerWrapper from './component/InnerWrapper.jsx'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { Button, CircularProgress, TextField } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { isValidEmail } from '../utils/stringUtils'
import { HttpsFunctionsUrl } from '../firebase.ts'

const INIT_STATE = {
    email: '',
    message: '',
    error: null,
    success: false,
}

export const Contact = () => {
    const { t } = useTranslation()
    const { executeRecaptcha } = useGoogleReCaptcha()
    const [formValues, setFormValues] = useState(INIT_STATE)
    const [isSending, setIsSending] = useState(false)
    const formRef = useRef()

    const submit = async (event) => {
        event.preventDefault()
        setFormValues({
            ...formValues,
            error: null,
            success: false,
        })

        if (!isValidEmail(formValues.email)) {
            setFormValues({
                ...formValues,
                error: t('contact.emailError'),
            })
            return
        }

        const token = await executeRecaptcha('contact')

        if (!token) {
            setFormValues({
                ...formValues,
                error: 'Recaptcha failed...',
            })
            return
        }

        setIsSending(true)

        const success = await fetch(HttpsFunctionsUrl.sendContactEmail, {
            method: 'POST',
            body: JSON.stringify({
                email: formValues.email,
                message: formValues.message,
                recaptchaV3Response: token,
            }),
        })
            .then((response) => response.json())
            .then((response) => {
                if (!response.success) {
                    setFormValues({
                        ...formValues,
                        error: `${t('contact.error')} ${response.error}`,
                    })
                }
                return response.success
            })
            .catch((error) => {
                setFormValues({
                    ...formValues,
                    error: `${t('contact.error')} ${error.toString()}`,
                })
                return false
            })

        if (success) {
            setFormValues({
                ...INIT_STATE,
                success: true,
            })
            formRef.current.reset()
        }
        setIsSending(false)
    }

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            bgcolor="#eee"
            flexGrow="1"
            textAlign="center">
            <Typography variant="h2" id="contact" style={{ marginTop: 16 }}>
                {t('contact.title')}
            </Typography>

            <InnerWrapper>
                <form onSubmit={submit} ref={formRef}>
                    <Box
                        display="flex"
                        flexDirection="column"
                        maxWidth={400}
                        margin="40px  auto">
                        <TextField
                            id="email"
                            label={t('contact.email')}
                            variant="filled"
                            onChange={(event) =>
                                setFormValues({
                                    ...formValues,
                                    email: event.target.value,
                                })
                            }
                        />
                        <TextField
                            id="message"
                            label={t('contact.message')}
                            multiline
                            rows={6}
                            variant="filled"
                            onChange={(event) =>
                                setFormValues({
                                    ...formValues,
                                    message: event.target.value,
                                })
                            }
                        />

                        <Typography
                            style={{
                                color: 'red',
                                fontWeight: 600,
                                fontSize: 16,
                            }}>
                            {formValues.error}
                        </Typography>
                        <br />
                        <Button type="submit" disabled={isSending}>
                            {isSending ? (
                                <CircularProgress />
                            ) : (
                                t('contact.submit')
                            )}
                        </Button>
                        {formValues.success && (
                            <Typography>{t('contact.success')}</Typography>
                        )}
                    </Box>
                </form>
            </InnerWrapper>
        </Box>
    )
}
