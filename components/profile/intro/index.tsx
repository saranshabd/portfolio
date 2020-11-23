import React from 'react'
import Typist from 'react-typist'
import { Container, Grid } from '@material-ui/core'

import styles from './styles.module.scss'
import { Footer } from 'components/helpers/footer'

import _data from 'static/intro.json'
import { IntroDataType } from 'utils/interfaces'

const data = _data as IntroDataType

export const IntroProfile: React.FC = () => {
  return (
    <div className={styles['outer-container']}>
      <Container className={styles['container']}>
        <Grid
          container
          direction='column'
          justify='center'
          alignItems='center'
          spacing={2}
        >
          <Grid item>
            <Typist cursor={{ show: false }} avgTypingDelay={100}>
              <h1>{data.name}</h1>
            </Typist>
          </Grid>
          <Grid item>
            <p>{data.message}</p>
          </Grid>
        </Grid>
        <Footer />
      </Container>
    </div>
  )
}
