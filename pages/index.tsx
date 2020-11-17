import React from 'react'
import ReactFullpage from '@fullpage/react-fullpage'

// Components
import { IntroProfile } from 'components/profile/intro'

interface SectionProps {
  children: React.ReactNode
  className: string
}

const ReactFullPageSection: React.FC<SectionProps> = (props) => {
  return <div className={`section ${props.className}`}>{props.children}</div>
}

const Home: React.FC = () => {
  return (
    <ReactFullpage
      render={() => {
        return (
          <ReactFullpage.Wrapper>
            <ReactFullPageSection className='intro-section'>
              <IntroProfile />
            </ReactFullPageSection>
          </ReactFullpage.Wrapper>
        )
      }}
    />
  )
}

export default Home
