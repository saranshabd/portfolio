import React from 'react'
import Link from 'next/link'

import styles from './styles.module.scss'

interface Props {}

export const ExperiencesProfile: React.FC<Props> = () => {
  return (
    <div className={styles['container']}>
      <h1>Experiences</h1>
      <Link href='/experiences/business-oriented-projects'>
        <h2 className={styles['link']}>Business-oriented projects</h2>
      </Link>
      <Link href='/experiences/coorporate'>
        <h2 className={styles['link']}>Corporate</h2>
      </Link>
    </div>
  )
}
