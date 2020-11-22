import React from 'react'
import { Container } from '@material-ui/core'

import * as Card from 'components/helpers/card'
import { BackButton } from 'components/profile/BackButton'
import { PageTitle } from 'components/profile/PageTitle'

import styles from './styles.module.scss'

const Articles: React.FC = () => {
  return (
    <div className={styles['outer-container']}>
      <Container className={styles['inner-container']}>
        <BackButton href='/#experiences' />
        <PageTitle>Articles</PageTitle>
        <Card.Container>
          <a
            href='/experiences/articles/how-docker-can-help-you-sleep-well-at-night-507f1f77bcf86cd799439011'
            className={styles['card-link']}
          >
            <Card.Item>
              <Card.Title>
                How Docker can help you sleep well at night?
              </Card.Title>
              <Card.Subtitles>
                <Card.LeftSubtitle>DevOps with Docker</Card.LeftSubtitle>
                <Card.RightSubtitle>Oct. 27, 2020</Card.RightSubtitle>
              </Card.Subtitles>
              <Card.Content>
                Hello everyone, hope you're coding well. I was very surprised to
                realize that a lot of junior developers, college students and
                freelancers were not using Docker and some of them were not even
                interested to learn it...
              </Card.Content>
            </Card.Item>
          </a>
        </Card.Container>
      </Container>

      <style jsx global>
        {`
          body {
            background: #76448a;
            margin: 0;
            padding: 0;
            height: 100%;
          }
        `}
      </style>
    </div>
  )
}

export default Articles
