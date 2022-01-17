import BaseLayout from '../components/BaseLayout'
import Link from '../components/Link'
import PageLink from '../components/PageLink'

function Home() {
  return (
    <BaseLayout>
      <p>Welcome to my corner on the internet!</p>
      <p>
        I am a Founding Member at an early-stage YC fintech startup,{' '}
        <Link href="http://swadesh.co/">Swadesh</Link>, where I work as a
        Software Engineer. I have graduated recently, in 2021, from an
        undergraduate degree in Computer Science and Engineering.
      </p>
      <p>
        I like reading books, particularly non-fiction, though I cannot say I am
        an active reader having read only a limited number of books. Besides
        that, I have been following Football since my childhood and only
        recently started watching Formula 1.
      </p>
      <br />
      <PageLink href="/technical-blogs">Technical blogs</PageLink>
      <PageLink href="/random-thoughts">Random thoughts</PageLink>
    </BaseLayout>
  )
}

export default Home
