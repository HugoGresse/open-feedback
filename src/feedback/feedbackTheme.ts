import { responsiveFontSizes } from '@mui/material'
import { createTheme } from '@mui/material/styles'
import { grey } from '@mui/material/colors'
import { COLORS } from '../constants/colors'

const createFeedbackTheme = (prefersDarkMode: boolean) =>
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
                    secondary: prefersDarkMode
                        ? 'rgba(255, 255, 255, 0.7)'
                        : grey[600],
                },
                mode: prefersDarkMode ? 'dark' : 'light',
                pageBackground: prefersDarkMode ? '#303030' : '#fff',
                headerShadow: prefersDarkMode ? '#000' : '#B3B3B3',
                paperBorder: prefersDarkMode ? grey[600] : grey[300],
                paperVoteBorder: prefersDarkMode ? grey[400] : grey[300],
                textVoteTitle: prefersDarkMode ? grey[400] : grey[900],
                textVoteTitleShadow: prefersDarkMode ? grey[800] : grey[50],
                textDimmed: prefersDarkMode ? grey[400] : grey[600],
            },
        })
    )

/** Themes of the feedback app, also used by the admin to preview votes. */
export const feedbackThemes = {
    light: createFeedbackTheme(false),
    dark: createFeedbackTheme(true),
}
