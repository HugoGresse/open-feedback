import type { AppThunk } from '../../../../store'
import { projectApi } from '../../../../core/setupType/projectApi'
import { addNotification } from '../../../notification/notifcationActions'
import { getSelectedProjectSelector } from '../../core/projectSelectors'
import { getSortedVoteItemsSelector } from '../../settings/votingForm/votingFormSelectors'
import { fetchTalkVotes } from '../dashboardActions'
import { buildProjectExport, toExportFileName } from './projectExport'
import { downloadFile } from './downloadFile'
import type { ExportFormat } from './exportFormats'

/**
 * Reads the talks, speakers and votes again rather than reusing the dashboard
 * state: it is loaded once when the dashboard opens, may still hold the
 * previously selected event's talks, and has no flag telling whether the
 * speakers are loaded.
 */
export const exportProject =
    (format: ExportFormat): AppThunk<Promise<void>> =>
    async (dispatch, getState) => {
        const project = getSelectedProjectSelector(getState())
        if (!project) {
            return
        }
        try {
            const [talks, speakers, talkVotes] = await Promise.all([
                projectApi.getTalks(),
                projectApi.getSpeakers(),
                fetchTalkVotes(project.id),
            ])
            const projectExport = buildProjectExport({
                project,
                voteItems: getSortedVoteItemsSelector(getState()),
                talks: Object.values(talks),
                speakers,
                talkVotes,
                exportedAt: new Date(),
            })
            downloadFile(
                toExportFileName(project.name, format.suffix, format.extension),
                format.serialize(projectExport),
                format.type
            )
        } catch (error) {
            dispatch(
                addNotification({
                    type: 'error',
                    i18nkey: 'dashboard.exportError',
                    message: String(error),
                })
            )
        }
    }
