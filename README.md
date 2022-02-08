# Building a NEAR integration on Zapier

In this article I will walk you through my experience building a NEAR integration on Zapier.
You will see where and how I did my research, including tips on where to find the solutions
for different kinds of problems.

## Overview

Here is a rough outline of the items that will be covered in this article (you can go ahead
and skip any of the parts that seem irrelevant to you):

**Note**: If you are one of the people who just want the short list of takeaways, just skip
to the conclusion at the end. **P.S.** Pro tip, also check out the tips and tricks section.

## Zapier

Zapier is an automation platform, described in their words as:

> Easy automation for busy people. Zapier moves info between your web apps automatically, so you can focus on your most important work. [^1]

[^1]: https://zapier.com/

It lets you connect multiple APIs into a single workflow (which is called a Zap), so it is very convinient for
automating repetetive tasks, or just setting up notifications independent of the API you
are using. These APIs range from Google Sheets, Microsoft Office to Dropbox, Slack and many more.

All of these apps are composed of triggers, searches and creates. These represent the types
of actions that can be performed on those APIs.

### Trigger

Triggers represent actions that read from the API, and instantiate the Zap when they recognize a
change in the response data.
They can read in two ways:

- By polling the data, which is the most common way.
- By subscribing to a webhook on the API, in order to get notified from the API, rather then keep asking for data.

### Search

Searches also represent actions that read from the API, but unlike triggers, they do not poll or listen to data changes,
rather they are fired from other inputs, such as the output of a trigger, another search, a create or user input.

### Create

Creates are actions that, as their name suggests, create new data on the API.
Examples of creates are:

- Writing a new row to a spreadsheet
- Posting a message on a Slack channel
- Creating a contact entry in Google Contacts

## NEAR

NEAR is a new layer 1 blockchain that solves some of the problems existing blockchains have. More specificaly

> NEAR is a [sharded](https://near.org/downloads/Nightshade.pdf), [proof-of-stake](https://en.wikipedia.org/wiki/Proof_of_stake), [layer-one blockchain](https://blockchain-comparison.com/blockchain-protocols) that is simple to use, secure and scalable.[^2]

[^2]: https://near.org/

Like [Polkadot](https://polkadot.network/), [Solana](https://solana.com/) and [Avalanche](https://www.avax.network/) NEAR tries to solve the three main problems of today's popular blockchains:

1. Cost - current blockchains are expensive to use and maintain
2. Low throughput - current blockchains are slow to process transactions and execute smart contracts
3. Hard to scale - current blockchains don't scale well to high traffic

If you want to learn more about NEAR, head over to their [website](https://near.org/), or directly to their [university](https://www.near.university/) to learn about the technology and how to use it.
