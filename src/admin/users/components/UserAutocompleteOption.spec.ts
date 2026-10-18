import { describe, expect, test, vi } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { renderUserAutoCompleteOption } from './UserAutocompleteOption.tsx'

const user = {
    displayName: 'Ada Lovelace',
    email: 'ada@example.com',
    photoURL: null,
}

describe('renderUserAutoCompleteOption', () => {
    test('renders the user in the clickable option <li> MUI provides', () => {
        const onClick = vi.fn()
        const element = renderUserAutoCompleteOption(
            { key: 'k1', id: 'email-option-0', onClick },
            user
        )

        expect(element.type).toBe('li')
        expect(element.key).toBe('k1')
        expect(element.props.onClick).toBe(onClick)
        expect(element.props.id).toBe('email-option-0')

        const html = renderToStaticMarkup(element)
        expect(html).toContain('Ada Lovelace')
        expect(html).toContain('ada@example.com')
    })

    test('renders a free text option', () => {
        const element = renderUserAutoCompleteOption({}, 'bob@example.com')

        expect(element.type).toBe('li')
        expect(renderToStaticMarkup(element)).toBe('<li>bob@example.com</li>')
    })
})
