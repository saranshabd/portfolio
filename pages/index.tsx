import React from 'react'

import styles from './home.module.scss'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter, faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons'

import Container from '../components/container/container'
import HomeContent from '../components/homeContent/homeContent'
import Callout from '../components/callout/callout'

const Home: React.FC = () => {
  return (
    <Container isHomepage={true}>
      <h2>Shabd Saran</h2>
      <p>What I write makes absolutely no sense, so read it at your own risk</p>
      <br />
      <div className={styles['social-media-links']}>
        <a
          href='https://twitter.com/saranshabd'
          target='_blank'
          className={`${styles['container']} ${styles['twitter-container']}`}
        >
          <FontAwesomeIcon
            icon={faTwitter}
            // size='1x'
            className={`${styles['icon']} ${styles['twitter-icon']}`}
          />
        </a>
        <a
          href='https://www.linkedin.com/in/saranshabd'
          target='_blank'
          className={`${styles['container']} ${styles['linkedin-container']}`}
        >
          <FontAwesomeIcon
            icon={faLinkedin}
            // size='1x'
            className={`${styles['icon']} ${styles['linkedin-icon']}`}
          />
        </a>
        <a
          href='https://www.github.com/saranshabd'
          target='_blank'
          className={`${styles['container']} ${styles['github-container']}`}
        >
          <FontAwesomeIcon
            icon={faGithub}
            // size='1x'
            className={`${styles['icon']} ${styles['github-icon']}`}
          />
        </a>
      </div>
      <br />
      <Callout>
        If you're here looking for my resume, then head to my LinkedIn profile. It's hard enough to maintain resumes on
        LinkedIn, than to do that here as well.
        <br />
        <br />
        Hit me up at <a className={styles['email-link']} href="mailto:saranshabd@gmail.com">saranshabd@gmail.com</a> in
        case you have something interesting to discuss, or if you want to collaborate on a project.
      </Callout>
      <br />
      <div className={styles['divider']}>
        <hr />
      </div>
      <h4 className={styles['title-container']}>Writings</h4>
      <HomeContent
        heading='With great power comes great responsibility'
        summary='Having the knowledge of a subject and actually applying it in real life are two very differnt things. We need to focus on the latter.'
        url='/writings/with-great-power-comes-great-responsibility'
      />
      <br />
      <div className={styles['divider']}>
        <hr />
      </div>
      <h4 className={styles['title-container']}>Technical articles</h4>
      <HomeContent
        heading='How Docker can help you sleep well at night?'
        subHeading='Read by 380+ people on dev.to'
        summary="This is an introductory article on Docker and the concepts of containerisation. It focuses on the
        theoretical concepts involved in the functioning of Docker, and how it can be used to save one's time and
        resources."
        url='https://dev.to/saranshabd/how-docker-can-help-you-sleep-well-at-night-3c80'
      />
      <br />
      <HomeContent
        heading='How and why to use Docker as a package manager?'
        subHeading='Read by 330+ people on dev.to'
        summary='An article on how one can use Docker as a package manager on their development machine, instead of
        `apt` or `brew` on Ubuntu and macOS respectively. There are some scenarios where `apt` and `brew` might fail you.'
        url='https://dev.to/saranshabd/how-and-why-to-use-docker-as-a-package-manager-2jha'
      />
    </Container>
  )
}

export default Home
