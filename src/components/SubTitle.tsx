import * as React from 'react'
import styled from '@emotion/styled'

const Small = styled.small``

export const SubTitle: React.SFC<{ txt: string }> = ({ txt }) => (
  <Small>{txt}</Small>
  // tslint:disable-next-line:prettier
)
