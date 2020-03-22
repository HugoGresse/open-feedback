/**
 * VoteItems (voting form) position field is not always present. This was fine before as "text" item was always the last
 * item (filtered on the front) but due to free choice of the type, position should be the only source of position.
 * This migrate all voteItems , add a position if missing and set position "text" vote item to the last item.
 * Migrate from v0.19.0 to v0.20.0
 **/

import './helpers/initFirestore'
import { updateProjects } from './helpers/updates'

interface VoteItem {
    position: number
    id: string
    name: string
    type: 'text' | 'boolean'
}

const main = async () => {
    await updateProjects(async project => {
        if (!project.voteItems || project.voteItems.length === 0) {
            return null
        }

        // Two pass: first to add missing position, second to change "text" position of the end
        return {
            voteItems: project.voteItems
                .sort((a: VoteItem, b: VoteItem) => {
                    if (a.type === 'boolean' && b.type === 'text') {
                        return -1
                    }
                    if (b.type === 'boolean' && a.type === 'text') {
                        return 1
                    }

                    return a.position > b.position ? 1 : -1
                })
                .map((item: any, index: number) => {
                    return {
                        ...item,
                        position: index,
                    }
                }),
        }
    })
}

main()
