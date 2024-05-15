import React from 'react'
import { useTranslation } from 'react-i18next'
import { CircularProgress, styled } from '@mui/material'

const Container = styled('div', {})(({ theme, width, height, maxWidth }) => {
    return ({
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        opacity: 0,
        transition: 'all 1s ease-in',
        animation: '1s appearDelayed',
        animationDelay: '500ms',
        animationFillMode: 'forwards',
        width: width,
        height: height,
        maxWidth: maxWidth,
        '& > div': {
            color: theme.palette.primary.main,
        },

        '@keyframes appearDelayed': {
            from: { opacity: 0 },
            to: { opacity: 1 },
        },
    })
})

const LoaderMatchParent = ({
                               height = '100vh',
                               width = '100%',
                               style = {},
                               maxWidth = undefined,
                           }) => {
    const { t } = useTranslation()
    return (
        <Container height={height} width={width} maxWidth={maxWidth} >
            <CircularProgress style={style} aria-label={t('common.loading')} />
        </Container>
    )
}

export default LoaderMatchParent
