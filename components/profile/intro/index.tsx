import React from 'react'
import Typist from 'react-typist'
import { Container, Grid } from '@material-ui/core'

import styles from './styles.module.scss'
import { Footer } from 'components/helpers/footer'
import { NavbarButton } from 'components/helpers/navbar'

export const IntroProfile: React.FC = () => {
  return (
    <div className={styles['outer-container']}>
      <Container className={styles['container']}>
        <NavbarButton type='articles' />
        <Grid
          container
          direction='column'
          justify='center'
          alignItems='center'
          spacing={2}
        >
          <Grid item>
            <Typist cursor={{ show: false }} avgTypingDelay={100}>
              <h1>Shabd Saran</h1>
            </Typist>
          </Grid>
          <Grid item>
            <p>
              Software engineer with experience in full-stack development,
              competitive programming, DevOps and startups (still learning)
            </p>
          </Grid>
        </Grid>
        <Footer />
      </Container>
    </div>
  )
}
