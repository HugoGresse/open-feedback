import * as React from 'react'
import { CircularProgress, Typography } from '@mui/material'
import { UseQueryResult } from '../services/hooks/firestoreQueryHook'

export type FirestoreQueryLoaderAndErrorDisplayProps = {
    hookResult: UseQueryResult
}

/**
 * Display a base loading indicator or an error depending on the React Firebase Query hook result
 * @param props
 * @constructor
 */
export const FirestoreQueryLoaderAndErrorDisplay = ({ hookResult }: FirestoreQueryLoaderAndErrorDisplayProps) => {
    if (hookResult.isLoading) {
        return <CircularProgress />
    }

    if (hookResult.isError) {
        return (
            <>
                <Typography variant="body1">
                    <>Error: {String(hookResult.error)}</>
                </Typography>
            </>
        )
    }
    return null
}
