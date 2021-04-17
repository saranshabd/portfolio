import React from 'react'

import styles from './contentContent.module.scss'

interface Props {
  children: React.ReactNode
}

const ContentContent: React.FC<Props> = ({ children }) => {
  return <div className={styles['container']}>{children}</div>
}

export default ContentContent
