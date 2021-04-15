import React from 'react'

import styles from './callout.module.scss'

interface Props {
  children: React.ReactNode
}

const Callout: React.FC<Props> = (props: Props) => {
  return <div className={styles['callout']}>{props.children}</div>
}

export default Callout
