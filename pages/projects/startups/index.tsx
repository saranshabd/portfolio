import React from 'react'
import { Container } from '@material-ui/core'

import styles from './styles.module.scss'

import * as Card from 'components/helpers/card'
import { PageTitle } from 'components/profile/PageTitle'
import { BackButton } from 'components/profile/BackButton'

interface Props {}

const StartupProjects: React.FC<Props> = () => {
  return (
    <div className={styles['outer-container']}>
      <Container className={styles['inner-container']}>
        <BackButton href='/' />

        <PageTitle>Startups</PageTitle>

        <Card.Container>
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
        </Card.Container>
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
