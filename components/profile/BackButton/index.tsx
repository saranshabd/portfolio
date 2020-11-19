import React from 'react'
import Link from 'next/link'
import { ArrowBack } from '@material-ui/icons'

import styles from './styles.module.scss'

interface Props {
  href: string
}

export const BackButton: React.FC<Props> = ({ href }) => {
  return (
    <Link href={href}>
      <button className={styles['back-btn']}>
        <ArrowBack fontSize='large' />
      </button>
    </Link>
  )
}
