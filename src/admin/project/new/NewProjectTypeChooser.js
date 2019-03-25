import React, { Component } from 'react'
import { connect } from 'react-redux'
import PaperButton from '../../../baseComponents/design/PaperButton'
import { Link, Typography } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import {
    PROJECT_TYPE_HOVERBOARDV2,
    PROJECT_TYPE_MANUAL
} from '../core/projectTypes'
import Button from '../../../baseComponents/design/Button'

class NewProjectTypeChooser extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isHoverboardSelected: false,
            isManualSelected: false,
            selected: null
        }
        if (props.selectedSetup) {
            this.state = {
                selected: props.selectedSetup,
                isHoverboardSelected:
                    props.selectedSetup === PROJECT_TYPE_HOVERBOARDV2,
                isManualSelected: props.selectedSetup === PROJECT_TYPE_MANUAL
            }
        }
    }

    onHoverboardSelected() {
        this.setState({
            isHoverboardSelected: !this.state.isHoverboardSelected,
            isManualSelected: false,
            selected: PROJECT_TYPE_HOVERBOARDV2
        })
    }

    onManualSelected() {
        this.setState({
            isHoverboardSelected: false,
            isManualSelected: !this.state.isManualSelected,
            selected: PROJECT_TYPE_MANUAL
        })
    }

    onSubmitClicked() {
        if (this.state.selected) {
            this.props.onSubmit(this.state.selected)
        }
    }

    onCancelClicked() {
        this.props.onCancel(this.state.selected)
    }

    render() {
        const { cancelText, submitText } = this.props
        return (
            <div>
                <Typography variant="h4">
                    Select the setup of the event
                </Typography>
                <Grid container>
                    <Grid item xs={6}>
                        <PaperButton
                            isSelected={this.state.isHoverboardSelected}
                            onClick={() => this.onHoverboardSelected()}
                            content={{
                                title: 'Hoverboard v2',
                                description: 'Description'
                            }}
                        />
                        <Typography>
                            It will get all the talks/speakers/tracks/date from
                            <Link
                                target="_blank"
                                href="https://github.com/gdg-x/hoverboard"
                            >
                                Hoverboard v2
                            </Link>{' '}
                            Firestore and be kept in sync with it.{' '}
                        </Typography>
                    </Grid>

                    <Grid item xs={6}>
                        <PaperButton
                            isSelected={this.state.isManualSelected}
                            onClick={() => this.onManualSelected()}
                            content={{
                                title: 'Manual',
                                description: 'Description'
                            }}
                        />

                        <Typography>
                            In the setup you'll need to enter manually all the
                            talks, speakers, tracks & dates. You can omit
                            speakers, tracks & dates. You'll need to update
                            those information yourself
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        {cancelText && (
                            <Button onClick={() => this.onCancelClicked()}>
                                {cancelText}
                            </Button>
                        )}
                        <Button onClick={() => this.onSubmitClicked()}>
                            {submitText}
                        </Button>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

const mapStateToProps = state => ({})

const mapDispatchToProps = Object.assign({}, {})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NewProjectTypeChooser)
