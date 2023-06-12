import BaseLayout from '../components/BaseLayout'

import styles from '../styles/Home.module.css'

function Blog() {
  return (
    <BaseLayout>
      <h2>With great power comes great responsibilities</h2>
      <p>14th April 2021</p>

      <br />

      <h3 className={styles.pageSubTitleHeader}>Introduction</h3>
      <p>
        Are engineers today an essential part of our society? Are they as
        valuable as lawyers or doctors or politicians? In my opinion, the answer
        is &quot;yes&quot; to all of these questions but, in this case, the
        explanation is more fascinating than the answer itself.
      </p>

      <h3 className={styles.pageSubTitleHeader}>
        Application of first principals
      </h3>
      <p>
        Application of first principles is one of the first lessons taught to
        every engineer at the beginning of their academic career. Thinking from
        first principles means breaking down a problem into atomic problems and
        applying the fundamental principles of science and logic to solve those
        atomic problems and work your way up to the actual problem itself.
        Therefore, engineers are one of the only breeds that can cut emotions
        off any problem and be able to see the problem for what it actually is
        instead of what it seems. It is also because of this constant habit of
        applying first principles everywhere that people have a notion of
        engineers being antisocial and rude.
      </p>
      <p>
        There is a reason why we see engineers in all kinds of professions
        including, and not limited to, stand up comedy, politics, practising law
        and medicine. The application of first principles in solving a problem
        is what engineers are good at, and it helps them excel at whatever
        profession they are in. But, as the great saying goes &quot;with great
        power comes great responsibility&quot;.
      </p>

      <h3 className={styles.pageSubTitleHeader}>
        What are engineers busy doing?
      </h3>
      <p>
        There are a few engineers trying to solve the problems of landing a
        rover on Mars, curing cancer using machine learning or connecting the
        human population together using the internet. There are a whole bunch of
        engineers working on problems to push the human race forward. But, what
        are the rest of them busy doing? Making money.
      </p>
      <p>
        Don’t get me wrong, desiring money and working for it is not bad.
        Engineers earn much more money in the early stages of their careers than
        people in any other professions, and I believe they 100% deserve it.
        Today, most of the parents in India want their child to become a
        software engineer or an engineer in general. Ever wondered why? Money.
        They want their child to get rich quickly when they grow up. Notice,
        they don&apos;t care about Mars or cancer or human social interactions,
        all they care about is money. And in all fairness, they are right
        because which parent would not want their child to get a good life, but
        at what cost?
      </p>
      <p>
        Most of the engineers today are self-centred and greedy. All they care
        about is what they are currently working on to (a) satisfy their ego and
        (b) show it off in their resumes. They care about how much money they
        are making and/or how much equity they are getting from the startup that
        they have just joined. One of the best problem-solving breeds is not
        thinking about the most crucial problems at all. Even in colleges,
        engineers are taught how to solve algorithmic problems and operating
        system concepts but not how they can be applied in real life and how
        they can improve the world we all are living in. That&apos;s the
        problem. Today&apos;s engineers are living in a bubble, a bubble that is
        filled with wealth and luxury but almost has nothing to do with the
        outside world. Think I&apos;m wrong? Look at what is happening in the
        world right now, everyone&apos;s livelihood has been affected due to the
        Coronavirus pandemic except for software engineers. One may argue that
        the physical world is ineffective to software, but how many tech
        billionaires or even millionaires have donated their wealth to the ones
        who need it in this period of crisis? I&apos;m not talking about
        socialism, I&apos;m talking about textbook humanity.
      </p>

      <h3 className={styles.pageSubTitleHeader}>
        Do something - no matter the scale
      </h3>
      <p>
        Engineers have this skill to create something from nothing, software is
        literally something out of nothing - it is intangible. We need to use
        this skill to improve the very world we live in. We need to stop serving
        the privileged by creating things that don&apos;t have any effect on the
        real world. I’m not talking about quitting jobs and going full-Gandhi
        mode, but we can at least have a few good side projects where we’re
        helping the ones who actually need our help.
      </p>
      <p>
        We have great power but we need to be more responsible as well. Blaming
        politicians for everything is not going to solve anything, it will just
        serve more content for the news media. Politicians don’t run a country,
        they are just good at crowdsourcing. We, the people, run a country and
        we are the only ones responsible for improving it.
      </p>
      <p>Stay humble and dream big!</p>
    </BaseLayout>
  )
}

export default Blog
