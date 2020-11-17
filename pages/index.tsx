import React from 'react'
import { Container } from '@material-ui/core'

// Components
import { IntroProfile } from 'components/profile/intro'

const Home: React.FC = () => {
  return (
    <div style={{ backgroundColor: '#E74C3C;', height: '100vh' }}>
      <Container
        style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      >
        <IntroProfile />
      </Container>
    </div>
  )
}

export default Home
