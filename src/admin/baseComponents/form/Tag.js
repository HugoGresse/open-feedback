import styled from 'styled-components'
import CloseIcon from '@material-ui/icons/Close'
import COLORS from '../../../constants/colors'
import React from 'react'

const Tag = styled(({ label, onDelete, ...props }) => (
    <div {...props}>
        <span>{label}</span>
        <CloseIcon onClick={onDelete} />
    </div>
))`
  display: flex;
  align-items: center;
  height: 24px;
  margin: 4px 4px 4px 0 !important;
  line-height: 22px;
  background-color: #fafafa;
  border: 1px solid #e8e8e8;
  border-radius: 2px;
  box-sizing: content-box;
  padding: 4px 8px 4px 14px;
  outline: 0;
  overflow: hidden;
  ${props => (props.disabled ? `color: #999;` : ``)}

  &:focus {
    border-color: #40a9ff;
    background-color: #e6f7ff;
  }

  & span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  & svg {
    font-size: 12px;
    cursor: pointer;
    margin-left: 4px
    padding: 4px;
    &:hover {
      background: ${COLORS.LIGHT_RED_ORANGE};
    }
`
export default Tag
