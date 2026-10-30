import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { ThemeProvider } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import { BooleanVoteButton } from '../../../../feedback/talk/boolean/BooleanVoteButton.tsx'
import { createFeedbackTheme } from '../../../../feedback/feedbackTheme'

const feedbackThemes = [createFeedbackTheme(false), createFeedbackTheme(true)]

/** Votes from other attendees, before the admin own vote. */
const previewItems = [
    { nameKey: 'settingsEvent.chipColorsPreviewItem1', otherVotes: 4 },
    { nameKey: 'settingsEvent.chipColorsPreviewItem2', otherVotes: 11 },
] as const

interface ChipColorsPreviewProps {
    /** Hex colors without `#`. */
    chipColors?: string[]
}

/**
 * Boolean votes rendered with the feedback app components and themes (light
 * and dark), so the chip colors can be checked while editing them.
 */
export const ChipColorsPreview = ({ chipColors }: ChipColorsPreviewProps) => {
    const { t } = useTranslation()
    // The second item starts voted to show both states
    const [selected, setSelected] = useState([false, true])

    const toggle = (index: number) =>
        setSelected((current) =>
            current.map((isSelected, i) =>
                i === index ? !isSelected : isSelected
            )
        )

    return (
        <Box sx={{ clear: 'both', paddingTop: 1 }}>
            <Typography variant="caption" color="textSecondary">
                {t('settingsEvent.chipColorsPreview')}
            </Typography>
            <Box
                data-testid="ChipColorsPreview"
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                    gap: 1,
                    marginTop: 0.5,
                }}
            >
                {feedbackThemes.map((theme) => (
                    <ThemeProvider theme={theme} key={theme.palette.mode}>
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                padding: 1,
                                backgroundColor: theme.palette.pageBackground,
                                border: 1,
                                borderColor: theme.palette.paperBorder,
                            }}
                        >
                            {previewItems.map((item, index) => (
                                <BooleanVoteButton
                                    key={item.nameKey}
                                    name={t(item.nameKey)}
                                    isSelected={selected[index]}
                                    voteResult={
                                        item.otherVotes +
                                        (selected[index] ? 1 : 0)
                                    }
                                    chipColors={chipColors}
                                    onClick={() => toggle(index)}
                                />
                            ))}
                        </Box>
                    </ThemeProvider>
                ))}
            </Box>
        </Box>
    )
}
