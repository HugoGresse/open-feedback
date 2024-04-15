/* eslint-disable no-console */
import {
    getFirestore,
    CollectionReference,
    DocumentData,
} from 'firebase-admin/firestore'

export const db = getFirestore()

type FirebaseId = string

export const getProject = async (id: FirebaseId) => {
    const doc = await db.collection('projects').doc(id).get()
    return { id: doc.id, ...doc.data() }
}

export const getAllProjects = async () => {
    const projects = await db.collection('projects').get()
    return projects.docs.map((doc: DocumentData) => ({
        id: doc.id,
        ...doc.data(),
    }))
}

export const getAllMatchingProjects = async (owner: string | null = null) => {
    const collectionRef = db.collection('projects')

    let query = null

    if (owner) {
        console.log('where owner', owner)
        query = collectionRef.where('owner', '==', owner)
    }

    if (!query) {
        throw new Error('No filters provided')
    }

    const projects = await query.get()
    console.log(projects.size)
    return projects.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

/**
 * Function used to update all projects or a specific one
 * @param callback callback project updater
 * @param projectId project id (optional)
 */
export const updateProjects = async (
    callback: (project: any) => {},
    projectId: FirebaseId | undefined = undefined
) => {
    let projects: any = []
    if (projectId) {
        projects = [await getProject(projectId)]
    } else {
        projects = await getAllProjects()
    }

    return Promise.all(
        projects.map(async (oldProject: any) => {
            console.log(
                `[update];${oldProject.name};${oldProject.setupType};${oldProject.id}`
            )
            const updatedProject = await callback(oldProject)
            if (!updatedProject) return Promise.resolve()

            return db
                .collection('projects')
                .doc(oldProject.id)
                .update(updatedProject)
        })
    )
}

/**
 * Function used to update all document of a collection with the coresponding update
 */
export const updateDocuments = async (
    collectionReference: CollectionReference,
    callback: (project: any) => {}
) => {
    const collectionSnapshot = await collectionReference.get()
    const collectionData = collectionSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        _path: doc.ref.path,
    }))

    console.log(`${collectionData.length} documents to update`)

    for (const doc of collectionData) {
        console.log(doc._path)

        const updatedDocument = await callback(doc)

        if (updatedDocument.constructor !== Object) {
            console.log('Warning: Data to udpate is not an object')
        }

        if (Object.entries(updatedDocument).length === 0) {
            console.log('Warning: no change will be done on this document')
        }

        if (
            Object.entries(updatedDocument).length > 0 &&
            updatedDocument.constructor === Object
        ) {
            await db.doc(doc._path).update(updatedDocument)
        }

        console.log(doc._path, ' done')
    }

    return Promise.resolve()
}
