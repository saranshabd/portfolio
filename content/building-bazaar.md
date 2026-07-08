# Building Bazaar

9th July 2026

I built Bazaar, a small project that creates AI focus groups for video reviews.

The user uploads a video, describes the kind of audience they want feedback from, and adds a few survey questions. Bazaar then creates a panel of AI personas matching that audience. Each persona watches the video, answers the questions, leaves timestamped notes, and gives scored reactions.

## Motivation

The idea came from how TV pilots are tested with focus groups before studios decide whether to put real money behind them. It makes sense. Before spending a ridiculous amount of money, you want some signal from the kind of people who might actually watch the thing.

The problem is that real focus groups are expensive and slow. LLMs, on the other hand, have read a stupid amount of human opinions, criticism, discussions, and reactions. That does not make them a replacement for real people, but it does make them interesting for a first pass.

The question I wanted to answer was simple: can AI personas be good enough to give an early signal before you go and find actual humans?

## What The Project Does

The workflow is pretty simple.

First, the user uploads an MP4 video. Then they describe the focus group they want. It could be young adults who like prestige TV dramas, STEM students reviewing a lecture, or casual comedy viewers. They can also add the exact questions they want answered.

The agent turns that prompt into a review brief, creates a set of distinct personas, and then asks each persona to review the video independently. The final output includes the personas, the review guidance, answers to each question, timestamped annotations, and aggregate scores.

The timestamped annotations are the best part. Summaries are fine, but being able to jump to the exact moment that triggered a reaction is much more useful.

## What I Learned

The main thing I learned was that getting the system working is only half the problem.

The pipeline itself was straightforward: upload the video, cache it, create personas, fan out review calls, stream state back to the UI, and render the result. The annoying part was prompting. The quality of the output depends a lot on how well the prompts define the personas, constrain the review behaviour, and force the model to stay grounded in the video.

Generic prompts give generic reviews. Better prompts give more distinct personas, more useful annotations, and feedback that sounds less like a LinkedIn post.

## What I Built

By the end, the project worked end to end. A user could upload a video, describe a target focus group, and get structured feedback from multiple AI personas. The UI showed the generated personas, review guidance, per-persona answers, aggregate scores, and clickable timeline annotations.

The setup is decent. The agent architecture gives me a good base to keep improving the prompts, evaluation, and product behaviour. With better prompting, I think the results can become much stronger.

Bazaar is obviously not a replacement for real focus groups. But it is a fast way to get an early read on how different kinds of viewers might react before spending time and money on real user research.

GitHub: https://github.com/saranshabd/bazaar
