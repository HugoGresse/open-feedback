/**
 * project does not all contain createdAd and updateAt date, for them, this will be set to 1 Jan 2020.
 * Migrate from v0.15.0 to v0.16.0
 **/
import './helpers/initFirestore'
import { db, updateDocuments } from './helpers/updates'

const main = async () => {
    console.log('==> Running update-project-createdat.2020.ts')

    await updateDocuments(db.collection('projects') as any, async project => {
        if (project.createdAt) {
            return {}
        }
        return {
            createdAt: new Date('January 1, 2020'),
            updatedAt: new Date(),
        }
    })

    console.log('==> Done running update-project-createdat.2020.ts')
}

main()
