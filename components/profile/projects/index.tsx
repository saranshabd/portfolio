import React from 'react'
import { Grid } from '@material-ui/core'

import styles from './styles.module.scss'

interface Props {}

export const ProjectsProfile: React.FC<Props> = () => {
  return (
    <div className={styles['container']}>
      <h1>Projects</h1>
      <Grid
        container
        direction='column'
        justify='center'
        alignItems='center'
        spacing={1}
        className={styles['menu']}
      >
        <Grid item>
          <a href='/projects/web-development' className={styles['link']}>
            Web Development
          </a>
        </Grid>
        <Grid item>
          <a href='/projects/bots-and-data-science' className={styles['link']}>
            Bots & Data Science
          </a>
        </Grid>
        <Grid item>
          <a href='/projects/utility-tools' className={styles['link']}>
            Utility Tools
          </a>
        </Grid>
      </Grid>
    </div>
  )
}
