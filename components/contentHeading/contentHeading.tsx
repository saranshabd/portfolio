import React from 'react'

import styles from './contentHeading.module.scss'

interface Props {
  children: React.ReactNode
}

const ContentHeading: React.FC<Props> = ({ children }) => {
  return <div className={styles['container']}>{children}</div>
}

export default ContentHeading
