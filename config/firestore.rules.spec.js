/* eslint-env jest */
const firebase = require('@firebase/testing')
const path = require('path')
const fs = require('fs')

const projectId = 'openfeedback'

const UID_VIEWER = 'viewerUserId'
const UID_EDITOR = 'editorUserId'
const UID_ADMIN = 'adminUserId'
const UID_ANOTHER_ADMIN = 'anotherAdminUserId'
const UID_OWNER = 'ownerUserId'

function createApp(uid = UID_VIEWER) {
    const auth = {
        uid,
        email_verified: true,
        email: uid,
    }
    return firebase.initializeTestApp({ projectId, auth }).firestore()
}

const createOrg = async (
    app,
    orgId,
    viewerUserIds = [],
    editorUserIds = [],
    adminUserIds = [],
    ownerUserId = null
) => {
    await app.collection('organizations').doc(orgId).set(
        {
            organizationName: orgId,
            viewerUserIds,
            editorUserIds,
            adminUserIds,
            ownerUserId,
        },
        { merge: true }
    )
}

const createProject = (app, name, owner, organizationId = null) => {
    const project = {
        name,
        owner,
        members: [owner],
    }
    if (organizationId) {
        project.organizationId = organizationId
    }
    return app.collection('projects').add(project)
}

const updateProject = (app, projectId, organizationId = null) => {
    const project = {
        updatedAt: Date.now(),
    }
    if (organizationId) {
        project.organizationId = organizationId
    }
    return app.collection('projects').doc(projectId).update(project)
}

const getProject = (app, projectId) => {
    return app.collection('projects').doc(projectId).get()
}

const addFullDataToProject = async (app, projectId, userId) => {
    const speakerRef = await app
        .collection('projects')
        .doc(projectId)
        .collection('speakers')
        .add({
            name: `${Date.now}`,
        })
    await app
        .collection('projects')
        .doc(projectId)
        .collection('talks')
        .add({
            name: `talk ${Date.now}`,
            speakers: [speakerRef.id],
        })
    await app
        .collection('projects')
        .doc(projectId)
        .collection('userVotes')
        .add({
            userId: userId,
            projectId,
            voteItemId: 'toto',
            status: 'active',
        })
    // Add dumb aggregate data
    await app
        .collection('projects')
        .doc(projectId)
        .collection('sessionVotes')
        .add({
            toto: 1,
        })
}

const assertProjectAllCollections = async (app, projectId, assertMethod) => {
    const collections = ['talks', 'speakers', 'sessionVotes', 'userVotes']

    for (const collection of collections) {
        const request = app
            .collection('projects')
            .doc(projectId)
            .collection(collection)
            .get()
        await assertMethod(request)
    }
}

describe('Firestore rules', () => {
    beforeAll(async () => {
        const rulesPath = path.join(__dirname, 'firestore.rules')
        const rules = fs.readFileSync(rulesPath, 'utf8')
        await firebase.loadFirestoreRules({ projectId, rules })
    })

    afterAll(async () => {
        await Promise.all(firebase.apps().map((app) => app.delete()))
    })

    beforeEach(async () => {
        await firebase.clearFirestoreData({ projectId })
    })

    describe('Organization/viewer', () => {
        it('can list organizations with viewer role', async () => {
            const app = createApp()
            await createOrg(app, 'Empty org')
            await createOrg(app, 'FirstOrg', [UID_VIEWER])
            await createOrg(app, 'SecondOrg', [UID_ADMIN])

            const listOrg = app
                .collection('organizations')
                .where('viewerUserIds', 'array-contains', UID_VIEWER)
                .get()
            const results = await firebase.assertSucceeds(listOrg)
            expect(results.docs.length).toEqual(1)
        })

        it('can read a single organization', async () => {
            const app = createApp()
            await createOrg(app, 'FirstOrg', [UID_VIEWER])

            const getOrg = app.collection('organizations').doc('FirstOrg').get()
            await firebase.assertSucceeds(getOrg)
        })

        it('cannot create a project for an organization with viewer only role', async () => {
            const app = createApp()
            await createOrg(app, 'FirstOrg', [UID_VIEWER])

            const project = createProject(
                app,
                'First project',
                UID_VIEWER,
                'FirstOrg'
            )
            await firebase.assertFails(project)
        })

        it('cannot create a project for an organization without any role', async () => {
            const app = createApp()
            await createOrg(app, 'FirstOrg', [])

            const project = createProject(
                app,
                'First project',
                UID_VIEWER,
                'FirstOrg'
            )
            await firebase.assertFails(project)
        })

        it('cannot edit a project for an organization without any role', async () => {
            const adminApp = createApp(UID_ADMIN)
            const app = createApp()

            await createOrg(adminApp, 'FirstOrg', [], [UID_ADMIN])
            const projectRef = await createProject(
                adminApp,
                'First project',
                UID_ADMIN,
                'FirstOrg'
            )
            const projectId = projectRef.id

            const project = updateProject(app, projectId)
            await firebase.assertFails(project)
        })

        it('cannot edit a project for an organization with viewer role', async () => {
            const adminApp = createApp(UID_ADMIN)
            const app = createApp()

            await createOrg(adminApp, 'FirstOrg', [UID_VIEWER], [UID_ADMIN])
            const projectRef = await createProject(
                adminApp,
                'First project',
                UID_ADMIN,
                'FirstOrg'
            )
            const projectId = projectRef.id

            const project = updateProject(app, projectId)
            await firebase.assertFails(project)
        })

        it("can list organization's projects with viewer role", async () => {
            const adminApp = createApp(UID_ADMIN)
            const app = createApp()

            await createOrg(adminApp, 'FirstOrg', [UID_VIEWER], [UID_ADMIN])
            await createProject(
                adminApp,
                'First project',
                UID_ADMIN,
                'FirstOrg'
            )

            const projects = app
                .collection('projects')
                .where('organizationId', '==', 'FirstOrg')
                .get()
            await firebase.assertSucceeds(projects)
        })

        it('can get a full project for an organization with viewer role', async () => {
            const adminApp = createApp(UID_ADMIN)
            const app = createApp()

            await createOrg(adminApp, 'FirstOrg', [UID_VIEWER], [UID_ADMIN])
            const projectRef = await createProject(
                adminApp,
                'First project',
                UID_ADMIN,
                'FirstOrg'
            )
            const projectId = projectRef.id
            await addFullDataToProject(adminApp, projectId, UID_ADMIN)

            const project = getProject(app, projectId)
            await firebase.assertSucceeds(project)
            await assertProjectAllCollections(
                app,
                projectId,
                firebase.assertSucceeds
            )
        })

        it('cannot delete a project for an organization with viewer role', async () => {
            const adminApp = createApp(UID_ADMIN)
            const app = createApp()

            await createOrg(adminApp, 'FirstOrg', [UID_VIEWER], [UID_ADMIN])
            const projectRef = await createProject(
                adminApp,
                'First project',
                UID_ADMIN,
                'FirstOrg'
            )
            const projectId = projectRef.id

            const project = app.collection('projects').doc(projectId).delete()
            await firebase.assertFails(project)
        })

        it('cannot edit the organization or org users with viewer role', async () => {
            const adminApp = createApp(UID_ADMIN)
            const app = createApp(UID_VIEWER)

            await createOrg(adminApp, 'FirstOrg', [UID_VIEWER], [UID_ADMIN])
            const delOrg = app
                .collection('organizations')
                .doc('FirstOrg')
                .delete()
            await firebase.assertFails(delOrg)

            const updateOrg = app
                .collection('organizations')
                .doc('FirstOrg')
                .update({
                    name: 'toto',
                })
            await firebase.assertFails(updateOrg)
        })

        it('cannot edit the project talks and speakers with viewer role', async () => {
            const adminApp = createApp(UID_ADMIN)
            const app = createApp(UID_VIEWER)

            await createOrg(adminApp, 'FirstOrg', [UID_VIEWER], [UID_ADMIN])
            const projectRef = await createProject(
                adminApp,
                'First project',
                UID_ADMIN,
                'FirstOrg'
            )

            const projectId = projectRef.id

            const addTalk = app
                .collection('projects')
                .doc(projectId)
                .collection('talks')
                .add({
                    name: 'Toto',
                })
            await firebase.assertFails(addTalk)
            const addSpeaker = app
                .collection('projects')
                .doc(projectId)
                .collection('speakers')
                .add({
                    name: 'Toto',
                })
            await firebase.assertFails(addSpeaker)
        })
    })

    describe('Organization/editor', () => {
        it('can create a project for an organization with editor role', async () => {
            const app = createApp(UID_EDITOR)
            await createOrg(app, 'FirstOrg', [], [UID_EDITOR])

            const project = createProject(
                app,
                'First project',
                UID_EDITOR,
                'FirstOrg'
            )
            await firebase.assertSucceeds(project)
        })

        it('can edit a project for an organization with editor role', async () => {
            const editorApp = createApp(UID_EDITOR)

            await createOrg(editorApp, 'FirstOrg', [], [UID_EDITOR])
            const projectRef = await createProject(
                editorApp,
                'First project',
                UID_ADMIN,
                'FirstOrg'
            )
            const projectId = projectRef.id

            const project = updateProject(editorApp, projectId)
            await firebase.assertSucceeds(project)
        })

        it('can delete a project he own for an organization with editor role', async () => {
            const editorApp = createApp(UID_EDITOR)

            await createOrg(editorApp, 'FirstOrg', [], [UID_EDITOR, UID_EDITOR])
            const projectRef = await createProject(
                editorApp,
                'First project',
                UID_EDITOR,
                'FirstOrg'
            )
            const projectId = projectRef.id

            const project = editorApp
                .collection('projects')
                .doc(projectId)
                .delete()
            await firebase.assertSucceeds(project)
        })

        it('cannot delete a project he does not own for an organization with editor role', async () => {
            const editorApp = createApp(UID_EDITOR)

            await createOrg(editorApp, 'FirstOrg', [], [UID_ADMIN, UID_EDITOR])
            const projectRef = await createProject(
                editorApp,
                'First project',
                UID_ADMIN,
                'FirstOrg'
            )
            const projectId = projectRef.id

            const project = editorApp
                .collection('projects')
                .doc(projectId)
                .delete()
            await firebase.assertFails(project)
        })

        it('cannot create a project on another organization with editor role', async () => {
            const adminApp = createApp(UID_ADMIN)
            const editorApp = createApp(UID_EDITOR)

            await createOrg(adminApp, 'FirstOrg', [], [UID_ADMIN])
            await createOrg(editorApp, 'SecondOrg', [], [UID_EDITOR])
            const project = createProject(
                editorApp,
                'Second project',
                UID_EDITOR,
                'FirstOrg'
            )
            await firebase.assertFails(project)
            const project2 = createProject(
                adminApp,
                'Third project',
                UID_ADMIN,
                'SecondOrg'
            )
            await firebase.assertFails(project2)
        })

        it('cannot edit a project on another organization with editor role', async () => {
            const adminApp = createApp(UID_ADMIN)
            const editorApp = createApp(UID_EDITOR)

            await createOrg(adminApp, 'FirstOrg', [], [UID_ADMIN])
            await createOrg(editorApp, 'SecondOrg', [], [UID_EDITOR])
            const projectRef = await createProject(
                adminApp,
                'First project',
                UID_ADMIN,
                'FirstOrg'
            )
            const projectId = projectRef.id

            const project = updateProject(editorApp, projectId, 'SecondOrg')
            await firebase.assertFails(project)
        })

        it('cannot edit the organization or org users with editor role', async () => {
            const adminApp = createApp(UID_ADMIN)
            const editorApp = createApp(UID_EDITOR)

            await createOrg(adminApp, 'FirstOrg', [UID_EDITOR], [UID_EDITOR])
            const delOrg = editorApp
                .collection('organizations')
                .doc('FirstOrg')
                .delete()
            await firebase.assertFails(delOrg)

            const updateOrg = editorApp
                .collection('organizations')
                .doc('FirstOrg')
                .update({
                    name: 'toto',
                })
            await firebase.assertFails(updateOrg)
        })

        it('can edit the project talks and speakers with editor role', async () => {
            const adminApp = createApp(UID_ADMIN)
            const app = createApp(UID_EDITOR)

            await createOrg(
                adminApp,
                'FirstOrg',
                [UID_EDITOR],
                [UID_EDITOR, UID_ADMIN]
            )
            const projectRef = await createProject(
                adminApp,
                'First project',
                UID_ADMIN,
                'FirstOrg'
            )

            const projectId = projectRef.id

            const addTalk = app
                .collection('projects')
                .doc(projectId)
                .collection('talks')
                .add({
                    name: 'Toto',
                })
            await firebase.assertSucceeds(addTalk)
            const addSpeaker = app
                .collection('projects')
                .doc(projectId)
                .collection('speakers')
                .add({
                    name: 'Toto',
                })
            await firebase.assertSucceeds(addSpeaker)
        })
    })

    describe('Organization/admin', () => {
        it('can delete any project linked to organization with admin role', async () => {
            const editorApp = createApp(UID_EDITOR)
            const adminApp = createApp(UID_ADMIN)
            await createOrg(
                editorApp,
                'FirstOrg',
                [],
                [UID_EDITOR],
                [UID_ADMIN]
            )
            const project = await createProject(
                editorApp,
                'project',
                UID_EDITOR,
                'FirstOrg'
            )

            const delProject = adminApp
                .collection('projects')
                .doc(project.id)
                .delete()
            await firebase.assertSucceeds(delProject)
        })

        it('cannot delete/edit a project from another organization with admin role', async () => {
            const anotherAdminApp = createApp(UID_ANOTHER_ADMIN)
            const adminApp = createApp(UID_ADMIN)
            await createOrg(adminApp, 'FirstOrg', [], [UID_EDITOR], [UID_ADMIN])
            await createOrg(
                anotherAdminApp,
                'SecondOrg',
                [UID_ANOTHER_ADMIN],
                [UID_ANOTHER_ADMIN],
                [UID_ANOTHER_ADMIN]
            )
            const project = await createProject(
                anotherAdminApp,
                'project',
                UID_ANOTHER_ADMIN,
                'SecondOrg'
            )

            const delProject = adminApp
                .collection('projects')
                .doc(project.id)
                .delete()
            await firebase.assertFails(delProject)

            const editProject = adminApp
                .collection('projects')
                .doc(project.id)
                .update({
                    name: 'titi',
                })
            await firebase.assertFails(editProject)
        })

        it('can add users to an organization with admin role', async () => {
            const adminApp = createApp(UID_ADMIN)
            await createOrg(adminApp, 'FirstOrg', [], [], [UID_ADMIN])

            const addUserToOrg = adminApp
                .collection('organizations')
                .doc('FirstOrg')
                .update({
                    viewerUserIds:
                        firebase.firestore.FieldValue.arrayUnion(UID_VIEWER),
                })
            await firebase.assertSucceeds(addUserToOrg)

            const updateOrg = adminApp
                .collection('organizations')
                .doc('FirstOrg')
                .update({
                    name: 'NewOrgName',
                })
            await firebase.assertSucceeds(updateOrg)
        })

        it('cannot set the organization owner with admin role', async () => {
            const adminApp = createApp(UID_ADMIN)
            await createOrg(adminApp, 'FirstOrg', [], [], [UID_ADMIN])

            const setOrgOwner = adminApp
                .collection('organizations')
                .doc('FirstOrg')
                .update({
                    ownerUserId: UID_ADMIN,
                })
            await firebase.assertFails(setOrgOwner)
        })

        it('cannot delete an organization with admin role', async () => {
            const adminApp = createApp(UID_ADMIN)
            await createOrg(adminApp, 'FirstOrg', [], [], [UID_ADMIN])

            const deleteOrg = adminApp
                .collection('organizations')
                .doc('FirstOrg')
                .delete()
            await firebase.assertFails(deleteOrg)
        })
    })

    describe('Organization/owner', () => {
        it('can change the organization owner with owner role', async () => {
            const ownerUserId = createApp(UID_OWNER)
            await createOrg(ownerUserId, 'FirstOrg', [], [], [], UID_OWNER)

            const setOrgOwner = ownerUserId
                .collection('organizations')
                .doc('FirstOrg')
                .update({
                    ownerUserId: UID_ADMIN,
                })
            await firebase.assertSucceeds(setOrgOwner)

            const setBackOrgOwner = ownerUserId
                .collection('organizations')
                .doc('FirstOrg')
                .update({
                    ownerUserId: UID_OWNER,
                })
            await firebase.assertFails(setBackOrgOwner)
        })

        it('can delete an organization with owner role', async () => {
            const ownerApp = createApp(UID_OWNER)
            await createOrg(ownerApp, 'FirstOrg', [], [], [], UID_OWNER)

            const deleteOrg = ownerApp
                .collection('organizations')
                .doc('FirstOrg')
                .delete()
            await firebase.assertSucceeds(deleteOrg)
        })
    })

    describe('invites', () => {
        it('project owner can create & delete a new invite', async () => {
            const ownerUserId = createApp(UID_OWNER)
            const project = await createProject(
                ownerUserId,
                'First project',
                UID_OWNER
            )

            const invite = ownerUserId.collection('invites').add({
                projectId: project.id,
            })

            const inviteSnapshot = await firebase.assertSucceeds(invite)

            const deleteInvite = ownerUserId
                .collection('invites')
                .doc(inviteSnapshot.id)
                .delete()

            await firebase.assertSucceeds(deleteInvite)
        })

        it('destination user can get an invite but not another person', async () => {
            const ownerApp = createApp(UID_OWNER)
            const adminApp = createApp(UID_ADMIN)
            const strangerApp = createApp(UID_VIEWER)
            const project = await createProject(
                ownerApp,
                'First project',
                UID_OWNER
            )

            const invite = await ownerApp.collection('invites').add({
                projectId: project.id,
                destinationUserInfo: UID_ADMIN,
            })
            const inviteId = invite.id

            const getInvite = adminApp.collection('invites').doc(inviteId).get()
            await firebase.assertSucceeds(getInvite)

            const getInviteStranger = strangerApp
                .collection('invites')
                .doc(inviteId)
                .get()

            await firebase.assertFails(getInviteStranger)
        })

        it('project admin can list the project invites, not another random user', async () => {
            const ownerApp = createApp(UID_OWNER)
            const strangerApp = createApp(UID_VIEWER)
            const project = await createProject(
                ownerApp,
                'First project',
                UID_OWNER
            )

            await ownerApp.collection('invites').add({
                projectId: project.id,
                destinationUserInfo: UID_ADMIN,
            })
            await ownerApp.collection('invites').add({
                projectId: project.id,
                destinationUserInfo: UID_ANOTHER_ADMIN,
            })

            const listInvites = ownerApp
                .collection('invites')
                .where('projectId', '==', project.id)
                .get()
            const invites = await firebase.assertSucceeds(listInvites)
            expect(invites.docs.length).toEqual(2)

            const getInvitesStranger = strangerApp
                .collection('invites')
                .where('projectId', '==', project.id)
                .get()

            await firebase.assertFails(getInvitesStranger)
        })

        it('organization admin and owner can create & list & delete organization invites', async () => {
            const ownerApp = createApp(UID_OWNER)
            const adminApp = createApp(UID_ADMIN)
            await createOrg(
                ownerApp,
                'FirstOrg',
                [],
                [],
                [UID_ADMIN, UID_OWNER],
                UID_OWNER
            )

            const invite1 = ownerApp.collection('invites').add({
                organizationId: 'FirstOrg',
                destinationUserInfo: UID_VIEWER,
                role: 'Viewer',
            })
            const invite2 = adminApp.collection('invites').add({
                organizationId: 'FirstOrg',
                destinationUserInfo: UID_ANOTHER_ADMIN,
                role: 'Admin',
            })

            const invitation1 = await firebase.assertSucceeds(invite1)
            const invitation2 = await firebase.assertSucceeds(invite2)

            const del1 = ownerApp
                .collection('invites')
                .doc(invitation1.id)
                .delete()
            const del2 = ownerApp
                .collection('invites')
                .doc(invitation2.id)
                .delete()

            await firebase.assertSucceeds(del1)
            await firebase.assertSucceeds(del2)
        })

        it('organization admin and owner can list organization invites', async () => {
            const ownerApp = createApp(UID_OWNER)
            const adminApp = createApp(UID_ADMIN)
            await createOrg(
                ownerApp,
                'FirstOrg',
                [UID_ADMIN, UID_OWNER],
                [UID_ADMIN, UID_OWNER],
                [UID_ADMIN, UID_OWNER],
                UID_OWNER
            )

            await ownerApp.collection('invites').add({
                organizationId: 'FirstOrg',
                destinationUserInfo: UID_VIEWER,
                role: 'Viewer',
            })
            await adminApp.collection('invites').add({
                organizationId: 'FirstOrg',
                destinationUserInfo: UID_ANOTHER_ADMIN,
                role: 'Admin',
            })

            const listAdmin = adminApp
                .collection('invites')
                .where('organizationId', '==', 'FirstOrg')
                .get()

            const listAdminResult = await firebase.assertSucceeds(listAdmin)
            expect(listAdminResult.docs.length).toEqual(2)

            const listOwner = ownerApp
                .collection('invites')
                .where('organizationId', '==', 'FirstOrg')
                .get()
            const listOwnerResult = await firebase.assertSucceeds(listOwner)
            expect(listOwnerResult.docs.length).toEqual(2)
        })

        it('organization editors cannot create/delete organization invites', async () => {
            const ownerApp = createApp(UID_OWNER)
            const editorApp = createApp(UID_EDITOR)
            await createOrg(
                ownerApp,
                'FirstOrg',
                [UID_VIEWER],
                [UID_EDITOR],
                [UID_OWNER],
                UID_OWNER
            )

            const invite = await ownerApp.collection('invites').add({
                organizationId: 'FirstOrg',
                destinationUserInfo: UID_ADMIN,
                role: 'Viewer',
            })

            const createInviteFromEditor = editorApp.collection('invites').add({
                organizationId: 'FirstOrg',
                destinationUserInfo: UID_ADMIN,
                role: 'Viewer',
            })

            await firebase.assertFails(createInviteFromEditor)

            const del2 = editorApp.collection('invites').doc(invite.id).delete()
            await firebase.assertFails(del2)
        })

        it('organization viewers cannot create/delete organization invites', async () => {
            const ownerApp = createApp(UID_OWNER)
            const viewerApp = createApp(UID_VIEWER)
            await createOrg(
                ownerApp,
                'FirstOrg',
                [UID_VIEWER],
                [UID_EDITOR],
                [UID_OWNER],
                UID_OWNER
            )

            const invite = await ownerApp.collection('invites').add({
                organizationId: 'FirstOrg',
                destinationUserInfo: UID_ADMIN,
                role: 'Viewer',
            })

            const createInviteFromViewer = viewerApp.collection('invites').add({
                organizationId: 'FirstOrg',
                destinationUserInfo: UID_ADMIN,
                role: 'Viewer',
            })
            await firebase.assertFails(createInviteFromViewer)

            const del1 = viewerApp.collection('invites').doc(invite.id).delete()
            await firebase.assertFails(del1)
        })

        it('organization viewers & editors can list organization invites', async () => {
            const ownerApp = createApp(UID_OWNER)
            const viewerApp = createApp(UID_VIEWER)
            const editorApp = createApp(UID_EDITOR)
            await createOrg(
                ownerApp,
                'FirstOrg',
                [UID_VIEWER, UID_EDITOR],
                [UID_EDITOR],
                [UID_OWNER],
                UID_OWNER
            )

            await ownerApp.collection('invites').add({
                organizationId: 'FirstOrg',
                destinationUserInfo: UID_ADMIN,
                role: 'Viewer',
            })
            await ownerApp.collection('invites').add({
                organizationId: 'FirstOrg',
                destinationUserInfo: UID_OWNER,
                role: 'Viewer',
            })

            const listFromViewer = viewerApp
                .collection('invites')
                .where('organizationId', '==', 'FirstOrg')
                .get()
            const listFromEditor = editorApp
                .collection('invites')
                .where('organizationId', '==', 'FirstOrg')
                .get()

            const invitesListFromViewer =
                await firebase.assertSucceeds(listFromViewer)
            const invitesListFromEditor =
                await firebase.assertSucceeds(listFromEditor)
            expect(invitesListFromViewer.docs.length).toEqual(2)
            expect(invitesListFromEditor.docs.length).toEqual(2)
        })

        it('a user cannot create an invite for an organization he is not admin of', async () => {
            const ownerApp = createApp(UID_OWNER)
            const strangerApp = createApp(UID_ANOTHER_ADMIN)
            await createOrg(
                ownerApp,
                'FirstOrg',
                [],
                [],
                [UID_OWNER],
                UID_OWNER
            )

            const newInvite = strangerApp.collection('invites').add({
                organizationId: 'FirstOrg',
                destinationUserInfo: UID_ADMIN,
                role: 'Viewer',
            })

            await firebase.assertFails(newInvite)
        })
    })

    describe('Projects rules', () => {
        it('can create a project if logged in', async () => {
            const app = createApp()

            const project = createProject(app, 'First project', UID_VIEWER)
            await firebase.assertSucceeds(project)
        })

        it('can delete existing votes if owner', async () => {
            const app = createApp(UID_VIEWER)
            const project = await createProject(
                app,
                'First project',
                UID_VIEWER
            )
            const projectId = project.id
            await addFullDataToProject(app, projectId, UID_VIEWER)

            // Check userVotes
            const userVotes = await app
                .collection('projects')
                .doc(projectId)
                .collection('userVotes')
                .get()
            const results = await firebase.assertSucceeds(userVotes)
            expect(results.docs.length).toEqual(1)
            for (const doc of results.docs) {
                const deleteUserVote = app
                    .collection('projects')
                    .doc(projectId)
                    .collection('userVotes')
                    .doc(doc.id)
                    .delete()
                await firebase.assertSucceeds(deleteUserVote)
            }

            // Check sessionVotes
            const sessionVotes = await app
                .collection('projects')
                .doc(projectId)
                .collection('sessionVotes')
                .get()
            const results2 = await firebase.assertSucceeds(sessionVotes)
            expect(results2.docs.length).toEqual(1)
            for (const doc of results2.docs) {
                const deleteVote = app
                    .collection('projects')
                    .doc(projectId)
                    .collection('sessionVotes')
                    .doc(doc.id)
                    .delete()
                await firebase.assertSucceeds(deleteVote)
            }
        })

        it('cannot delete existing votes if anonymous but can if member', async () => {
            const adminApp = createApp(UID_ADMIN)
            const viewerApp = createApp(UID_VIEWER)
            const anotherApp = createApp(UID_ANOTHER_ADMIN)
            const project = await createProject(
                adminApp,
                'First project',
                UID_ADMIN
            )
            const projectId = project.id
            await addFullDataToProject(adminApp, projectId, UID_ADMIN)

            const addViewerAsMemberOnProject = adminApp
                .collection('projects')
                .doc(projectId)
                .update({
                    members: [UID_ADMIN, UID_VIEWER],
                })
            await firebase.assertSucceeds(addViewerAsMemberOnProject)

            // Check userVotes
            const userVotes = await viewerApp
                .collection('projects')
                .doc(projectId)
                .collection('userVotes')
                .get()
            const results = await firebase.assertSucceeds(userVotes)
            expect(results.docs.length).toEqual(1)
            for (const doc of results.docs) {
                const deleteUserVote = viewerApp
                    .collection('projects')
                    .doc(projectId)
                    .collection('userVotes')
                    .doc(doc.id)
                    .delete()
                await firebase.assertSucceeds(deleteUserVote)
                const deleteUserVote2 = anotherApp
                    .collection('projects')
                    .doc(projectId)
                    .collection('userVotes')
                    .doc(doc.id)
                    .delete()
                await firebase.assertFails(deleteUserVote2)
            }

            // Check sessionVotes
            const sessionVotes = await viewerApp
                .collection('projects')
                .doc(projectId)
                .collection('sessionVotes')
                .get()
            const results2 = await firebase.assertSucceeds(sessionVotes)
            expect(results2.docs.length).toEqual(1)
            for (const doc of results2.docs) {
                const deleteVote = viewerApp
                    .collection('projects')
                    .doc(projectId)
                    .collection('sessionVotes')
                    .doc(doc.id)
                    .delete()
                await firebase.assertSucceeds(deleteVote)
                const deleteVote2 = anotherApp
                    .collection('projects')
                    .doc(projectId)
                    .collection('sessionVotes')
                    .doc(doc.id)
                    .delete()
                await firebase.assertFails(deleteVote2)
            }
        })
    })
})
