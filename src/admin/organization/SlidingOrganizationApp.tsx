import { useEffect, useState, forwardRef, useRef } from 'react'
import { useMatch, useNavigate } from 'react-router-dom'
import { Modal, Slide } from '@mui/material'
import { OrganizationApp } from './OrganizationApp.tsx'
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

export const SlidingOrganizationApp = forwardRef<
    HTMLDivElement,
    Record<string, never>
>(function SlidingOrganizationApp(_props, ref) {
    const classes = useStyles()
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)
    const [isClosing, setClosing] = useState(false)
    const match = useMatch({
        path: '/admin/org/:organizationId/*',
    })
    const mounted = useRef(false)
    useEffect(() => {
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
            slotProps={{
                backdrop: {
                    timeout: 500,
                },
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
                    {open && match && (
                        <OrganizationApp
                            key={match.params.organizationId}
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
