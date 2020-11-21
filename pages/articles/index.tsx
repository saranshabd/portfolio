import React from 'react'
import { Container } from '@material-ui/core'

import { NavbarButton } from 'components/helpers/navbar'

import styles from './styles.module.scss'

const Articles: React.FC = () => {
  return (
    <div className={styles['outer-container']}>
      <Container className={styles['inner-container']}>
        <NavbarButton type='profile' />
      </Container>
    </div>
  )
}

export default Articles
