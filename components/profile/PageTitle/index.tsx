import React from 'react'

import styles from './styles.module.scss'

interface Props {
  children: React.ReactText
}

export const PageTitle: React.FC<Props> = ({ children }) => {
  return <h1 className={styles['page-title']}>{children}</h1>
}
