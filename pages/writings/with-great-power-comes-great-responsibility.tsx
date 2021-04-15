import React from 'react'

import Container from '../components/container/container'
import BackHome from '../components/backHome/backHome'
import Callout from '../components/callout/callout'
import TitleHeading from '../components/titleHeading/titleHeading'
import ContentHeading from '../components/contentHeading/contentHeading'
import ContentContent from '../components/contentContent/contentContent'

const WritingPage: React.FC = () => {
  return (
    <Container isHomepage={false}>
      <BackHome />
      <br />
      <TitleHeading
        heading='With great power comes great responsibility'
        date='14th April 2021'
      />
      <br />
      <Callout>
        Having the knowledge of a subject and actually applying it in real life
        are two very differnt things. We need to focus on the latter.
      </Callout>
      <br />
      <ContentHeading>Introduction</ContentHeading>
      <br />
      <ContentContent>
        Are engineers today an essential part of our society? Are they as
        valuable as lawyers or doctors or politicians? In my opinion, the answer
        is "yes" to all of these questions but, in this case, the explanation is
        more fascinating than the answer itself.
      </ContentContent>
      <br />
      <ContentHeading>Application of first principles</ContentHeading>
      <br />
      <ContentContent>
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
      </ContentContent>
      <br />
      <ContentContent>
        There is a reason why we see engineers in all kinds of professions
        including, and not limited to, stand up comedy, politics, practising law
        and medicine. The application of first principles in solving a problem
        is what engineers are good at, and it helps them excel at whatever
        profession they are in. But, as the great saying goes "with great power
        comes great responsibility".
      </ContentContent>
      <br />
      <ContentHeading>What are engineers busy doing?</ContentHeading>
      <br />
      <ContentContent>
        There are a few engineers trying to solve the problems of landing a
        rover on Mars, curing cancer using machine learning or connecting the
        human population together using the internet. There are a whole bunch of
        engineers working on problems to push the human race forward. But, what
        are the rest of them busy doing? Making money.
      </ContentContent>
      <br />
      <ContentContent>
        Don’t get me wrong, desiring money and working for it is not bad.
        Engineers earn much more money in the early stages of their careers than
        people in any other professions, and I believe they 100% deserve it.
        Today, most of the parents in India want their child to become a
        software engineer or an engineer in general. Ever wondered why? Money.
        They want their child to get rich quickly when they grow up. Notice,
        they don't care about Mars or cancer or human social interactions, all
        they care about is money. And in all fairness, they are right because
        which parent would not want their child to get a good life, but at what
        cost?
      </ContentContent>
      <br />
      <ContentContent>
        Most of the engineers today are self-centred and greedy. All they care
        about is what they are currently working on to (a) satisfy their ego and
        (b) show it off in their resumes and on LinkedIn. They care about how
        much money they are making and/or how much equity they are getting from
        the startup that they have just joined. One of the best problem-solving
        breeds is not thinking about the most crucial problems at all. Even in
        colleges, engineers are taught how to solve algorithmic problems and
        operating system concepts but not how they can be applied in real life
        and how they can improve the world we all are living in. That's the
        problem. Today's engineers are living in a bubble, a bubble that is
        filled with wealth and luxury but almost has nothing to do with the
        outside world. Think I'm wrong? Look at what is happening in the world
        right now, everyone's livelihood has been affected due to the
        Coronavirus pandemic except for software engineers. One may argue that
        the physical world is ineffective to software, but how many tech
        billionaires or even millionaires have donated their wealth to the ones
        who need it in this period of crisis? I'm not talking about socialism,
        I'm talking about textbook humanity.
      </ContentContent>
      <br />
      <ContentHeading>Do something - no matter the scale</ContentHeading>
      <br />
      <ContentContent>
        Engineers have this skill to create something from nothing, software is
        literally something out of nothing - it is intangible. We need to use
        this skill to improve the very world we live in. We need to stop serving
        the privileged by creating things that don't have any effect on the real
        world. I’m not talking about quitting jobs and going full-Gandhi mode,
        but we can at least have a few good side projects where we’re helping
        the ones who actually need our help.
      </ContentContent>
      <br />
      <ContentContent>
        We have great power but we need to be more responsible as well. Blaming
        politicians for everything is not going to solve anything, it will just
        serve more content for the news media. Politicians don’t run a country,
        they are just good at crowdsourcing. We, the people, run a country and
        we are the only ones responsible for improving it.
      </ContentContent>
      <br />
      <ContentContent>Stay humble and dream big!</ContentContent>
    </Container>
  )
}

export default WritingPage
