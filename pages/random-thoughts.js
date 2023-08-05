import BaseLayout from '../components/BaseLayout'
import BlogHeader from '../components/BlogHeader'

import styles from '../styles/Home.module.css'

function RandomThoughts() {
  return (
    <BaseLayout>
      <h2 className={styles.pageSubTitleHeader}>Random thoughts</h2>
      <p>
        Here is a compilation of stuff that comes across my mind in my free
        time. The lack of content here does not imply that I am busy all the
        time, instead, it shows exactly how much I procrastinate.
      </p>
      <BlogHeader
        title="Big Tech vs Startups: The myths and realities"
        publishedOn="2nd May 2022"
        href="/big-tech-vs-startups-the-myths-and-realities"
        description="The objective of this blog is to evaluate the pros and cons of working at different types of companies in India."
      />
      <BlogHeader
        title="With great power comes great responsibility"
        publishedOn="14th April 2021"
        href="/with-great-power-comes-great-responsibility"
        description="We need to stop serving the privileged by creating things that don't have any effect on the real world."
      />
      <h2 className={styles.pageSubTitleHeader}>Internet dump</h2>
      <p>
        Interesting stuff I found while surfing the internet. I love the content
        so much that I keep coming back to it.
      </p>
      <p>
        <ul>
          <li>
            <a
              target="_blank"
              href="https://dilbertblog.typepad.com/the_dilbert_blog/2007/06/the_day_you_bec.html"
            >
              The Day You Became A Better Writer - Scott Adams
            </a>
          </li>
          <li>
            <a
              target="_blank"
              href="https://1729.com/how-to-start-a-new-country"
            >
              How to Start a New Country - Balaji Srinivasan
            </a>
          </li>
          <li>
            <a target="_blank" href="http://www.paulgraham.com/ds.html">
              Do Things that Don't Scale - Paul Graham
            </a>
          </li>
          <li>
            <a target="_blank" href="http://www.paulgraham.com/simply.html">
              Write Simply - Paul Graham
            </a>
          </li>
        </ul>
      </p>
      <p>
        I am not a huge fan of cliché clickbait content but Naval Ravikant is
        just too good to ignore. He might be the only rich guy who is actually
        happy.
      </p>
      <p>
        <center>
          <blockquote class="twitter-tweet" style={{ maxWidth: '100%' }}>
            <p lang="en" dir="ltr">
              How to Get Rich (without getting lucky):
            </p>
            &mdash; Naval (@naval){' '}
            <a href="https://twitter.com/naval/status/1002103360646823936?ref_src=twsrc%5Etfw">
              May 31, 2018
            </a>
          </blockquote>{' '}
          <script
            async
            src="https://platform.twitter.com/widgets.js"
            charset="utf-8"
          ></script>
        </center>
      </p>
    </BaseLayout>
  )
}

export default RandomThoughts
