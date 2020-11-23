import React from 'react'
import { Container } from '@material-ui/core'

import * as Card from 'components/helpers/card'
import { BackButton } from 'components/profile/BackButton'
import { PageTitle } from 'components/profile/PageTitle'

import _data from 'static/articles/index.json'
import { ArticleDataType } from 'utils/interfaces'

import styles from './styles.module.scss'

const data = _data as ArticleDataType[]

const Articles: React.FC = () => {
  return (
    <div className={styles['outer-container']}>
      <Container className={styles['inner-container']}>
        <BackButton href='/#experiences' />

        <PageTitle>Articles</PageTitle>

        <Card.Container>
          {data.map((article) => (
            <a
              href={`/experiences/articles/${article.code}`}
              className={styles['card-link']}
            >
              <Card.Item style={{ margin: '1rem 0rem' }}>
                <Card.Title>{article.title}</Card.Title>
                <Card.Subtitles>
                  <Card.LeftSubtitle>{article.series}</Card.LeftSubtitle>
                  <Card.RightSubtitle>{article.date}</Card.RightSubtitle>
                </Card.Subtitles>
                <Card.Content>{article.description}</Card.Content>
              </Card.Item>
            </a>
          ))}
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
