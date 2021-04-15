import React from 'react'
import Link from 'next/link'

import styles from './homeContent.module.scss'

interface Props {
  heading: string
  summary: string
  url: string
}

const HomeContent: React.FC<Props> = (props: Props) => {
  return (
    <Link href={props.url}>
      <div className={styles['content']}>
        <div className={styles['heading']}>
          <h2>{props.heading}</h2>
        </div>
        <p>{props.summary}</p>
      </div>
    </Link>
  )
}

export default HomeContent
