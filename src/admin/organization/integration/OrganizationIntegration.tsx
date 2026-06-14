import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import LoaderMatchParent from '../../../baseComponents/customComponent/LoaderMatchParent.tsx'
import ApiKeyIntegrationCard, {
    LastUsedValue,
} from '../../baseComponents/ApiKeyIntegrationCard.tsx'
import { getSelectedOrganizationIdSelector } from '../core/organizationSelectors'
import {
    fetchOrganizationIntegration,
    updateOrganizationApiKey,
} from '../core/actions/updateOrganizationApiKey'

export const OrganizationIntegration: React.FC = () => {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const organizationId = useSelector(getSelectedOrganizationIdSelector) as
        | string
        | undefined

    const [loaded, setLoaded] = useState(false)
    const [apiKey, setApiKey] = useState<string | undefined>()
    const [lastUsedRaw, setLastUsedRaw] = useState<LastUsedValue>()

    useEffect(() => {
        if (!organizationId) {
            return
        }
        let cancelled = false
        setLoaded(false)
        fetchOrganizationIntegration(organizationId)
            .then((integration) => {
                if (cancelled) {
                    return
                }
                setApiKey(integration?.apiKey)
                setLastUsedRaw(integration?.apiKeyLastUsedAt as LastUsedValue)
            })
            .finally(() => {
                if (!cancelled) {
                    setLoaded(true)
                }
            })
        return () => {
            cancelled = true
        }
    }, [organizationId])

    if (!organizationId || !loaded) {
        return <LoaderMatchParent />
    }

    const generateOrRotate = async (): Promise<string | void> => {
        const newKey = (await dispatch(
            updateOrganizationApiKey() as never
        )) as unknown as string | void
        if (newKey) {
            setApiKey(newKey)
            setLastUsedRaw(null)
        }
        return newKey
    }

    return (
        <ApiKeyIntegrationCard
            description={t('settingsIntegration.descriptionOrganization')}
            noKeyText={t('settingsIntegration.noKeyOrganization')}
            apiKey={apiKey}
            lastUsedRaw={lastUsedRaw}
            onGenerateOrRotate={generateOrRotate}
        />
    )
}

export default OrganizationIntegration
