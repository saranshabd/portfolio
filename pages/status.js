import BaseLayout from '../components/BaseLayout'
import Link from '../components/Link'

import styles from '../styles/Home.module.css'

function Status() {
  return (
    <BaseLayout>
      <p>
        <b>Alive</b>: <span className={styles.colorSuccess}>Yes!</span> I have
        no idea how I will update the website once I am not alive.
      </p>
      <p>
        <b>Health</b>: My diet has more chocolates than fruits in it.
      </p>
      <p>
        <b>Relationship</b>: Don't even talk about it.
      </p>
      <p>
        <b>Work</b>: <Link href="https://www.smallcase.com">smallcase</Link>...
        still.
      </p>
      <p>
        <b>Off-work</b>: Have been reading lately.
      </p>
      <p>
        <b>Location</b>: Bengaluru, India - still traumatized by house hunting
        in the city.
      </p>
      <br />
      <p>Just check my Twitter and be done with it.</p>
    </BaseLayout>
  )
}

export default Status
