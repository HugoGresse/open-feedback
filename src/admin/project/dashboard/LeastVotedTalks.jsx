import React from 'react'
import { useSelector } from 'react-redux'
import LoaderMatchParent from '../../../baseComponents/customComponent/LoaderMatchParent.tsx'
import { getLeastVotedTalkSelector } from './dashboardSelectors'
import { getSelectedProjectIdSelector } from '../core/projectSelectors'
import { useTranslation } from 'react-i18next'
import TalkVotesList from './utils/TalkVotesList.jsx'
import ThumbsUpDownIcon from '@mui/icons-material/ThumbsUpDownOutlined'

const LeastVotedTalks = ({ dinoStartDelay }) => {
    const talks = useSelector(getLeastVotedTalkSelector)
    const projectId = useSelector(getSelectedProjectIdSelector)
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

export default LeastVotedTalks
