import BaseLayout from '../components/BaseLayout'
import PageLink from '../components/PageLink'

function Home() {
  return (
    <BaseLayout>
      <p>Welcome to my corner on the internet!</p>
      <p>
        I work as a Software Engineer at{' '}
        <a href="https://smallcase.com" target="_blank">
          smallcase
        </a>
        , which is a platform to invest in model portfolios of stocks, ETFs and
        REITs. Prior to that, I worked at a bunch of tech companies ranging from
        a unicorn in India to an early-stage{' '}
        <a href="https://www.ycombinator.com/">YC</a> fintech startup.
      </p>
      <p>
        Also, I volunteer at <a href="https://ispirt.in/">iSPIRT</a> to build
        impactful products for the Indian masses. Currently, I am working on the
        Indian Software Product Registry (ISPR).
      </p>
      <p>
        I like reading books, particularly non-fiction. Besides that, I have
        been following Football since my early childhood, and only recently
        started watching Formula 1.
      </p>
      <br />
      <PageLink href="/technical-blogs">Technical blogs</PageLink>
      <PageLink href="/random-thoughts">Random thoughts</PageLink>
      <PageLink href="/ares-3">Ares 3: Exploration log entries</PageLink>
    </BaseLayout>
  )
}

export default Home
