import {
    useFirestoreCollection,
    type UseQueryResult,
} from './firestoreQueryHook.ts'
import { fireStoreMainInstance } from '../../firebase.ts'
import type { Project } from '../type.ts'

export type DateRange = {
    name: string
    startDate: Date
    endDate: Date
}

export const useProjects = (
    dateRange: DateRange
): UseQueryResult<Project[]> => {
    const query = fireStoreMainInstance
        .collection('projects')
        .where('createdAt', '>=', dateRange.startDate)
        .where('createdAt', '<=', dateRange.endDate)
        .orderBy('createdAt', 'desc')

    const requestId = `projects-${dateRange.name}`

    return useFirestoreCollection<Project>(query, requestId)
}
