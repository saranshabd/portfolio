import React from 'react'

import styles from './container.module.scss'

interface Props {
  children: React.ReactNode
  isHomepage: boolean
}

const Container: React.FC<Props> = ({ children, isHomepage }) => {
  return (
    <div className={styles['container']}>
      <div
        className={
          isHomepage
            ? styles['inner-container-center']
            : styles['inner-container-start']
        }
      >
        {children}
      </div>
    </div>
  )
}

export default Container
