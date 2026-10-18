import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import { makeStyles } from '@mui/styles'
import { OrganizationHeader } from './OrganizationHeader.tsx'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles((theme) => ({
    container: {
        paddingBottom: theme.spacing(2),
    },
}))

export const RootContentLayout = ({ isUserValid, children }) => {
    const classes = useStyles()
    const { t } = useTranslation()

    return (
        <Container maxWidth="md" fixed className={classes.container}>
            <Grid container spacing={3} component="ul">
                {!isUserValid && (
                    <OrganizationHeader title={t('root.userNotVerified')} />
                )}
                {children}
            </Grid>
        </Container>
    )
}
