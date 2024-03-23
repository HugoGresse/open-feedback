import React from 'react'
import ErrorIcon from '@mui/icons-material/Error'
import { Button } from '@mui/material'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'


export const Error = ({ error, errorDetail, classes }) => {
    const reportString = `mailto:hugo.gresse@gmail.com?subject=OpenFeedback%20Error&body=@error:${JSON.stringify(
        error,
    )}@detail:${JSON.stringify(errorDetail)}@url:${JSON.stringify(
        window.location.href,
    )}`

    return (
        <Box maxWidth="100%" textAlign="center" display="flex" alignItems="center" height="100vh" justifyContent="center" flexDirection="column">
            <ErrorIcon />
            <p>
                <b>{error}</b>
            </p>
            <p>Error:</p>
            <Typography sx={{fontFamily: "monospace"}}>{errorDetail}</Typography>
            <Button
                variant="contained"
                color="primary"
            sx={{marginTop: "30px"}}>
                Reload the page
            </Button>
            <Button
                variant="contained"
                className={classes.button}
                href={reportString}>
                Report
            </Button>
        </Box>
    )
}


export default Error
