import BaseLayout from '../components/BaseLayout'
import BlogHeader from '../components/BlogHeader'

import styles from '../styles/Home.module.css'

function TechnicalBlogs() {
  return (
    <BaseLayout>
      <h2 className={styles.pageSubTitleHeader}>Technical Blogs</h2>
      <p>
        With the very limited amount of knowledge and experience I have gained
        so far, here are some of the blogs that I have written explaining the
        technologies and principals I use myself while writing code.
      </p>
      <BlogHeader
        title="Contextualizing Identifiers"
        publishedOn="12th June 2023"
        href="/contextualizing-identifiers"
      />
      <BlogHeader
        title="Go migrate from-express"
        publishedOn="30th October 2022"
        href="https://dev.to/saranshabd/go-migrate-from-express-2amm"
      />
      <BlogHeader
        title="Simple Cookies with Node.js and any frontend JavaScript framework"
        publishedOn="26th March 2022"
        href="https://dev.to/saranshabd/simple-cookies-with-nodejs-and-any-frontend-javascript-framework-42ph"
      />
      <BlogHeader
        title="How and why to use Docker as a package manager?"
        publishedOn="10th November 2021"
        href="https://dev.to/saranshabd/how-and-why-to-use-docker-as-a-package-manager-2jha"
      />
      <BlogHeader
        title="How Docker can help you sleep well at night?"
        publishedOn="27th October 2021"
        href="https://dev.to/saranshabd/how-docker-can-help-you-sleep-well-at-night-3c80"
      />
    </BaseLayout>
  )
}

export default TechnicalBlogs
