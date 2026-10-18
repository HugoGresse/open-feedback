import type { RootState } from '../store'

export const getAdminStateSelector = (state: RootState) => state.admin
