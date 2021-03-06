import React from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import makeStyles from '@material-ui/core/styles/makeStyles'
import COLORS from '../../constants/colors'
import OFButton from '../baseComponents/button/OFButton'
import { useTranslation } from 'react-i18next'
import { Box } from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import { Link } from 'react-router-dom'
import { ROUTE_ADMIN, ROUTE_ORGANIZATION_SEGMENT } from '../RoutingMap'

const useStyles = makeStyles((theme) => ({
    container: {
        marginTop: (props) => (props.isOrganization ? 36 : 100),
        marginBottom: (props) => (props.isOrganization ? 0 : 20),
    },
    title: {
        color: (props) =>
            props.isOrganization ? theme.palette.secondary.main : COLORS.WHITE,
    },
}))

export const OrganizationHeader = ({
    title,
    isOrganization,
    organizationId,
}) => {
    const { t } = useTranslation()

    const classes = useStyles({
        isOrganization,
    })

    return (
        <>
            <Grid item xs={12} className={classes.container} component="li">
                <Grid container>
                    <Grid item xs={12} md={isOrganization ? 8 : 12}>
                        <Typography
                            className={classes.title}
                            variant="h2"
                            component="h1">
                            {title}
                        </Typography>
                    </Grid>
                    {isOrganization && (
                        <Grid
                            item
                            xs={12}
                            md={4}
                            component={Box}
                            display="flex"
                            alignSelf="center"
                            justifyContent="flex-end">
                            <Link
                                to={`${ROUTE_ADMIN}${ROUTE_ORGANIZATION_SEGMENT}/${organizationId}`}
                                title={`${t('organization.edit')} ${title}`}>
                                <OFButton
                                    color="secondary"
                                    startIcon={<EditIcon />}>
                                    {t('organization.edit')}
                                </OFButton>
                            </Link>
                        </Grid>
                    )}
                </Grid>
            </Grid>
        </>
    )
}
