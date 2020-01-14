import React from 'react'
import Box from '@material-ui/core/Box'
import DinoBackground from '../../../baseComponents/DinoBackground'

const NoData = ({ children, datas, dinoStartDelay = 0 }) => {
    if (datas.filter(data => !!data).length > 0) {
        return children
    }
    const isDesktop = window.screen.width > 1000

    return (
        <Box display="flex" justifyContent="center" height="150px">
            No votes yet
            <DinoBackground
                snake={false}
                speed={3}
                dinoScale={0.2}
                offsetY={90}
                spacing={isDesktop ? 1500 : 1000}
                startDelay={isDesktop ? dinoStartDelay * 1.4 : dinoStartDelay}
            />
        </Box>
    )
}

export default NoData
