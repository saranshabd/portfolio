import React from 'react'

import styles from './homeContent.module.scss'

interface Props {
  heading: string
  summary: string
}

const HomeContent: React.FC<Props> = (props: Props) => {
  return (
    <div className={styles['content']}>
      <div className={styles['heading']}>
        <h2>{props.heading}</h2>
      </div>
      <p>{props.summary}</p>
    </div>
  )
}

export default HomeContent
