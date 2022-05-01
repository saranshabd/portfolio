import BaseLayout from '../components/BaseLayout'
import BlogHeader from '../components/BlogHeader'

function RandomThoughts() {
  return (
    <BaseLayout>
      <h2>Random thoughts</h2>
      <p>
        Here is a compilation of almost anything that comes across my mind in my
        free time. The lack of content here does not imply that I do not have
        any free time, instead it depicts my laziness to do anything in it.
      </p>
      <br />
      <BlogHeader
        title="With great power comes great responsibility"
        publishedOn="14th April 2021"
        href="/with-great-power-comes-great-responsibility"
      />
      <BlogHeader
        title="Big Tech vs Startups: The myths and realities"
        publishedOn="1st May 2022"
        href="/big-tech-vs-startups-the-myths-and-realities"
      />
    </BaseLayout>
  )
}

export default RandomThoughts
