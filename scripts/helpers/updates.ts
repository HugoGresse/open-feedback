/* eslint-disable no-console */
// initialize firestore database
import * as admin from 'firebase-admin'

export const db = admin.firestore()

type FirebaseId = string

export const getProject = async (id: FirebaseId) => {
  const doc = await db
    .collection('projects')
    .doc(id)
    .get()
  return { id: doc.id, ...doc.data() }
}

export const getAllProjects = async () => {
  const projects = await db.collection('projects').get()
  return projects.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

/**
 * Function used to update all projects or a specific one
 * @param callback callback project updater
 * @param projectId project id (optional)
 */
export const updateProjects = async (callback: (project: any) => {}, projectId: FirebaseId | undefined = undefined) => {
  let projects: any = []
  if (projectId) {
    projects = [await getProject(projectId)]
  } else {
    projects = await getAllProjects()
  }

  return Promise.all(
    projects.map(async (oldProject: any) => {
      console.log(`[update];${oldProject.name};${oldProject.setupType};${oldProject.id}`)
      const updatedProject = await callback(oldProject)
      if (!updatedProject) return Promise.resolve()

      return db
        .collection('projects')
        .doc(oldProject.id)
        .update(updatedProject)
    }),
  )
}
