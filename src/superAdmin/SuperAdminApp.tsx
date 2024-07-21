import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import React from 'react'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { createTheme, responsiveFontSizes, StyledEngineProvider, ThemeProvider } from '@mui/material'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { LoginSuperAdmin } from './LoginSuperAdmin.tsx'
import { SuperAdminProjects } from './SuperAdminProjects.tsx'

const innerTheme = responsiveFontSizes(
    createTheme({
        palette: {
            mode: 'dark',
            primary: {
                light: '#be71ce',
                main: '#aa19c4',
                dark: '#530465',
                contrastText: '#fff',
            },
        },
        typography: {
            h2: {
                fontSize: 40,
            },
            h3: {
                fontSize: 28,
            },
        },
    }),
)


export default function SuperAdminApp() {
    return (
        <HelmetProvider>
            <Helmet>
                <title>🦸🏿 ADMIN- Open Feedback</title>
            </Helmet>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100vh',
                width: '100%',
                backgroundColor: '#111',
            }}>
            <LoginSuperAdmin>
                <StyledEngineProvider injectFirst>
                    <ThemeProvider theme={innerTheme}>
                        <LocalizationProvider dateAdapter={AdapterLuxon}>

                            <SuperAdminProjects/>


                        </LocalizationProvider>
                    </ThemeProvider>
                </StyledEngineProvider>
            </LoginSuperAdmin>
            </div>

        </HelmetProvider>
    )
}
