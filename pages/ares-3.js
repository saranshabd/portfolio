import BaseLayout from '../components/BaseLayout'
import BlogHeader from '../components/BlogHeader'

import styles from '../styles/Home.module.css'

function Ares3() {
  function getURL(slug) {
    return `https://open.substack.com/pub/saranshabd/p/${slug}?utm_campaign=portfolio&utm_medium=web`
  }

  return (
    <BaseLayout>
      <h2 className={styles.pageSubTitleHeader}>Ares 3</h2>
      <p>
        These are the Substack articles I have posted on Ares 3: Exploration log
        entries. Here I post stuff that I explore out of curiosity, which is not
        restricted to just programming.
      </p>
      <BlogHeader
        title="Create virtual identity within minutes"
        publishedOn="26th October 2022"
        href={getURL('create-virtual-identity-within-minutes')}
        description="You are way more exposed on the internet than in the physical world. Every movement is tracked: mouse clicks, screen touches, etc."
      />
      <BlogHeader
        title="How to finish any book in a single day?"
        publishedOn="12th September 2022"
        href={getURL('how-to-finish-any-book-in-a-single')}
        description="Pick up a book. Ask relevant questions and try to get their answers. Finally, figure out for yourself if you want to get into any of the specifics. Simple!"
      />
      <BlogHeader
        title="LOG ENTRY: SOL 1"
        publishedOn="28th August 2022"
        href={getURL('log-entry-sol-1')}
        description="Btw, if you have noticed the title it’s the log entries format from The Martian."
      />
    </BaseLayout>
  )
}

export default Ares3
