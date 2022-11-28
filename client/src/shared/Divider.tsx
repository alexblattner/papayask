import React from 'react'
import styled from 'styled-components'

const StyledDivider = styled('div')<Props>`
    width: ${(props) => props.orientation === 'vertical' ? '1px' : '100%'};
    height: ${(props) => props.orientation === 'vertical' ? '100%' : '1px'};
    background-color: ${(props) => props.theme.colors.secondary_D2};
`

interface Props {
    orientation?: 'horizontal' | 'vertical'
}

const Divider = (props: Props) => {
  return (
    <StyledDivider {...props}></StyledDivider>
  )
}

export default Divider