import type { VoteItem } from '../../../../core/models'

/**
 * We need to cleanup vote items when an additional language has been added, used and then removed from an event.
 *
 * @param languages project languages
 * @param voteItems vote items of a project
 */
export const fixVoteItemLanguages = (
    languages: string[] | undefined,
    voteItems: VoteItem[]
): { voteItems?: VoteItem[] } => {
    if (!languages || !voteItems || voteItems.length === 0) {
        return {}
    }

    const voteItemsLangs = [
        ...new Set(
            voteItems.reduce<string[]>((acc, item) => {
                if (item.languages) {
                    return acc.concat(Object.keys(item.languages))
                }
                return acc
            }, [])
        ),
    ]
    const undesiredLangs = voteItemsLangs.filter(
        (lang) => !languages.includes(lang)
    )

    return {
        voteItems: voteItems.map((item) => {
            if (!item.languages) {
                return item
            }
            // Copy the translations: the vote items come from the store
            const translations = { ...item.languages }
            undesiredLangs.forEach((undesiredLang) => {
                delete translations[undesiredLang]
            })
            return { ...item, languages: translations }
        }),
    }
}
