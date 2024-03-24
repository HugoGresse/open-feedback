import React, { useEffect, useState } from 'react'
import { useMatch, useNavigate } from 'react-router-dom'
import { Backdrop, Modal, Slide } from '@mui/material'
import { OrganizationApp } from './OrganizationApp.jsx'
import { makeStyles } from '@mui/styles'
import Container from '@mui/material/Container'
import { ROUTE_ADMIN } from '../RoutingMap'

const useStyles = makeStyles(() => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        flex: '1 0 auto',
        zIndex: 1,
        WebkitOverflowScrolling: 'touch',
        position: 'fixed',
        overflowY: 'auto',
        top: 50,
        left: 0,
        right: 0,
        bottom: 0,
        height: 'auto',
        maxHeight: '100%',
        '&:focus': {
            outline: 'none',
        },
    },
}))

export const SlidingOrganizationApp = React.forwardRef(function (props, ref) {
    const classes = useStyles()
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)
    const [isClosing, setClosing] = useState(false)
    const match = useMatch({
        path: '/admin/org/:organizationId',
    })
    const mounted = React.useRef(false)
    React.useEffect(() => {
        mounted.current = true
    }, [])

    useEffect(() => {
        if (match && !isClosing) {
            setOpen(true)
        }
    }, [match, setOpen, isClosing])

    const close = () => {
        setClosing(true)
        setOpen(false)
    }

    return (
        <Modal
            ref={ref}
            open={open}
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
            onClose={close}
        >
            <Slide
                in={open}
                direction="up"
                appear={mounted.current}
                timeout={500}
                onExited={() => {
                    navigate(ROUTE_ADMIN)
                    setClosing(false)
                }}
            >
                <Container
                    maxWidth="md"
                    fixed
                    disableGutters
                    className={classes.container}
                >
                    {open && (
                        <OrganizationApp
                            key={match ? match.params.organizationId : null}
                            match={match}
                            onClose={close}
                        />
                    )}
                </Container>
            </Slide>
        </Modal>
    )
})
SlidingOrganizationApp.displayName = 'SlidingOrganizationApp'
