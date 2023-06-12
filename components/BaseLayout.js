import Image from 'next/image'

import Link from './Link'
import Footer from './Footer'

import styles from '../styles/Home.module.css'

function BaseLayout({ children, header = true, footer = true }) {
  return (
    <div className={styles.container}>
      {/* <DefaultHead /> */}

      <main>
        {header && (
          <>
            <div className={styles.header}>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a className={styles.pageTitleHeader} href="/">
                <h1>Shabd Saran</h1>
              </a>
              <div className={styles.socialLinks}>
                <Link href="https://linkedin.com/in/saranshabd">
                  <Image
                    height="25rem"
                    width="25rem"
                    src="/LinkedIn.svg"
                    alt="LinkedIn"
                  />
                </Link>
                <Link href="https://twitter.com/saranshabd">
                  <Image
                    height="25rem"
                    width="25rem"
                    src="/Twitter.svg"
                    alt="Twitter"
                  />
                </Link>
                <Link href="https://github.com/saranshabd">
                  <Image
                    height="25rem"
                    width="25rem"
                    src="/GitHub.svg"
                    alt="GitHub"
                  />
                </Link>
                <Link href="https://saranshabd.substack.com">
                  <Image
                    height="25rem"
                    width="25rem"
                    src="/Substack.svg"
                    alt="Substack"
                  />
                </Link>
              </div>
            </div>
          </>
        )}

        {children}

        {footer && <br />}
      </main>

      {footer && <Footer />}
    </div>
  )
}

export default BaseLayout
