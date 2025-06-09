import React, { useEffect, useState } from 'react'
import HelpIcon from '@mui/icons-material/HelpOutline'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { useTranslation } from 'react-i18next'
import { hideSmallChat, openSmallChat } from '../utils/smallchat'

const Help = ({ buttonClass }) => {
    const { t } = useTranslation()
    const [anchorEl, setAnchorEl] = useState(null)
    const [isSupportOpen, setSupportOpen] = useState(false)

    useEffect(() => {
        if (isSupportOpen) {
            openSmallChat()
        } else {
            hideSmallChat()
        }
        return () => {
            hideSmallChat()
        }
    }, [isSupportOpen])

    const openSupport = () => {
        setAnchorEl(null)
        setSupportOpen(true)
    }

    const closeSupportClick = () => {
        setSupportOpen(false)
        setAnchorEl(null)
    }

    return (
        <>
            <IconButton
                className={buttonClass}
                onClick={(event) => setAnchorEl(event.currentTarget)}>
                <HelpIcon />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}>
                <MenuItem component={'a'} target="_blank" href="/#faq">
                    {t('layout.faq')}
                </MenuItem>
                {!isSupportOpen && (
                    <MenuItem onClick={() => openSupport()}>
                        {t('layout.support')}
                    </MenuItem>
                )}
                {isSupportOpen && (
                    <MenuItem onClick={() => closeSupportClick()}>
                        {t('layout.closeSupport')}
                    </MenuItem>
                )}
            </Menu>
        </>
    )
}

export default Help
