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
        title="Contextualising identifiers in a system"
        publishedOn="2nd August 2023"
        href="https://dev.to/saranshabd/contextualising-identifiers-in-a-system-4mm6"
        description="In systems with myriad unique identifiers, each representing an essential entity, issues related to backtracking or context retention can escalate rapidly."
      />
      <BlogHeader
        title="Python w/ strict typechecker"
        publishedOn="23rd December 2022"
        href="https://dev.to/saranshabd/python-w-strict-typechecker-3l7g"
        description="Our job as a code-maintainer is to ensure that all of our code is type-safe before committing a change, and ensure the type-safety at the remote repository-level as well i.e. GitHub/GitLab."
      />
      <BlogHeader
        title="Go migrate from-express"
        publishedOn="30th October 2022"
        href="https://dev.to/saranshabd/go-migrate-from-express-2amm"
        description="Go treats functions as first-class citizens so your HTTP setup is going to be just a bunch of functions."
      />
      <BlogHeader
        title="Simple Cookies with Node.js and any frontend JavaScript framework"
        publishedOn="26th March 2022"
        href="https://dev.to/saranshabd/simple-cookies-with-nodejs-and-any-frontend-javascript-framework-42ph"
        description="No more wandering from one Stackoverflow answer to another in search of workable cookies configurations with Node.js."
      />
      <BlogHeader
        title="How and why to use Docker as a package manager?"
        publishedOn="10th November 2021"
        href="https://dev.to/saranshabd/how-and-why-to-use-docker-as-a-package-manager-2jha"
        description="You can simply create two Docker containers and run MongoDB v3.6 on one and MongoDB v4.4 on the other."
      />
      <BlogHeader
        title="How Docker can help you sleep well at night?"
        publishedOn="27th October 2021"
        href="https://dev.to/saranshabd/how-docker-can-help-you-sleep-well-at-night-3c80"
        description="This article is dedicated to these people, to enlighten them a whole new world of containerization."
      />
    </BaseLayout>
  )
}

export default TechnicalBlogs
