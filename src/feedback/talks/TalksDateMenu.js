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
import { TalkDateMenuItem, TalkDateMenuItemBlank } from './TalkDateMenuItem'
import { usePagination } from '@material-ui/lab'

const useStyles = makeStyles({
    menu: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 16,
    },
})

const TalksDateMenu = () => {
    const { t } = useTranslation()
    const talksDates = useSelector(getTalksDatesSelector)
    const selectedDate = useSelector(getProjectSelectedDateSelector)
    const currentProjectId = useSelector(getProjectIdSelector)
    const { items } = usePagination({
        count: talksDates.length,
        page: talksDates.indexOf(selectedDate) + 1,
        boundaryCount: 2,
        hideNextButton: true,
        hidePrevButton: true,
    })
    const classes = useStyles()

    if (talksDates.length === 1 && talksDates.includes(TALK_NO_DATE)) {
        return ''
    }

    return (
        <>
            <ul className={classes.menu}>
                {items.map(({ page, type, selected }, index) => {
                    let children = null
                    const pageFixed = page - 1

                    if (type === 'start-ellipsis' || type === 'end-ellipsis') {
                        children = (
                            <TalkDateMenuItemBlank key="..." isSelected={false}>
                                …
                            </TalkDateMenuItemBlank>
                        )
                    } else if (type === 'page') {
                        const date = talksDates[pageFixed]
                        children = (
                            <TalkDateMenuItem
                                key={date}
                                date={date}
                                url={`/${currentProjectId}/${
                                    date === TALK_NO_DATE ? '' : date
                                }`}
                                noDateLabel={t('talks.menuNoDate')}
                                isSelected={selected}
                            />
                        )
                    }

                    return <li key={index}>{children}</li>
                })}
            </ul>
        </>
    )
}

export default TalksDateMenu
