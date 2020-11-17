import React from 'react'
import ReactFullpage from '@fullpage/react-fullpage'

import { IntroProfile } from 'components/profile/intro'
import { TechStackProfile } from 'components/profile/techStack'
import { ReactFullPageSection } from 'components/helpers/ReactFullPageSection'

const Home: React.FC = () => {
  return (
    <ReactFullpage
      render={() => (
        <ReactFullpage.Wrapper>
          <ReactFullPageSection
            className='intro-section'
            component={IntroProfile}
          />
          <ReactFullPageSection
            className='tech-stack-section'
            component={TechStackProfile}
          />
        </ReactFullpage.Wrapper>
      )}
    />
  )
}

export default Home
