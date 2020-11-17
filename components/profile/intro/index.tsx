import React from 'react'
import Typist from 'react-typist'
import { Container, Grid } from '@material-ui/core'

import styles from './styles.module.scss'

export const IntroProfile: React.FC = () => {
  return (
    <Container className={styles['container']}>
      <Grid container direction='column' justify='center' alignItems='center'>
        <Grid item>
          <Typist cursor={{ show: false }} avgTypingDelay={100}>
            <h1>Shabd Saran</h1>
          </Typist>
        </Grid>
        <Grid item>
          <h2>
            Software engineer with experience in full-stack development,
            competitive programming, DevOps and startups (still learning)
          </h2>
        </Grid>
      </Grid>
    </Container>
  )
}
