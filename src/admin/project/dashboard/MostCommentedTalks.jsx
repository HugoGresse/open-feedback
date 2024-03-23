import React from 'react'
import { useSelector } from 'react-redux'
import LoaderMatchParent from '../../../baseComponents/customComponent/LoaderMatchParent.jsx'
import { getMostCommentedTalkSelector } from './dashboardSelectors'
import { getSelectedProjectIdSelector } from '../core/projectSelectors'
import { useTranslation } from 'react-i18next'
import TalkVotesList from './utils/TalkVotesList.jsx'
import ThumbsUpDownIcon from '@mui/icons-material/ThumbsUpDownOutlined'

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
