/**
 * VoteItems (voting form) was stored inside a sub collection in a project document.
 * This migrate it to an array in the project directly.
 * Migrate from v0.6 to v0.7
 **/
import './helpers/initFirestore'
import {db, updateProjects} from './helpers/updates'

const main = async () => {
    await updateProjects(async (project) => {
        let voteItemsSnapshot = await db.collection('projects')
            .doc(project.id)
            .collection('voteItems')
            .get()

       return {
            voteItems: voteItemsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
       }
    })
}

main()
