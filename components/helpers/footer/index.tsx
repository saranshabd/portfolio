import React from 'react'

import MailIcon from '@material-ui/icons/Mail'
import LinkedInIcon from '@material-ui/icons/LinkedIn'
import GitHubIcon from '@material-ui/icons/GitHub'
import TwitterIcon from '@material-ui/icons/Twitter'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDev } from '@fortawesome/free-brands-svg-icons'

import styles from './styles.module.scss'

export const Footer: React.FC = () => {
  return (
    <div className={styles['footer']}>
      <a href='mailto:saranshabd@gmail.com' target='_blank'>
        <MailIcon fontSize='large' className={styles['icon']} />
      </a>
      <a href='https://github.com/saranshabd' target='_blank'>
        <GitHubIcon fontSize='large' className={styles['icon']} />
      </a>
      <a href='https://linkedin.com/in/saranshabd' target='_blank'>
        <LinkedInIcon fontSize='large' className={styles['icon']} />
      </a>
      <a href='https://twitter.com/saranshabd' target='_blank'>
        <TwitterIcon fontSize='large' className={styles['icon']} />
      </a>
      <a href='https://dev.to/saranshabd' target='_blank'>
        <FontAwesomeIcon
          icon={faDev}
          color='white'
          size='2x'
          className={styles['icon']}
        />
      </a>
    </div>
  )
}
