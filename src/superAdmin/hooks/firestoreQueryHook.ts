import { useCallback, useEffect, useState } from 'react'
import firebase from 'firebase/compat/app'
import Query = firebase.firestore.Query
import QuerySnapshot = firebase.firestore.QuerySnapshot
import DocumentSnapshot = firebase.firestore.DocumentSnapshot
import DocumentReference = firebase.firestore.DocumentReference
import DocumentData = firebase.firestore.DocumentData

export type UseQueryResult<T = unknown> = {
    isLoading: boolean
    load: () => void
    error: string
    isError: boolean
    data: T | null
    loaded: boolean
}

export const useFirestoreCollection = <T>(
    query: Query<T>,
    requestId: string
): UseQueryResult<T[]> => {
    const [isLoading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [data, setData] = useState<T[]>()

    const isError = error !== ''

    const docTransformer = (querySnapshot: QuerySnapshot<DocumentData>) => {
        setData(
            querySnapshot.docs.map((doc: DocumentData) => ({
                id: doc.id,
                ...(doc.data() as T),
            }))
        )
    }

    const load = useCallback(() => {
        setData([])
        setLoading(true)

        try {
            query
                .get()
                .then((querySnapshot) => {
                    docTransformer(querySnapshot as QuerySnapshot<DocumentData>)
                })
                .catch((error) => {
                    setLoading(false)
                    setError(error.message)
                })
                .finally(() => {
                    setLoading(false)
                })
        } catch (error: unknown | { message: string }) {
            setError(error instanceof Error ? error.message : `${error}`)
        }
    }, [requestId])

    useEffect(() => {
        return load()
    }, [load])

    return {
        isLoading,
        load,
        error,
        isError,
        data: data || null,
        loaded: data !== undefined,
    }
}

export const useFirestoreDocument = <T>(
    ref: DocumentReference<T extends DocumentData ? T : DocumentData>
): UseQueryResult<T> => {
    const [isLoading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [data, setData] = useState<T>()

    const isError = error !== ''

    const docTransformer = (querySnapshot: DocumentSnapshot<DocumentData>) => {
        const d = querySnapshot.data()

        if (d === undefined) {
            return
        }

        setData({
            id: querySnapshot.id,
            ...(d as T),
        })
    }

    const load = useCallback(() => {
        setLoading(true)

        try {
            ref.get()
                .then((docSnapshot) => {
                    docTransformer(docSnapshot)
                })
                .catch((error) => {
                    setError(error.message)
                })
                .finally(() => {
                    setLoading(false)
                })
        } catch (error: unknown | { message: string }) {
            setError(error instanceof Error ? error.message : `${error}`)
        }
    }, [ref.path])

    useEffect(() => {
        return load()
    }, [ref.path])

    return {
        isLoading,
        load,
        error,
        isError,
        data: data || null,
        loaded: data !== undefined,
    }
}
