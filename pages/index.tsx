import React from 'react'
import ReactFullpage from '@fullpage/react-fullpage'

import { IntroProfile } from 'components/profile/intro'
import { TechStackProfile } from 'components/profile/techStack'
import { ProjectsProfile } from 'components/profile/projects'
import { ExperiencesProfile } from 'components/profile/experiences'

import { ReactFullPageSection } from 'components/helpers/ReactFullPageSection'

const Home: React.FC = () => {
  const anchors = [
    {
      name: 'intro',
      Component: IntroProfile,
    },
    {
      name: 'tech-stack',
      Component: TechStackProfile,
    },
    {
      name: 'projects',
      Component: ProjectsProfile,
    },
    {
      name: 'experiences',
      Component: ExperiencesProfile,
    },
  ]

  const renderSections = () => {
    return (
      <ReactFullpage.Wrapper>
        {anchors.map(({ name, Component }) => (
          <ReactFullPageSection
            className={`${name}-section`}
            component={Component}
          />
        ))}
        <style jsx global>{`
          #fp-nav ul li a span,
          .fp-slidesNav ul li a span {
            background: #fff;
          }
        `}</style>
      </ReactFullpage.Wrapper>
    )
  }

  return (
    <ReactFullpage
      scrollingSpeed={1000}
      anchors={anchors.map((anchor) => anchor.name)}
      navigation={true}
      render={renderSections}
    />
  )
}

export default Home
