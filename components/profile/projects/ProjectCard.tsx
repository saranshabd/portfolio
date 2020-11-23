import React from 'react'
import { Container } from '@material-ui/core'

import * as Card from 'components/helpers/card'
import { BackButton } from 'components/profile/BackButton'
import { PageTitle } from 'components/profile/PageTitle'

import { ProjectDataType } from 'utils/interfaces'

interface Props {
  backButtonHref: string
  pageTitle: string
  backgroundColorHex: string
  data: ProjectDataType[]
}

export const ProjectCard: React.FC<Props> = (props) => {
  return (
    <div className='outer-container'>
      <Container className='inner-container'>
        <BackButton href={props.backButtonHref} />

        <PageTitle>{props.pageTitle}</PageTitle>

        <Card.Container>
          {props.data.map((project) => (
            <Card.Item>
              <Card.Title>{project.title}</Card.Title>
              <Card.Content>{project.description}</Card.Content>
              <Card.Icons hrefs={project.techStackIconUrls} />
              {project.sourceCodeUrl && (
                <Card.ActionContainer>
                  <Card.ActionButton
                    href={project.sourceCodeUrl}
                    color={props.backgroundColorHex}
                  >
                    Source code
                  </Card.ActionButton>
                </Card.ActionContainer>
              )}
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
}
