import React from 'react'

import { ProjectCard } from 'components/profile/projects/ProjectCard'

import { ProjectDataType } from 'utils/interfaces'
import _data from 'static/projects/bots-and-data-science.json'

interface Props {}

const data = _data as ProjectDataType[]

const BotsAndDataScienceProjects: React.FC<Props> = () => (
  <ProjectCard
    backButtonHref='/#projects'
    backgroundColorHex='#17a589'
    data={data}
    pageTitle='Bots & Data Science'
  />
)

export default BotsAndDataScienceProjects
