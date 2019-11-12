import React, {useState} from 'react'
import {object, string} from 'yup'
import {Button, Typography} from '@material-ui/core'
import {Form, Formik} from 'formik'
import OFFormControlInputFormiked from '../../baseComponents/OFFormControlInputFormiked'
import OFButton from '../../baseComponents/OFButton'
import Collapse from '@material-ui/core/Collapse'
import makeStyles from '@material-ui/core/styles/makeStyles'
import ArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import Box from '@material-ui/core/Box'
import {FormikObserver} from '../../baseComponents/FormikObserver'

const useStyles = makeStyles(() => ({
    jsonShowButton: {
        width: '100%'
    },
    jsonExample: {
        background: '#EEE',
        padding: 12,
        marginTop: 32
    },
    jsonExamplePre: {
        overflow: 'auto'
    }
}))

const schema = object().shape({
    jsonUrl: string()
        .url(<Typography>The JSON URL must be a valid url</Typography>)
        .required(<Typography>The JSON URL is required</Typography>)
})

const SetupJSONForm = ({
                           onBack,
                           onSubmit,
                           submitText,
                           backText,
                           initialValues,
                           onFormChange
                       }) => {
    const classes = useStyles()
    const [isExampleOpen, setExampleOpen] = useState(false)

    return (
        <Formik
            validationSchema={schema}
            initialValues={initialValues}
            onSubmit={values =>
                onSubmit({
                    jsonUrl: values.jsonUrl
                })
            }
        >
            {({isSubmitting, values}) => (
                <Form method="POST">
                    {onFormChange && <FormikObserver value={values} onChange={(values) => onFormChange(values)}/>}
                    <OFFormControlInputFormiked
                        name="JSON URL"
                        fieldName="jsonUrl"
                        type="text"
                        isSubmitting={isSubmitting}
                    />

                    <div className={classes.jsonExample}>
                        <Button
                            className={classes.jsonShowButton}
                            onClick={() => setExampleOpen(!isExampleOpen)}
                        >
                            Show JSON model <ArrowDownIcon/>
                        </Button>
                        <Collapse in={isExampleOpen}>
                                <pre className={classes.jsonExamplePre}>
                                    {JSON.stringify(
                                        {
                                            sessions: {
                                                '2': {
                                                    description:
                                                        'Une conférence pou...',
                                                    speakers: [
                                                        'lhwORZ2dSGbF1OG6VkfbjkOCzR12'
                                                    ],
                                                    tags: [
                                                        'Architecture & Paradigme'
                                                    ],
                                                    title:
                                                        'Entre industrialisation et artisanat, le métier de développeur',
                                                    id: '2',
                                                    startTime:
                                                        '2019-06-27T16:20:00+02:00',
                                                    endTime:
                                                        '2019-06-27T17:10:00+02:00',
                                                    trackTitle: 'Amphi D'
                                                },
                                                '30': {
                                                    '...': ''
                                                }
                                            },
                                            speakers: {
                                                lhwORZ2dSGbF1OG6VkfbjkOCzR12: {
                                                    company:
                                                        'Suricats Consulting',
                                                    name: 'Olivier PONCET',
                                                    photoUrl:
                                                        'https://avatars2.githubusercontent.com/u/29702924?v=4',
                                                    socials: [
                                                        {
                                                            name: 'twitter',
                                                            link: 'https://twitter.com/ponceto91'
                                                        }
                                                    ],
                                                    id:
                                                        'lhwORZ2dSGbF1OG6VkfbjkOCzR12'
                                                },
                                                anotherId_dfnejz: {
                                                    '...': ''
                                                }
                                            }
                                        },
                                        undefined,
                                        4
                                    )}
                                </pre>
                        </Collapse>
                    </div>

                    <Box justifyContent="space-between" display="flex">
                        {backText && <OFButton
                            disabled={isSubmitting}
                            onClick={() => onBack(values)}
                            style={{
                                type: 'big',
                                design: 'text',
                                marginTop: 64
                            }}
                        >
                            {backText}
                        </OFButton>}

                        {submitText && <OFButton
                            disabled={isSubmitting}
                            type="submit"
                            style={{type: 'big', marginTop: 64}}
                        >
                            {submitText}
                        </OFButton>}
                    </Box>
                </Form>
            )}
        </Formik>
    )
}

export default SetupJSONForm
