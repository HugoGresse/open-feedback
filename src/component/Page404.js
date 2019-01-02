import React, { Component } from 'react'
import { withStyles } from '@material-ui/core'

const styles = theme => ({})

class Page404 extends Component {
  render() {
    return (
      <div>
        404 ¯\_(ツ)_/¯
      </div>
    )
  }
}

export default withStyles(styles)(Page404)
