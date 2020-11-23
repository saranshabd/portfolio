import React from 'react'
import { Container } from '@material-ui/core'

import * as Card from 'components/helpers/card'
import { BackButton } from 'components/profile/BackButton'
import { PageTitle } from 'components/profile/PageTitle'

import { ExperienceDataType } from 'utils/interfaces'

interface Props {
  backButtonHref: string
  pageTitle: string
  backgroundColorHex: string
  data: ExperienceDataType[]
}

export const ExperienceCard: React.FC<Props> = (props) => (
  <div className='outer-container'>
    <Container className='inner-container'>
      <BackButton href={props.backButtonHref} />

      <PageTitle>{props.pageTitle}</PageTitle>

      <Card.Container>
        {props.data.map((experience) => (
          <Card.Item>
            <Card.Title>{experience.title}</Card.Title>
            <Card.Subtitles>
              {experience.position && (
                <Card.LeftSubtitle>{experience.position}</Card.LeftSubtitle>
              )}
              <Card.RightSubtitle>{experience.date}</Card.RightSubtitle>
            </Card.Subtitles>
            <Card.Content>{experience.description}</Card.Content>
          </Card.Item>
        ))}
      </Card.Container>
    </Container>

    <style jsx global>
      {`
        body {
          background: ${props.backgroundColorHex};
          margin: 0;
          padding: 0;
          height: 100%;
        }
        .outer-container {
          background-color: ${props.backgroundColorHex};
          height: 100%;
          text-align: center;
        }
        .inner-container {
          padding-bottom: 5rem;
        }
      `}
    </style>
  </div>
)
