import '@mui/material/styles'

// Custom palette entries of the feedback app theme (src/feedback/feedbackTheme.ts).
interface OpenFeedbackPalette {
    pageBackground: string
    headerShadow: string
    paperBorder: string
    paperVoteBorder: string
    textVoteTitle: string
    textVoteTitleShadow: string
    textDimmed: string
}

declare module '@mui/material/styles' {
    interface Palette extends OpenFeedbackPalette {}
    interface PaletteOptions extends Partial<OpenFeedbackPalette> {}
}
