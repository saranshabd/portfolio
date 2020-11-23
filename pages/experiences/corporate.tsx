import React from 'react'

import { ExperienceCard } from 'components/profile/experiences/ExperienceCard'

import _data from 'static/experiences/corporate.json'
import { ExperienceDataType } from 'utils/interfaces'

interface Props {}

const data = _data as ExperienceDataType[]

const CorporateExperiences: React.FC<Props> = () => (
  <ExperienceCard
    backButtonHref='/#experiences'
    pageTitle='Corporate'
    backgroundColorHex='#76448a'
    data={data}
  />
)

export default CorporateExperiences
