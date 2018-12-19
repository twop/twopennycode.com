import React from 'react'
import styled from '@emotion/styled'
import { heights, margins } from '../styles/variables'

const profilePic = require('../assets/profile-pic.png')

const ProfilePic = styled.img`
  height: ${heights.profilePic}px;
  width: ${heights.profilePic}px;
  margin-right: ${margins.m};
`

const BioContainer = styled.div`
  display: flex;
  margin-bottom: ${margins.m};
  justify-content: center;
  /* align-items: center; */
`

const Bio = () => (
  <BioContainer>
    <ProfilePic src={profilePic} alt={`Simon Korzunov`} />
    <p style={{ marginTop: margins.xs }}>
      Hi, my name is{' '}
      <strong>
        <a href="https://twitter.com/twopSK">Simon Korzunov</a>
      </strong>
      . I love reading about UI/UX related technologies and functional
      languages.
    </p>
  </BioContainer>
)

export default Bio
