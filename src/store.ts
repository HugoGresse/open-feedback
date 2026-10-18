import { useDispatch, useSelector } from 'react-redux'
import { createSelector } from 'reselect'
import type { ThunkAction, ThunkDispatch } from 'redux-thunk'
import type { rootReducer } from './rootReducer'

export type RootState = ReturnType<typeof rootReducer>
export type RootAction = Parameters<typeof rootReducer>[1]
export type AppDispatch = ThunkDispatch<RootState, unknown, RootAction>
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    RootAction
>

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
export const createAppSelector = createSelector.withTypes<RootState>()
