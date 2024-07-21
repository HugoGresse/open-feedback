import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootHeader } from './RootHeader.jsx'
import { Box, Slide } from '@mui/material'
import COLORS from '../../constants/colors'
import NewProject from '../project/new/NewProject.jsx'
import InviteDialog from '../users/InviteDialog.jsx'
import { makeStyles } from '@mui/styles'
import { isUserValidSelector } from '../auth/authSelectors'
import { RootContentLayout } from './RootContentLayout.jsx'
import EmailNotVerified from '../auth/EmailNotVerified.jsx'
import { authProvider } from '../../firebase.ts'
import { getProjects } from '../project/core/actions/getProjects'
import useQuery from '../../utils/useQuery'
import { OrganizationList } from './OrganizationList.jsx'
import { getOrganizations } from '../organization/core/actions/getOrganizations'
import { OrganisationNewDialog } from './OrganizationNewDialog.jsx'

const useStyles = makeStyles({
    container: {
        background: COLORS.ADMIN_BACKGROUND_LIGHT,
        minHeight: '100vh',
        overflow: 'hidden',
    },
    newProjectContainer: {
        position: 'absolute',
        top: 0,
        width: '100%',
        overflow: 'hidden',
    },
})

const AdminRoot = () => {
    const classes = useStyles()
    const inviteId = useQuery().get('inviteId')
    const dispatch = useDispatch()
    const isUserValid = useSelector(isUserValidSelector)
    const [isNewProjectOpenOrgId, setNewProjectOpenOrgId] = useState(false)
    const [isNewOrganizationOpen, setNewOrganizationOpen] = useState(false)

    useEffect(() => {
        authProvider.currentUser.getIdToken(true).then(() => {
            dispatch(getProjects())
            dispatch(getOrganizations())
        })
    }, [dispatch, isUserValid])

    return (
        <main style={{ position: 'relative' }}>
            <Box
                className={classes.container}
                style={{ height: isNewProjectOpenOrgId ? '100vh' : 'auto' }}>
                <RootHeader />
                <RootContentLayout isUserValid={isUserValid}>
                    {!isUserValid && <EmailNotVerified dispatch={dispatch} />}

                    {isUserValid && (
                        <OrganizationList
                            onNewEventClick={setNewProjectOpenOrgId}
                            onNewOrganizationClick={() =>
                                setNewOrganizationOpen(true)
                            }
                        />
                    )}
                </RootContentLayout>
            </Box>
            <div className={classes.newProjectContainer}>
                <Slide
                    direction="left"
                    mountOnEnter={true}
                    unmountOnExit={true}
                    in={!!isNewProjectOpenOrgId}
                    timeout={500}>
                    <div>
                        <NewProject
                            organizationId={isNewProjectOpenOrgId}
                            onCancel={() => setNewProjectOpenOrgId(null)}
                        />
                    </div>
                </Slide>
            </div>

            <OrganisationNewDialog
                open={isNewOrganizationOpen}
                onClose={() => setNewOrganizationOpen(false)}
            />

            {inviteId && <InviteDialog inviteId={inviteId} />}
        </main>
    )
}

export default AdminRoot
