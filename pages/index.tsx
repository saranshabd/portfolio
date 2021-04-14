import React from 'react'

import styles from './home.module.scss'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter, faLinkedin } from '@fortawesome/free-brands-svg-icons'

const Home: React.FC = () => {
  return (
    <div className={styles['container']}>
      <h2>Shabd Saran</h2>
      <p>What I write makes absolutely no sense, so read it at your own risk</p>
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
      <hr />
      <br />
      <h4>Writings</h4>
      <br />
      <div className={styles['content']}>
        <h2>With great power comes great responsibility</h2>
        <p className={styles['date']}>14th April 2021</p>
        <p>
          Having the knowledge of something and actually applying that knowledge
          to do something valuable are two very different things.
        </p>
      </div>
    </div>
  )
}

export default Home
