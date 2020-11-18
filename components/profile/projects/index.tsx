import React from 'react'
import Link from 'next/link'

import styles from './styles.module.scss'

interface Props {}

export const ProjectsProfile: React.FC<Props> = () => {
  return (
    <div className={styles['container']}>
      <h1>Projects</h1>
      <Link href='/projects/startups'>
        <h2 className={styles['link']}>Startups</h2>
      </Link>
      <Link href='/projects/web-development'>
        <h2 className={styles['link']}>Web Development</h2>
      </Link>
      <Link href='/projects/bots-and-data-science'>
        <h2 className={styles['link']}>Bots & Data Science</h2>
      </Link>
    </div>
  )
}
