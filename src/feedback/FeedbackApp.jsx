import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AppLayout from './AppLayout.jsx'
import TalksListWrapper from './talks/TalksListWrapper.jsx'
import { Talk } from './talk/Talk.jsx'
import { I18nextProvider } from 'react-i18next'
import i18n from './translations/i18n'
import { responsiveFontSizes, useMediaQuery } from '@mui/material'
import { createTheme, ThemeProvider, StyledEngineProvider } from '@mui/material/styles'
import { grey } from '@mui/material/colors'
import ErrorBoundary from '../baseComponents/customComponent/ErrorBoundary.jsx'
import { ALERT_REACT_CATCHED_ERROR_FEEDBACK } from '../utils/alerting/alerts'
import { COLORS } from '../constants/colors'
import useQuery from '../utils/useQuery'

const FeedbackApp = () => {
    const forceColorScheme = useQuery().get('forceColorScheme')
    let prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
    if (forceColorScheme) {
        if (forceColorScheme === 'light') {
            prefersDarkMode = false
        } else if (forceColorScheme === 'dark') {
            prefersDarkMode = true
        }
    }

    const theme = React.useMemo(
        () =>
            responsiveFontSizes(
                createTheme({
                    typography: {
                        h1: {
                            fontSize: 24,
                            fontWeight: 400,
                        },
                        h2: {
                            fontSize: 24,
                            fontWeight: 400,
                        },
                        h3: {
                            fontSize: 20,
                            fontWeight: 400,
                        },
                    },
                    palette: {
                        primary: {
                            main: COLORS.RED_ORANGE,
                            dark: COLORS.DARK_RED_ORANGE,
                            contrastText: 'rgba(255,255,255, 0.87)',
                        },
                        secondary: {
                            main: '#3673ff',
                            contrastText: 'rgba(255,255,255, 0.87)',
                        },
                        background: {
                            default: prefersDarkMode ? '#303030' : '#fafafa',
                            paper: prefersDarkMode ? '#595959' : '#EDEDED',
                        },
                        text: {
                            primary: prefersDarkMode ? grey[50] : grey[900],
                            secondary: prefersDarkMode ? "rgba(255, 255, 255, 0.7)" : grey[600],
                        },
                        mode: prefersDarkMode ? 'dark' : 'light',
                        pageBackground: prefersDarkMode ? '#303030' : '#fff',
                        headerShadow: prefersDarkMode ? '#000' : '#B3B3B3',
                        paperBorder: prefersDarkMode ? grey[600] : grey[300],
                        paperVoteBorder: prefersDarkMode
                            ? grey[400]
                            : grey[300],
                        textVoteTitle: prefersDarkMode ? grey[400] : grey[900],
                        textVoteTitleShadow: prefersDarkMode
                            ? grey[800]
                            : grey[50],
                        textDimmed: prefersDarkMode ? grey[400] : grey[600],
                    },
                }),
            ),
        [prefersDarkMode],
    )

    return (
        <ErrorBoundary errorToReport={ALERT_REACT_CATCHED_ERROR_FEEDBACK}>
            <I18nextProvider i18n={i18n}>
                <StyledEngineProvider injectFirst>
                    <ThemeProvider theme={theme}>
                        <Routes>
                            <Route
                                path="/"
                                element={<AppLayout>
                                    <TalksListWrapper />
                                </AppLayout>}
                            />
                            <Route
                                path="/:date"
                                element={<AppLayout>
                                    <TalksListWrapper />
                                </AppLayout>}
                            />
                            <Route
                                path="/:date/:talkId"
                                element={<AppLayout>
                                    <Talk />
                                </AppLayout>}
                            />
                        </Routes>
                    </ThemeProvider>
                </StyledEngineProvider>
            </I18nextProvider>
        </ErrorBoundary>
    )
}

export default FeedbackApp
