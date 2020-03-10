import logoWhite from '../assets/logo-openfeedback-white.png'
import React from 'react'
import styled from 'styled-components'
import { COLORS } from '../constants/colors'
import { useTranslation } from 'react-i18next'
import Box from '@material-ui/core/Box'

const MenuList = styled.ul`
    @media (max-width: 640px) {
        padding-left: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    li {
        display: inline;
        margin-left: 30px;
        margin: 10px;
    }

    a {
        color: ${COLORS.WHITE};
        opacity: 0.8;
        transition: all 0.2s ease;
        padding: 10px;
        font-weight: 600;
        &:hover {
            opacity: 1;
        }
    }
    li.outline a {
        padding: 6px 10px;
        border: 2px solid ${COLORS.WHITE};
        border-radius: 4px;
    }
`

const Menu = () => {
    const { t } = useTranslation()

    return (
        <Box
            className="wrapperLogoMenu"
            display="flex"
            justifyContent="space-between">
            <img height="40" src={logoWhite} alt="open feedback" />
            <MenuList>
                <li>
                    <a href="#howitworks">{t('menu.howitworks')}</a>
                </li>
                <li>
                    <a href="#faq">{t('menu.faq')}</a>
                </li>
                <li className="outline">
                    <a href="/admin/">{t('menu.login')}</a>
                </li>
            </MenuList>
        </Box>
    )
}

export default Menu
