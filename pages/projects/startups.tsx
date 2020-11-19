import React from 'react'
import { Container } from '@material-ui/core'

import styles from './styles.module.scss'

interface Props {}

const StartupProjects: React.FC<Props> = () => {
  return (
    <div className={styles['outer-container']}>
      <Container className={styles['inner-container']}>
        <h1>Startups</h1>
        <div className={styles['cards']}>
          <div className={styles['item']}>
            <h2>Collaborative visualization tool for writers</h2>
            <p>
              This was a collaborative tool for writers to write their stories
              and stuff. We ran a beta test for this project and got amazing
              results.
            </p>
          </div>
          <div className={styles['item']}>
            <h2>Collaborative visualization tool for writers</h2>
            <p>
              This was a collaborative tool for writers to write their stories
              and stuff. We ran a beta test for this project and got amazing
              results.
            </p>
          </div>
          <div className={styles['item']}>
            <h2>Collaborative visualization tool for writers</h2>
            <p>
              This was a collaborative tool for writers to write their stories
              and stuff. We ran a beta test for this project and got amazing
              results.
            </p>
          </div>
          <div className={styles['item']}>
            <h2>Collaborative visualization tool for writers</h2>
            <p>
              This was a collaborative tool for writers to write their stories
              and stuff. We ran a beta test for this project and got amazing
              results.
            </p>
          </div>
        </div>
      </Container>

      <style jsx global>
        {`
          body {
            background: #17a589;
            margin: 0;
            padding: 0;
            height: 100%;
          }
        `}
      </style>
    </div>
  )
}

export default StartupProjects