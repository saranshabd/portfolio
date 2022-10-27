import BaseLayout from '../components/BaseLayout'
import BlogHeader from '../components/BlogHeader'

function Ares3() {
  function getURL(slug) {
    return `https://open.substack.com/pub/saranshabd/p/${slug}?utm_campaign=portfolio&utm_medium=web`
  }

  return (
    <BaseLayout>
      <h2>Ares 3</h2>
      <p>
        These are the Substack articles I have posted on Ares 3: Exploration log
        entries. Here I post stuff that I explore out of curiosity, which is not
        restricted to just programming.
      </p>
      <br />
      <BlogHeader
        title="Create virtual identity within minutes"
        publishedOn="26th October 2022"
        href={getURL('create-virtual-identity-within-minutes')}
      />
      <BlogHeader
        title="How to finish any book in a single day?"
        publishedOn="12th September 2022"
        href={getURL('how-to-finish-any-book-in-a-single')}
      />
      <BlogHeader
        title="LOG ENTRY: SOL 1"
        publishedOn="28th August 2022"
        href={getURL('log-entry-sol-1')}
      />
    </BaseLayout>
  )
}

export default Ares3
