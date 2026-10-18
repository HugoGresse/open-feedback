import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import type { Project } from '../../../../core/models'
import type { ProjectEditData } from '../projectActionTypes'

/**
 * The project fields to keep in the store after an edit: Firestore sentinels
 * such as `deleteField()` are written to the database, the store gets null.
 */
export const projectEditToState = (
    projectEdit: ProjectEditData
): Partial<Project> =>
    Object.fromEntries(
        Object.entries(projectEdit).map(([key, value]) => [
            key,
            value instanceof firebase.firestore.FieldValue ? null : value,
        ])
    )
