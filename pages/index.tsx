import React from 'react'

import styles from './home.module.scss'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter, faLinkedin } from '@fortawesome/free-brands-svg-icons'

import HomeContent from './components/homeContent/homeContent'
import Callout from './components/callout/callout'

const Home: React.FC = () => {
  return (
    <div className={styles['container']}>
      <div className={styles['inner-container']}>
        <h2>Shabd Saran</h2>
        <p>
          What I write makes absolutely no sense, so read it at your own risk
        </p>
        <div className={styles['social-media-links']}>
          <a
            href='https://twitter.com/saranshabd'
            target='_blank'
            className={`${styles['container']} ${styles['twitter-container']}`}
          >
            <FontAwesomeIcon
              icon={faTwitter}
              size='1x'
              className={`${styles['icon']} ${styles['twitter-icon']}`}
            />
            <p>Twitter</p>
          </a>
          <a
            href='https://www.linkedin.com/in/saranshabd'
            target='_blank'
            className={`${styles['container']} ${styles['linkedin-container']}`}
          >
            <FontAwesomeIcon
              icon={faLinkedin}
              size='1x'
              className={`${styles['icon']} ${styles['linkedin-icon']}`}
            />
            <p>LinkedIn</p>
          </a>
        </div>
        <br />
        <Callout>
          If you are looking for my technical profile then head to my LinkedIn
          profile. I'd recommend visiting my Twitter handle as well. Thanks!
        </Callout>
        <br />
        <div className={styles['divider']}>
          <hr />
        </div>
        <h4 className={styles['title-container']}>Writings</h4>
        <div>
          <HomeContent
            heading='With great power comes great responsibility'
            summary='Having the knowledge of something and actually applying that knowledge
        to do something valuable are two very different things.'
          />
        </div>
      </div>
    </div>
  )
}

export default Home
