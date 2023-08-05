import styles from '../styles/Home.module.css'

function BlogHeader({ title, publishedOn, href, description }) {
  return (
    <a className={styles.blogHeaderContainer} href={href} target="_blank">
      <div className={styles.blogHeader}>
        <div className={styles.title}>👉 {title}</div>
        <div className={styles.publishedOn}>{publishedOn}</div>
        {description && <div className={styles.description}>{description}</div>}
      </div>
    </a>
  )
}

export default BlogHeader
