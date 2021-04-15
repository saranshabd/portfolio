import React from 'react'

import styles from './titleHeading.module.scss'

interface Props {
  heading: string
  date: string
}

const TitleHeading: React.FC<Props> = (props) => {
  return (
    <div>
      <div>
        <h2>{props.heading}</h2>
      </div>
      <div className={styles['date']}>
        <p>{props.date}</p>
      </div>
    </div>
  )
}

export default TitleHeading
