import { Route, Routes } from 'react-router-dom'
import { AppLayout } from './AppLayout.tsx'
import { TalksListWrapper } from './talks/TalksListWrapper.tsx'
import { Talk } from './talk/Talk.tsx'
import { I18nextProvider } from 'react-i18next'
import { i18n } from './translations/i18n'
import { useMediaQuery } from '@mui/material'
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles'
import { ErrorBoundary } from '../baseComponents/customComponent/ErrorBoundary.tsx'
import { ALERT_REACT_CATCHED_ERROR_FEEDBACK } from '../utils/alerting/alerts'
import { useQuery } from '../utils/useQuery'
import { feedbackThemes } from './feedbackTheme'

export const FeedbackApp = () => {
    const forceColorScheme = useQuery().get('forceColorScheme')
    let prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
    if (forceColorScheme) {
        if (forceColorScheme === 'light') {
            prefersDarkMode = false
        } else if (forceColorScheme === 'dark') {
            prefersDarkMode = true
        }
    }

    const theme = feedbackThemes[prefersDarkMode ? 'dark' : 'light']

    return (
        <ErrorBoundary errorToReport={ALERT_REACT_CATCHED_ERROR_FEEDBACK}>
            <I18nextProvider i18n={i18n}>
                <StyledEngineProvider injectFirst>
                    <ThemeProvider theme={theme}>
                        <Routes>
                            <Route
                                path="/"
                                element={
                                    <AppLayout>
                                        <TalksListWrapper />
                                    </AppLayout>
                                }
                            />
                            <Route
                                path="/:date"
                                element={
                                    <AppLayout>
                                        <TalksListWrapper />
                                    </AppLayout>
                                }
                            />
                            <Route
                                path="/:date/:talkId"
                                element={
                                    <AppLayout>
                                        <Talk />
                                    </AppLayout>
                                }
                            />
                        </Routes>
                    </ThemeProvider>
                </StyledEngineProvider>
            </I18nextProvider>
        </ErrorBoundary>
    )
}
