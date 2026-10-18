import '@mui/material/styles'

// Custom palette entries of the feedback app theme (src/feedback/FeedbackApp.tsx).
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
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface Palette extends OpenFeedbackPalette {}
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface PaletteOptions extends Partial<OpenFeedbackPalette> {}
}
