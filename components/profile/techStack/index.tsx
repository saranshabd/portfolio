import React from 'react'
import { Chip } from '@material-ui/core'
import { Container } from '@material-ui/core'

import styles from './styles.module.scss'

interface Props {}

export const TechStackProfile: React.FC<Props> = () => {
  return (
    <Container className={styles['container']}>
      <h1>Tech stack</h1>

      <h2>Programming languages</h2>
      <Chip className={styles['chip']} label='Golang' />
      <Chip className={styles['chip']} label='Golang' />
      <Chip className={styles['chip']} label='Golang' />
      <Chip className={styles['chip']} label='Golang' />
      <Chip className={styles['chip']} label='Golang' />
      <Chip className={styles['chip']} label='Golang' />

      <h2>Frameworks</h2>
      <Chip className={styles['chip']} label='Golang' />
      <Chip className={styles['chip']} label='Golang' />
      <Chip className={styles['chip']} label='Golang' />
      <Chip className={styles['chip']} label='Golang' />
      <Chip className={styles['chip']} label='Golang' />
      <Chip className={styles['chip']} label='Golang' />

      <h2>Technologies</h2>
      <Chip className={styles['chip']} label='Golang' />
      <Chip className={styles['chip']} label='Golang' />
      <Chip className={styles['chip']} label='Golang' />
      <Chip className={styles['chip']} label='Golang' />
      <Chip className={styles['chip']} label='Golang' />
      <Chip className={styles['chip']} label='Golang' />
    </Container>
  )
}
