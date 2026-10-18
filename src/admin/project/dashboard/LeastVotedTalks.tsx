import { useAppSelector } from '../../../store'
import { LoaderMatchParent } from '../../../baseComponents/customComponent/LoaderMatchParent.tsx'
import { getLeastVotedTalkSelector } from './dashboardSelectors'
import { getSelectedProjectIdSelector } from '../core/projectSelectors'
import { useTranslation } from 'react-i18next'
import { TalkVotesList } from './utils/TalkVotesList.tsx'
import ThumbsUpDownIcon from '@mui/icons-material/ThumbsUpDownOutlined'

export interface LeastVotedTalksProps {
    dinoStartDelay?: number
}

export const LeastVotedTalks = ({ dinoStartDelay }: LeastVotedTalksProps) => {
    const talks = useAppSelector(getLeastVotedTalkSelector)
    const projectId = useAppSelector(getSelectedProjectIdSelector)
    const { t } = useTranslation()

    if (!talks) {
        return <LoaderMatchParent />
    }

    return (
        <TalkVotesList
            dataArray={talks}
            countKey="voteCount"
            loading={!talks}
            projectId={projectId}
            dinoStartDelay={dinoStartDelay}
            title={t('dashboard.leastVotedTalks')}
            titleIcon={<ThumbsUpDownIcon />}
        />
    )
}
