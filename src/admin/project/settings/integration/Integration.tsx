import { useEffect, useState, type FC } from 'react'
import { useAppDispatch, useAppSelector } from '../../../../store'
import { useTranslation } from 'react-i18next'
import { LoaderMatchParent } from '../../../../baseComponents/customComponent/LoaderMatchParent.tsx'
import {
    API_DOCS_URL,
    type LastUsedValue,
    ApiKeyIntegrationCard,
} from '../../../baseComponents/ApiKeyIntegrationCard.tsx'
import { getSelectedProjectSelector } from '../../core/projectSelectors'
import {
    fetchProjectIntegration,
    updateProjectApiKey,
} from '../../core/actions/updateProjectApiKey'

// Re-exported for callers that imported the docs URL from here historically.
export { API_DOCS_URL }

export const Integration: FC = () => {
    const { t } = useTranslation()
    const dispatch = useAppDispatch()
    const project = useAppSelector(getSelectedProjectSelector)
    const projectId = project?.id

    const [loaded, setLoaded] = useState(false)
    const [apiKey, setApiKey] = useState<string | undefined>()
    const [lastUsedRaw, setLastUsedRaw] = useState<LastUsedValue>()

    useEffect(() => {
        if (!projectId) {
            return
        }
        let cancelled = false
        setLoaded(false)
        fetchProjectIntegration(projectId)
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
    }, [projectId])

    if (!project || !loaded) {
        return <LoaderMatchParent />
    }

    const generateOrRotate = async (): Promise<string | void> => {
        const newKey = await dispatch(updateProjectApiKey())
        if (newKey) {
            setApiKey(newKey)
            setLastUsedRaw(null)
        }
        return newKey
    }

    return (
        <ApiKeyIntegrationCard
            description={t('settingsIntegration.description')}
            noKeyText={t('settingsIntegration.noKey')}
            apiKey={apiKey}
            lastUsedRaw={lastUsedRaw}
            onGenerateOrRotate={generateOrRotate}
        />
    )
}
