import React from 'react'
import { Grid } from '@material-ui/core'

import styles from './styles.module.scss'

interface Props {}

export const ExperiencesProfile: React.FC<Props> = () => {
  return (
    <div className={styles['container']}>
      <h1>Experiences</h1>
      <Grid
        container
        direction='column'
        justify='center'
        alignItems='center'
        spacing={1}
        className={styles['menu']}
      >
        <Grid item>
          <a
            href='/experiences/business-oriented-projects'
            className={styles['link']}
          >
            Business-oriented projects
          </a>
        </Grid>
        <Grid item>
          <a href='/experiences/corporate' className={styles['link']}>
            Corporate
          </a>
        </Grid>
      </Grid>
    </div>
  )
}
