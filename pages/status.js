import BaseLayout from '../components/BaseLayout'
import Link from '../components/Link'

import styles from '../styles/Home.module.css'

function Status() {
  return (
    <BaseLayout>
      <p>
        Alive: <span className={styles.colorSuccess}>Yes!</span>
      </p>
      <p>Health: Skinny these days</p>
      <p>Relationship: LMAO</p>
      <p>
        Work: <Link href="https://www.smallcase.com">smallcase</Link>
      </p>
      <p>
        Off-work: <Link href="https://ispirt.in">iSPIRT</Link>
      </p>
      <p>Location: Bengaluru, India</p>
      <br />
      <p>Just check my Twitter and be done with it.</p>
    </BaseLayout>
  )
}

export default Status
