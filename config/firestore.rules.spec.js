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
                    viewerUserIds: firebase.firestore.FieldValue.arrayUnion(
                        UID_VIEWER
                    ),
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

    describe('Projects rules', () => {
        it('can create a project if logged in', async () => {
            const app = createApp()

            const project = createProject(app, 'First project', UID_VIEWER)
            await firebase.assertSucceeds(project)
        })
    })
})