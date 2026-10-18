import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LoaderMatchParent } from '../../../baseComponents/customComponent/LoaderMatchParent.tsx'
import {
    type LastUsedValue,
    ApiKeyIntegrationCard,
} from '../../baseComponents/ApiKeyIntegrationCard.tsx'
import { getSelectedOrganizationIdSelector } from '../core/organizationSelectors'
import {
    fetchOrganizationIntegration,
    updateOrganizationApiKey,
} from '../core/actions/updateOrganizationApiKey'
import { useAppDispatch, useAppSelector } from '../../../store'

export const OrganizationIntegration = () => {
    const { t } = useTranslation()
    const dispatch = useAppDispatch()
    const organizationId = useAppSelector(getSelectedOrganizationIdSelector)

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
                setLastUsedRaw(integration?.apiKeyLastUsedAt)
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
        const newKey = await dispatch(updateOrganizationApiKey())
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
