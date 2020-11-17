import React from 'react'

interface SectionProps {
  className: string
  component: React.ComponentType
}

export const ReactFullPageSection: React.FC<SectionProps> = (props) => {
  return (
    <div className={`section ${props.className}`}>{<props.component />}</div>
  )
}
