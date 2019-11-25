import React, { Component } from 'react'
import { withStyles } from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress'
import styled from 'styled-components'

const LoaderMatchParentStyled = styled.div`
    
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    opacity: 0;
    transition: all 1s ease-in;
    animation: 1s appearDelayed;
    animation-delay: 500ms;
    animation-fill-mode: forwards;
        
    @keyframes appearDelayed {
        from {opacity: 0;}
        to {opacity: 1;}
    }
    
    ${props =>
        props.width &&
        `
    width: ${props.width};
    `}
    
    ${props =>
        props.height &&
        `
    height: ${props.height};
    `}
    
    ${props =>
        props.maxWidth &&
        `
    maxWidth: ${props.maxWidth};
    `}
`

const styles = () => ({})

class LoaderMatchParent extends Component {
    render() {
        return (
            <LoaderMatchParentStyled {...this.props}>
                <CircularProgress />
            </LoaderMatchParentStyled>
        )
    }
}

LoaderMatchParent.defaultProps = {
    height: '100vh',
    maxWidth: '100%',
}

export default withStyles(styles)(LoaderMatchParent)
