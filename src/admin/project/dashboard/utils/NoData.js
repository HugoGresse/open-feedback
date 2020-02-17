import React from 'react'
import Box from '@material-ui/core/Box'
import DinoBackground from '../../../baseComponents/DinoBackground'
import { useTranslation } from 'react-i18next'

const NoData = ({ children, datas, dinoStartDelay = 0 }) => {
    const { t } = useTranslation()

    if (datas.filter(data => !!data).length > 0) {
        return children
    }
    const isDesktop = window.screen.width > 1000

    return (
        <Box display="flex" justifyContent="center" height="150px">
            {t('dashboard.noVotes')}
            <DinoBackground
                snake={false}
                speed={3}
                dinoScale={0.2}
                offsetY={isDesktop ? 260 : 90}
                spacing={isDesktop ? 2500 : 1000}
                startDelay={isDesktop ? dinoStartDelay * 1.4 : dinoStartDelay}
            />
        </Box>
    )
}

export default NoData
