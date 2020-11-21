import React from 'react'

import styles from './styles.module.scss'

interface NavbarButtonProps {
  type: string
}

export const NavbarButton: React.FC<NavbarButtonProps> = ({ type }) => {
  const getHref = () => {
    const href = 'profile' === type ? '' : `${type}`
    return `/${href}`
  }

  return (
    <div className={styles['articles-btn']}>
      <a href={getHref()}>{type.toUpperCase()}</a>
    </div>
  )
}
