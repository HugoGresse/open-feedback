import React from 'react'
import Grid from '@material-ui/core/Grid'
import Container from '@material-ui/core/Container'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { OrganizationHeader } from './OrganizationHeader'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles((theme) => ({
    container: {
        paddingBottom: theme.spacing(2),
    },
}))

const RootContentLayout = ({ isUserValid, children }) => {
    const classes = useStyles()
    const { t } = useTranslation()

    return (
        <Container maxWidth="md" fixed className={classes.container}>
            {!isUserValid && (
                <OrganizationHeader title={t('root.userNotVerified')} />
            )}
            <Grid container spacing={3} component="ul">
                {children}
            </Grid>
        </Container>
    )
}

export default RootContentLayout
