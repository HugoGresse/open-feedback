import { useAppSelector } from '../../../store'
import { LoaderMatchParent } from '../../../baseComponents/customComponent/LoaderMatchParent.tsx'
import { getMostVotedTalkSelector } from './dashboardSelectors'
import { getSelectedProjectIdSelector } from '../core/projectSelectors'
import { useTranslation } from 'react-i18next'
import { TalkVotesList } from './utils/TalkVotesList.tsx'
import ThumbsUpDownIcon from '@mui/icons-material/ThumbsUpDown'

export interface MostVotedTalksProps {
    dinoStartDelay?: number
}

export const MostVotedTalks = ({ dinoStartDelay }: MostVotedTalksProps) => {
    const mostVotedTalks = useAppSelector(getMostVotedTalkSelector)
    const projectId = useAppSelector(getSelectedProjectIdSelector)
    const { t } = useTranslation()

    if (!mostVotedTalks) {
        return <LoaderMatchParent />
    }

    return (
        <TalkVotesList
            dataArray={mostVotedTalks}
            countKey="voteCount"
            loading={!mostVotedTalks}
            projectId={projectId}
            dinoStartDelay={dinoStartDelay}
            title={t('dashboard.mostVoted')}
            titleIcon={<ThumbsUpDownIcon />}
        />
    )
}
