import React from 'react'

import { ProjectCard } from 'components/profile/projects/ProjectCard'

import { ProjectDataType } from 'utils/interfaces'
import _data from 'static/projects/web-development.json'

interface Props {}

const data = _data as ProjectDataType[]

const WebDevelopmentProjects: React.FC<Props> = () => (
  <ProjectCard
    backButtonHref='/#projects'
    backgroundColorHex='#17a589'
    data={data}
    pageTitle='Web Development'
  />
)

export default WebDevelopmentProjects
