/**
 * projets/projectId/userVotes/document now contain a status that is either 'active' or 'deleted'.
 * It did not exist before where 'deleted' will be assiotiated with a .delete() operation.
 * Migrate from v0.15.0 to v0.16.0
 **/
import './helpers/initFirestore'
import { db, getAllProjects, updateDocuments } from './helpers/updates'

const main = async () => {
    const projects: any = await getAllProjects()

    console.log('==> Running update-userVotes-status.2020.ts')
    console.log(`${projects.length} projects.`)

    for (const project of projects) {
        console.log(
            `> Running update on project ${project.id} - ${project.name}`
        )

        await updateDocuments(
            db
                .collection('projects')
                .doc(project.id)
                .collection('userVotes') as any,
            async userVote => {
                if (userVote.status) {
                    return {}
                }
                return {
                    status: 'active',
                }
            }
        )

        console.log(
            `> Done updating project ${project.id} - ${project.name}`,
            '\n'
        )
    }

    console.log('==> Done running update-userVotes-status.2020.ts')
}

main()
