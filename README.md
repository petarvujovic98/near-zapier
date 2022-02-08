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

## Zapier custom apps

Zapier offers a vast amount of API integrations that you can use for your automation needs,
but there might be something that you need that is not available.

The solution is to create a custom integration for your API which will be suitable for your
workflow.

These custom integrations can be built in one of two ways:

- Using the [Zapier SDK](https://www.npmjs.com/package/zapier-platform-core) and writing custom [Node.js](https://nodejs.dev) code
- Using their UI builder on the developer platform

Since what I am doing requires a bit more configuration and customization than the UI builder provides,
I am building the NEAR integration with the SDK.

Any way you choose, a good thing to know is that any logic you implement will be executed
on AWS Lambda functions, which you can find out about [here](https://aws.amazon.com/lambda).
AWS Lambda functions are serverless functions meaning they are not tied to a specific server
and are very short lived, you can think of them as regular functions being performed on some
computer (virtual machine to be more specific) somewhere in the cloud. The downside to this
is you cannot store permanent data on those functions since each time they are called they
will be fully discarded from memory, and they do not have access to the machines they are
being run on (besides loading all the library files they are using).

### Tooling and environment set up

#### CLI

The [Zapier CLI](https://www.npmjs.com/package/zapier-platform-cli) is the tool you will
need to have installed globally in order to bootstrap, build, package and deploy your integration.
You can install it with the following command:

```shell
npm install -g zapier-platform-cli
```

After installation you will have to login to your Zapier account using the following command:

```shell
zapier login
```

If you do not have an account yet, the command will guide you through the process of creating one.
If you want to find out a bit more about their accounts you can do so [here](https://zapier.com).

To start your project you can use the `zapier init` command to scaffold the minimum boilerplate
needed to get you started.

**PRO TIP**: You can pass the `--template` flag with the name of the template to start off with
something more than just the basic configuration. I chose the Typescript template.

#### Typescript
