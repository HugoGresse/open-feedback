import React from 'react'
import { useSelector } from 'react-redux'
import { getTalksDatesSelector } from '../../core/talks/talksSelectors'
import {
    getProjectIdSelector,
    getProjectSelectedDateSelector,
} from '../project/projectSelectors'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { useTranslation } from 'react-i18next'
import { TALK_NO_DATE } from '../../core/talks/talksUtils'
import { TalkDateMenuItem } from './TalkDateMenuItem'

const useStyles = makeStyles({
    menu: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: 16,
    },
})

const TalksDateMenu = () => {
    const { t } = useTranslation()
    const talksDates = useSelector(getTalksDatesSelector)
    const selectedDate = useSelector(getProjectSelectedDateSelector)
    const currentProjectId = useSelector(getProjectIdSelector)
    const classes = useStyles()

    if (talksDates.length === 1 && talksDates.includes(TALK_NO_DATE)) {
        return ''
    }

    return (
        <div className={classes.menu}>
            {talksDates.map((date) => (
                <TalkDateMenuItem
                    key={date}
                    date={date}
                    url={`/${currentProjectId}/${
                        date === TALK_NO_DATE ? '' : date
                    }`}
                    noDateLabel={t('talks.menuNoDate')}
                    isSelected={selectedDate === date}
                />
            ))}
        </div>
    )
}

export default TalksDateMenu
