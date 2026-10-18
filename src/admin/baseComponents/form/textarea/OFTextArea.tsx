import {
    Component,
    type HTMLAttributes,
    type ReactNode,
    type TextareaHTMLAttributes,
} from 'react'
import styled from 'styled-components'
import {
    fontSize,
    fontWeight,
    height,
    space,
    width,
    type HeightProps,
    type WidthProps,
} from 'styled-system'
import { COLORS } from '../../../../constants/colors'

const OFTextAreaWrapper = styled.div<WidthProps & HeightProps>`
    ${width}
    ${height}

    position: relative;
`

const IconWrapper = styled.div`
    position: absolute;
    top: 17px;
    left: 10px;
`

const OFTextAreaStyled = styled.textarea<{ icon?: ReactNode }>`
    height: 100%;
    font-size: 16px;
    border: 1px solid #eee;
    width: 100%;
    background: none;
    box-sizing: border-box;
    ${(props) => (props.icon ? ` padding-left: 40px;` : ` padding-left: 12px;`)}
    ${fontSize}
    ${fontWeight}
    ${space}
    color:${COLORS.DARK_GRAY};

    &::placeholder {
        color: ${COLORS.LIGHT_GRAY};
    }
    &:focus {
        outline-width: 0;
    }
`

export interface OFTextAreaProps
    extends
        TextareaHTMLAttributes<HTMLTextAreaElement>,
        WidthProps,
        HeightProps {
    icon?: ReactNode
}

export class OFTextArea extends Component<OFTextAreaProps> {
    override render() {
        const { icon, ...props } = this.props

        return (
            // The wrapper div receives the same props as the textarea (pre-existing
            // behaviour); only the styled-system width/height matter for it.
            <OFTextAreaWrapper {...(props as HTMLAttributes<HTMLDivElement>)}>
                {icon && <IconWrapper>{icon}</IconWrapper>}
                <OFTextAreaStyled icon={icon} {...props} />
            </OFTextAreaWrapper>
        )
    }
}
