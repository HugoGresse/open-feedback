import React, { Component } from "react";
import { connect } from "react-redux";
import { getSessionsGroupByDate, sessionActions } from "./core";
import SessionItem from "./SessionItem";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core";

const styles = theme => ({
  layout: {
    width: "auto",
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(900 + theme.spacing.unit * 3 * 2)]: {
      width: 900,
      marginLeft: "auto",
      marginRight: "auto"
    }
  }
});

class SessionList extends Component {
  componentDidMount() {
    this.props.getSessions();
  }

  render() {
    const { sessionsByDate, classes } = this.props;
    if (!sessionsByDate) return "Data loading";

    return sessionsByDate.map((current, key) => (
      <Grid container spacing={24} className={classes.layout} key={key}>
        <Grid item xs>
          {current.date}
        </Grid>

        {current.sessions.map((session, key) => (
          <SessionItem key={key} session={session} />
        ))}
      </Grid>
    ));
  }
}

const mapStateToProps = state => ({
  sessionsByDate: getSessionsGroupByDate(state)
});

const mapDispatchToProps = Object.assign({}, sessionActions);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(SessionList));
