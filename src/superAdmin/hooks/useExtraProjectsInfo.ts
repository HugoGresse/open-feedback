import { ProjectExtraInfo, Project } from '../type.ts'
import { useEffect, useState } from 'react'
import { fireStoreMainInstance } from '../../firebase.ts'
// @ts-ignore
import { initProjectApi } from '../../core/setupType/projectApi.js'

const getOrganizationName = async (organizationId: string) => {
    return fireStoreMainInstance
        .collection('organizations')
        .doc(organizationId)
        .get()
        .then((doc) => {
            return doc.data()?.name || '•'
        })
}

const getProjectVoteCount = async (projectId: string) => {
    return fireStoreMainInstance
        .collection('projects')
        .doc(projectId)
        .collection('userVotes')
        .get()
        .then((querySnapshot) => {
            return querySnapshot.size
        })
}
const getUser = async (
    userId: string
): Promise<{
    email: string
    name: string
}> => {
    return fireStoreMainInstance
        .collection('users')
        .doc(userId)
        .get()
        .then((doc) => {
            return {
                email: doc.data()?.email || '•',
                name: doc.data()?.displayName || '•',
            }
        })
}

const getSpeakers = async (project: Project) => {
    // initProjectApi(project.setupType, project)
    // TODO : initProjectApi is not working as it is a singleton, we need to create a specific API for each project
}

export const useExtraProjectsInfo = (loadedProjects: Project[]) => {
    const [organizations, setOrganizations] = useState<{
        [organizationId: string]: string
    }>({})

    const [projects, setProjects] = useState<{
        [projectId: string]: ProjectExtraInfo
    }>({})
    const [users, setUsers] = useState<{
        [userId: string]: {
            email: string
            name: string
        }
    }>({})

    useEffect(() => {
        const runFunction = async () => {
            for (const project of loadedProjects) {
                const organizationId = project.organizationId
                if (organizationId && !organizations[organizationId]) {
                    const organizationName =
                        await getOrganizationName(organizationId)

                    setOrganizations((pastState) => ({
                        ...pastState,
                        ...organizations,
                        [organizationId]: organizationName,
                    }))
                }
                if (!projects[project.id]) {
                    const voteCount = await getProjectVoteCount(project.id)
                    setProjects((pastState) => ({
                        ...pastState,
                        [project.id]: {
                            voteCount,
                            dateCreated: project.createdAt
                                .toDate()
                                .toLocaleDateString(),
                            dateVote: project.voteStartTime
                                ? project.voteStartTime
                                      .toDate()
                                      .toLocaleDateString()
                                : '•',
                            speakerCount: 0,
                            link: `https://openfeedback.io/${project.id}/`,
                        },
                    }))
                }
                if (!users[project.owner]) {
                    const user = await getUser(project.owner)
                    setUsers((pastState) => ({
                        ...pastState,
                        [project.owner]: user,
                    }))
                }
            }
        }

        runFunction()
    }, [loadedProjects])

    return {
        projects,
        organizations,
        users,
    }
}
