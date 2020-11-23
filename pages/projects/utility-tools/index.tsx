import React from 'react'

import { ProjectCard } from 'components/profile/projects/ProjectCard'

import { ProjectDataType } from 'utils/interfaces'
import _data from 'static/projects/utility-tools.json'

interface Props {}

const data = _data as ProjectDataType[]

const UtilityToolProjects: React.FC<Props> = () => (
  <ProjectCard
    backButtonHref='/#projects'
    backgroundColorHex='#17a589'
    data={data}
    pageTitle='Utility Tools'
  />
)

export default UtilityToolProjects
