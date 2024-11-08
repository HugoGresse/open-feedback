import { DateRange, useProjects } from './hooks/useProjects.ts'
import { FirestoreQueryLoaderAndErrorDisplay } from './FirestoreQueryLoaderAndErrorDisplay.tsx'
import { getInitialDateRanges } from './utils/getYearsFilters.ts'
import { Box, Button } from '@mui/material'
import React, { useState } from 'react'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useExtraProjectsInfo } from './hooks/useExtraProjectsInfo.ts'
import { Project, ProjectExtraInfo } from './type.ts'

/**
 * Show last projects created with:
 * - user email
 * - organization name
 * - project name
 * - speaker count
 * - vote count
 * - vote date
 *
 * @constructor
 */
export const SuperAdminProjects = () => {
    const [dateRanges] = useState<DateRange[]>(getInitialDateRanges())
    const [selectedDateRange, setSelectedDateRange] = useState<DateRange>(dateRanges[0])
    const projects = useProjects(selectedDateRange)
    const extraInfos = useExtraProjectsInfo(projects.data || [])

    const columns: GridColDef<Project & ProjectExtraInfo>[] = [
        {
            field: 'name',
            headerName: 'Name',
            width: 200,
        },
        {
            field: 'orgName',
            headerName: 'Organization',
            width: 150,
        },
        {
            field: 'dateCreated',
            headerName: 'Date created',
            width: 150,
        },
        {
            field: 'dateVote',
            headerName: 'Date vote',
            width: 150,
        },
        {
            field: 'voteCount',
            headerName: 'Votes',
            type: 'number',
            width: 110,
        },
        {
            field: 'speakerCount',
            headerName: 'Speaker count',
            width: 160,
        },
        {
            field: 'email',
            headerName: 'Email',
            width: 160,
        },
        {
            field: 'link',
            headerName: 'Link',
            width: 160,
        },
    ]

    const rows = (projects.data || []).map((project: Project) => {
        return ({
            id: project.id,
            name: project.name,
            owner: project.owner,
            createdAt: project.createdAt,
            setupType: project.setupType,
            orgName: extraInfos.organizations[project.organizationId || 0],
            dateCreated: extraInfos.projects[project.id]?.dateCreated,
            dateVote: extraInfos.projects[project.id]?.dateVote,
            voteCount: extraInfos.projects[project.id]?.voteCount,
            speakerCount: extraInfos.projects[project.id]?.speakerCount,
            email: extraInfos.users[project.owner]?.email,
            link: extraInfos.projects[project.id]?.link,
        })
    })

    return <Box sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        paddingLeft: 5,
        paddingRight: 5,
        boxSizing: 'content-box',
    }}>
        <FirestoreQueryLoaderAndErrorDisplay hookResult={projects} />

        <Box>
            {dateRanges.map((range) => <Button
                key={range.name}
                onClick={() => setSelectedDateRange(range)}
                variant={selectedDateRange?.name === range.name ? 'contained' : 'outlined'}
            >
                {range.name}</Button>)}
        </Box>

        <Box sx={{ height: "90vh" }}>
            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 100,
                        },
                    },
                }}
                pageSizeOptions={[100]}
                disableRowSelectionOnClick
            />
        </Box>
    </Box>
}
