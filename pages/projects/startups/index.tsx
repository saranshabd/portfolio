import React from 'react'
import { Container } from '@material-ui/core'

import styles from './styles.module.scss'

import { BackButton } from 'components/profile/BackButton'
import * as Card from 'components/helpers/card'

interface Props {}

const StartupProjects: React.FC<Props> = () => {
  return (
    <div className={styles['outer-container']}>
      <Container className={styles['inner-container']}>
        <BackButton href='/' />

        <h1>Startups</h1>

        <div className={styles['cards']}>
          <Card.Item>
            <Card.Title>
              Collaborative visualization tool for writers
            </Card.Title>
            <Card.Content>
              This was a collaborative tool for writers to write their stories
              and stuff. We ran a beta test for this project and got amazing
              results.
            </Card.Content>
          </Card.Item>
          <Card.Item>
            <Card.Title>
              Collaborative visualization tool for writers
            </Card.Title>
            <Card.Content>
              This was a collaborative tool for writers to write their stories
              and stuff. We ran a beta test for this project and got amazing
              results.
            </Card.Content>
          </Card.Item>
          <Card.Item>
            <Card.Title>
              Collaborative visualization tool for writers
            </Card.Title>
            <Card.Content>
              This was a collaborative tool for writers to write their stories
              and stuff. We ran a beta test for this project and got amazing
              results.
            </Card.Content>
          </Card.Item>
          <Card.Item>
            <Card.Title>
              Collaborative visualization tool for writers
            </Card.Title>
            <Card.Content>
              This was a collaborative tool for writers to write their stories
              and stuff. We ran a beta test for this project and got amazing
              results.
            </Card.Content>
          </Card.Item>
        </div>
      </Container>

      <style jsx global>
        {`
          body {
            background: #17a589;
            margin: 0;
            padding: 0;
            height: 100%;
          }
        `}
      </style>
    </div>
  )
}

export default StartupProjects
