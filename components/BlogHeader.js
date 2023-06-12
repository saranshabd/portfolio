import styles from '../styles/Home.module.css'

function BlogHeader({ title, publishedOn, href }) {
  return (
    <a className={styles.blogHeaderContainer} href={href} target="_blank">
      <div className={styles.blogHeader}>
        <div className={styles.title}>👉 {title}</div>
        <div className={styles.publishedOn}>{publishedOn}</div>
      </div>
    </a>
  )
}

export default BlogHeader
