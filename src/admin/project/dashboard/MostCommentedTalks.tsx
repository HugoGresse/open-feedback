import { useAppSelector } from '../../../store'
import { LoaderMatchParent } from '../../../baseComponents/customComponent/LoaderMatchParent.tsx'
import { getMostCommentedTalkSelector } from './dashboardSelectors'
import { getSelectedProjectIdSelector } from '../core/projectSelectors'
import { useTranslation } from 'react-i18next'
import { TalkVotesList } from './utils/TalkVotesList.tsx'
import ThumbsUpDownIcon from '@mui/icons-material/ThumbsUpDownOutlined'

export interface MostCommentedTalksProps {
    dinoStartDelay?: number
}

export const MostCommentedTalks = ({
    dinoStartDelay,
}: MostCommentedTalksProps) => {
    const talk = useAppSelector(getMostCommentedTalkSelector)
    const projectId = useAppSelector(getSelectedProjectIdSelector)
    const { t } = useTranslation()

    if (!talk) {
        return <LoaderMatchParent />
    }

    return (
        <TalkVotesList
            dataArray={talk}
            countKey="commentCount"
            loading={!talk}
            projectId={projectId}
            dinoStartDelay={dinoStartDelay}
            title={t('dashboard.mostCommented')}
            titleIcon={<ThumbsUpDownIcon />}
        />
    )
}
