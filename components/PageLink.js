import styles from '../styles/Home.module.css'

function PageLink({ children, href }) {
  return (
    <a className={styles.pageLink} href={href}>
      <div className={styles.pageLinkContainer}>{children}</div>
    </a>
  )
}

export default PageLink
