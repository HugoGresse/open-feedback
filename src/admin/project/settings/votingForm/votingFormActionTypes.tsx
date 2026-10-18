import type { VoteItem } from '../../../../core/models'

export const GET_VOTEITEMS_SUCCESS = 'admin/voteItems/get/success'
export const EDIT_VOTEITEM = 'admin/voteItems/edit'
export const REORDER_VOTEITEMS = 'admin/voteItems/reorder'
export const DELETE_VOTEITEM = 'admin/voteItems/delete'
export const DELETE_ALL_VOTEITEMS = 'admin/voteItems/deleteAll'
export const ADD_VOTEITEM = 'admin/voteItems/add'
export const SAVE_VOTEITEMS_ONGOING = 'admin/voteItems/save/ongoing'
export const SAVE_VOTEITEMS_SUCCESS = 'admin/voteItems/save/success'
export const SAVE_VOTEITEMS_ERROR = 'admin/voteItems/save/error'
export const SAVE_VOTEITEM_CONFIRM = 'admin/voteItems/save/confirm'

export type SaveVoteItemsSuccessAction = {
    type: typeof SAVE_VOTEITEMS_SUCCESS
    payload: VoteItem[]
}

export type VotingFormAction =
    | { type: typeof GET_VOTEITEMS_SUCCESS; payload: VoteItem[] | undefined }
    | { type: typeof EDIT_VOTEITEM; payload: VoteItem }
    | {
          type: typeof REORDER_VOTEITEMS
          payload: { activeId: string; overId: string }
      }
    | { type: typeof DELETE_VOTEITEM; payload: VoteItem }
    | { type: typeof DELETE_ALL_VOTEITEMS }
    | { type: typeof ADD_VOTEITEM; payload: VoteItem }
    | { type: typeof SAVE_VOTEITEMS_ONGOING }
    | SaveVoteItemsSuccessAction
    | { type: typeof SAVE_VOTEITEMS_ERROR; payload: unknown }
    | { type: typeof SAVE_VOTEITEM_CONFIRM }
