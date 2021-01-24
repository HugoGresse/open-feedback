import React from 'react'
import { useSelector } from 'react-redux'
import LoaderMatchParent from '../../../baseComponents/customComponent/LoaderMatchParent'
import { getMostCommentedTalkSelector } from './dashboardSelectors'
import { getSelectedProjectIdSelector } from '../core/projectSelectors'
import { useTranslation } from 'react-i18next'
import TalkVotesList from './utils/TalkVotesList'
import ThumbsUpDownIcon from '@material-ui/icons/ThumbsUpDownOutlined'

const MostCommentedTalks = ({ dinoStartDelay }) => {
    const talk = useSelector(getMostCommentedTalkSelector)
    const projectId = useSelector(getSelectedProjectIdSelector)
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

export default MostCommentedTalks
