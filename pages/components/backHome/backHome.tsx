import React from 'react'
import Link from 'next/link'

import styles from './backHome.module.scss'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLongArrowAltLeft } from '@fortawesome/free-solid-svg-icons'

const BackHome: React.FC = () => {
  return (
    <Link href='/'>
      <div className={styles['container']}>
        <FontAwesomeIcon
          icon={faLongArrowAltLeft}
          size='1x'
          className={styles['icon']}
        />
        Home
      </div>
    </Link>
  )
}

export default BackHome
