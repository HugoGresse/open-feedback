import React from 'react'
import { useSelector } from 'react-redux'
import LoaderMatchParent from '../../../baseComponents/customComponent/LoaderMatchParent'
import { getLeastVotedTalkSelector } from './dashboardSelectors'
import { getSelectedProjectIdSelector } from '../core/projectSelectors'
import { useTranslation } from 'react-i18next'
import TalkVotesList from './utils/TalkVotesList'
import ThumbsUpDownIcon from '@material-ui/icons/ThumbsUpDownOutlined'

const MostVotedTalks = ({ dinoStartDelay }) => {
    const mostVotedTalks = useSelector(getLeastVotedTalkSelector)
    const projectId = useSelector(getSelectedProjectIdSelector)
    const { t } = useTranslation()

    if (!mostVotedTalks) {
        return <LoaderMatchParent />
    }

    return (
        <TalkVotesList
            dataArray={mostVotedTalks}
            loading={!mostVotedTalks}
            projectId={projectId}
            dinoStartDelay={dinoStartDelay}
            title={t('dashboard.leastVotedTalks')}
            titleIcon={<ThumbsUpDownIcon />}
        />
    )
}

export default MostVotedTalks
