import { describe, expect, it } from 'vitest'
import { InvitationType } from '../../types/InvitationType'
import { getInviteTarget } from './getInviteTarget'

describe('getInviteTarget', () => {
    it('returns a project target', () => {
        expect(getInviteTarget({ projectId: 'p1' })).toEqual({
            type: InvitationType.ProjectInvitationType,
            id: 'p1',
        })
    })

    it.each(['Viewer', 'Editor', 'Admin'])(
        'returns an organization target for %s',
        (role) => {
            expect(getInviteTarget({ organizationId: 'o1', role })).toEqual({
                type: InvitationType.OrganizationInvitationType,
                id: 'o1',
                role,
            })
        }
    )

    it.each([
        ['no target', {}],
        [
            'both targets',
            { projectId: 'p1', organizationId: 'o1', role: 'Admin' },
        ],
        ['an Owner role', { organizationId: 'o1', role: 'Owner' }],
        ['no role', { organizationId: 'o1' }],
        ['a non-string id', { projectId: ['p1'] }],
        ['a non-string organization id', { organizationId: 1, role: 'Admin' }],
    ])('rejects an invite with %s', (_, data) => {
        expect(getInviteTarget(data)).toBeNull()
    })
})
