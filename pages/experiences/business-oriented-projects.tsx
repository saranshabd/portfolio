import React from 'react'

import { ExperienceCard } from 'components/profile/experiences/ExperienceCard'

import _data from 'static/experiences/business-oriented-projects.json'
import { ExperienceDataType } from 'utils/interfaces'

interface Props {}

const data = _data as ExperienceDataType[]

const BusinessOrientedProjectExperiences: React.FC<Props> = () => (
  <ExperienceCard
    backButtonHref='/#experiences'
    pageTitle='Business-oriented projects'
    backgroundColorHex='#76448a'
    data={data}
  />
)

export default BusinessOrientedProjectExperiences
