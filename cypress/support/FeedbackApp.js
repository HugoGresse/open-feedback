import { VOTE_ITEM_TYPES } from './AdminApp'

export class FeedbackApp {
    openTalk(name) {
        cy.contains(name).click()
    }

    assertVoteItem(position, name, type) {
        cy.get('div[data-testid=VoteItem]')
            .eq(position)
            .within(() => {
                switch (type) {
                    case VOTE_ITEM_TYPES.text:
                        cy.contains('h6', name)
                        break
                    case VOTE_ITEM_TYPES.chip:
                        cy.contains('span', name)
                        break
                    default:
                        throw new Error(
                            `${type} not managed in Cypress assertVoteItem`
                        )
                }
            })
    }
}
