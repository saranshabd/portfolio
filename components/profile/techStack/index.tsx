import React from 'react'
import { Chip } from '@material-ui/core'
import { Container } from '@material-ui/core'

import styles from './styles.module.scss'

import _data from 'static/tech-stack.json'
import { TechStackDataType } from 'utils/interfaces'

interface Props {}

const data = _data as TechStackDataType

export const TechStackProfile: React.FC<Props> = () => {
  return (
    <div className={styles['outer-container']}>
      <Container className={styles['container']}>
        <h1>Tech stack</h1>

        <h2>Programming languages</h2>
        {data.programmingLanguages.map((item) => (
          <Chip className={styles['chip']} label={item} />
        ))}

        <h2>Frameworks</h2>
        {data.frameworks.map((item) => (
          <Chip className={styles['chip']} label={item} />
        ))}

        <h2>Technologies</h2>
        {data.technologies.map((item) => (
          <Chip className={styles['chip']} label={item} />
        ))}
      </Container>
    </div>
  )
}
