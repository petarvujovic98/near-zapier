# Building a NEAR integration on Zapier

In this article I will walk you through my experience building a NEAR integration on Zapier.
You will see where and how I did my research, including tips on where to find the solutions
for different kinds of problems.

If you want to check out my code while reading, you can find the source code on
[GitHub](https://github.com/petarvujovic98/near-zapier).

You can also check out my YouTube playlist of the daily progress videos for this process
[here](https://youtube.com/playlist?list=PL3ZFE2cBGD2MylJ-87DQPQJUjRSNiud5r).

## Overview

Here is a rough outline of the items that will be covered in this article (you can go ahead
and skip any of the parts that seem irrelevant to you):

**Note**: If you are one of the people who just want the short list of takeaways, just skip
to the conclusion at the end. **P.S.** Pro tip, also check out the tooling section.

- [Building a NEAR integration on Zapier](#building-a-near-integration-on-zapier)
  - [Overview](#overview)
  - [Zapier](#zapier)
    - [Trigger](#trigger)
    - [Search](#search)
    - [Create](#create)
  - [NEAR](#near)
  - [Zapier custom apps](#zapier-custom-apps)
    - [Tooling and environment set up](#tooling-and-environment-set-up)
      - [Node version](#node-version)
      - [CLI](#cli)
      - [Typescript](#typescript)
      - [ESLint and Prettier](#eslint-and-prettier)
      - [Other dependencies](#other-dependencies)
    - [Development](#development)
      - [NEAR docs](#near-docs)
      - [Input fields](#input-fields)
      - [Resource type definitions](#resource-type-definitions)
      - [Action logic](#action-logic)
      - [Testing](#testing)
      - [Documentation and samples](#documentation-and-samples)
      - [Bringing it all together](#bringing-it-all-together)
  - [Wrap up](#wrap-up)

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

#### Node version

At the time of writing the latest long term support, LTS for short, version of Node.js is
v16, but the version that AWS Lambda is currently using is v14 so this forces you to develop
against that environment in order to be sure that if it works on that runtime, it will most
likely work on their runtime as well.

In order to configure this you should create a file called `.nvmrc` in the root directory
of the project in order to let `nvm` or `fnm` or any other Node.js version manager you like.
I prefer to use [`fnm`](https://github.com/Schniz/fnm) since it is a new alternative for
[`nvm`](https://github.com/nvm-sh/nvm) and is written in [Rust](https://www.rust-lang.org).

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

I chose to use Typescript instead of JavaScript because I prefer having type safety and
autocompletions while writing my code. I would suggest anyone thinking about using it to
go ahead and dive into it, all my experiences have with Typescript have been positive.

Since I used the Tyepescript template to generate the initial project, I was left with a
basic `tsconfig.json` (which is a configuration file for the Typescript compiler, read more about
it [here](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)), basic
[Jest](https://jestjs.io) configuration and some initial file structure.

**NOTE**: You can check out what the template looks like [here](https://github.com/zapier/zapier-platform/tree/master/example-apps/typescript).

This is what the initial `tsconfig.json` looks like:

```json
{
  "compilerOptions": {
    "target": "es2019",
    "module": "commonjs",
    "moduleResolution": "node",
    "lib": ["esnext"],
    "outDir": "./lib",
    "rootDir": "./src",
    "strict": true
  }
}
```

The `package.json` looked like this:

```json
{
  "name": "typescript",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "npm run build && jest --testTimeout 10000 --rootDir ./lib/test",
    "build": "npm run clean && tsc",
    "clean": "rimraf ./lib ./build",
    "watch": "npm run clean && tsc --watch",
    "_zapier-build": "npm run build"
  },
  "dependencies": {
    "zapier-platform-core": "11.2.0"
  },
  "devDependencies": {
    "jest": "^25.5.3",
    "@types/jest": "^25.2.1",
    "@types/node": "^13.13.5",
    "rimraf": "^3.0.2",
    "typescript": "^3.8.3"
  },
  "private": true
}
```

You can see that the setup is pretty minimal and a bit outdated, especially in terms of
testing configuration, as it doesn't separate building the library from running tests.

In order to fix that I created separate `tsconfig.spec.json` and `tsconfig.lib.json`
configuration files for the tests and the library respectively.
The resulting Typescript configuration looks like this:

```json
// tsconfig.spec.json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "../../dist/out-tsc",
    "module": "commonjs",
    "types": ["jest", "node"]
  },
  "include": [
    "**/*.test.ts",
    "**/*.spec.ts",
    "**/*.test.tsx",
    "**/*.spec.tsx",
    "**/*.test.js",
    "**/*.spec.js",
    "**/*.test.jsx",
    "**/*.spec.jsx",
    "**/*.d.ts"
  ]
}
```

```json
// tsconfig.lib.json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "module": "commonjs",
    "outDir": "./lib",
    "declaration": true,
    "types": ["node"]
  },
  "exclude": ["**/*.spec.ts", "**/*.test.ts"],
  "include": ["src/**/*.ts"]
}
```

```json
// tsconfig.json
{
  "files": [],
  "include": [],
  "references": [
    {
      "path": "./tsconfig.lib.json"
    },
    {
      "path": "./tsconfig.spec.json"
    }
  ],
  "compilerOptions": {
    "target": "ES2019",
    "module": "CommonJS",
    "moduleResolution": "node",
    "lib": ["ESNext"],
    "rootDir": "./src",
    "resolveJsonModule": true,
    "esModuleInterop": true
  },
  "exclude": ["node_modules"]
}
```

And for testing I added [`ts-jest`](https://kulshekhar.github.io/ts-jest) so that I don't
have to build the library (nor tests) every time I run `npm test`. It can set up a basic
configuration for you, by running the following command:

```shell
npx ts-jest config:init
```

This will set up testing for you so that you don't have to do anything else, unless you
want to ofcourse.

The updated `package.json` looks like this:

```json
{
  "name": "near-zapier",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "jest",
    "build": "npm run clean && tsc --project ./tsconfig.lib.json",
    "clean": "rimraf ./lib ./build",
    "watch": "npm run clean && tsc --watch",
    "validate": "npm run build && zapier validate",
    "test:watch": "jest --watchAll"
  },
  "dependencies": {
    "zapier-platform-core": "11.2.0"
  },
  "devDependencies": {
    "@types/jest": "^27.4.0",
    "@types/node": "^14.18.9",
    "jest": "^27.4.7",
    "rimraf": "^3.0.2",
    "ts-jest": "^27.1.3",
    "typescript": "^4.5.5"
  },
  "private": false
}
```

As you can see I updated the package versions to the latest versions supported by the platform.

#### ESLint and Prettier

I like to set up my codebase with the same style and conventions for all my projects, so I
start with [Prettier](https://prettier.io) and [ESLint](https://eslint.org) with a few plugins.

I like my imports ordered and since I use Typescript I want all the linting power that comes
with it so I add the following libraries:

- [@typescript-eslint/eslint-plugin](https://www.npmjs.com/package/@typescript-eslint/eslint-plugin) for enabling ESLint to lint Typescript
- [@typescript-eslint/parser](https://www.npmjs.com/package/@typescript-eslint/parser) for providing ESLint with the proper parser for Typescript
- [eslint-config-prettier](https://www.npmjs.com/package/eslint-config-prettier) for hooking up Prettier with ESLint
- [eslint-plugin-import](https://www.npmjs.com/package/eslint-plugin-import) for import ordering
- [eslint-import-resolver-typescript](https://www.npmjs.com/package/eslint-import-resolver-typescript) for providing the import plugin with proper context for Typescript
- [eslint-plugin-node](https://www.npmjs.com/package/eslint-plugin-node) for Node.js specific rules

#### Other dependencies

Since I am developing an integration for NEAR I need to install the libraries that I will
be using, namely:

- [near-api-js](https://www.npmjs.com/package/near-api-js) the official API client for working with NEAR in a JavaScript context
- [near-contract-parser](https://www.npmjs.com/package/near-contract-parser) a library for parsing and discovering interfaces from NEAR smart contracts
- [bn.js](https://www.npmjs.com/package/bn.js) a library for working with big numbers (and the types from [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) - [@types/bn.js](https://www.npmjs.com/package/@types/bn.js))
- [type-fest](https://www.npmjs.com/package/type-fest) which is just a collection of utility types which I find useful

### Development

The process of developing was comprised of the following main steps:

- Check the [NEAR RPC API](https://docs.near.org/docs/api/rpc) for the endpoint you want to integrate
- Create the input fields for the parameters of that endpoint
- Create type definitions for the resources that are goint to be used if they don't already exist
- Develop the logic to perform the action and return the result
- Write the tests for the integrated logic
- Add documentation and samples for the endpoint

#### NEAR docs

This step is quite self explanatory, and the docs are quite good, so you can just read through
anything you want over there. But as a short summary, the RPC endpoints are divided in several
categories based on the logic that they perform.

For example checking the state of accounts or contracts is in the Accounts/Contracts category.

#### Input fields

Input fields represent the definitions of inputs that are going to be displayed to the user
whent setting up a particular integration. They follow a certain schema, so the CLI will
check for compliance before publishing the integration, this however is in my opinion a
rather slow feedback loop, so what I decided to do is to go through their schema definitions
and create Typescript type definitions that mirror the schema structure.

This way I can get autocomplete and error messages if I use the wrong combination of values
for the field definition, or if I am simply missing some mandatory info.

An input field definition with the type definitions looks something like this:

```typescript
/** An account ID input field */
export const AccountIdField: Field = {
  key: "accountId",
  label: "Account ID",
  helpText: "The ID of the account.",
  type: FieldType.STRING,
  placeholder: "petarvujovic.testnet",
};
```

where `FieldType` is an enum that I defined based on their allowed types:

```typescript
export enum FieldType {
  STRING = "string",
  TEXT = "text",
  INTEGER = "integer",
  NUMBER = "number",
  BOOLEAN = "boolean",
  DATETIME = "datetime",
  FILE = "file",
  PASSWORD = "password",
  COPY = "copy",
  CODE = "code",
}
```

#### Resource type definitions

Since I want to correctly use the input fields, I want to supply the generic `Bundle` object
with some type information in order to make me use the correct parameter names when working
with the input data.

For example for the `AccountIdField` I created an interface that looks like this:

```typescript
/** An interface that includes the account ID. For use with Bundle object */
export interface WithAccountId {
  accountId: string;
}
```

Then I can compose interfaces that extend several of these helper interfaces to create useful
objects like the following:

```typescript
export interface ViewAccountInput
  extends WithNetworkSelection,
    WithAccountId,
    WithBlockIDOrFinality {}
```

**Note**: The `WithNetworkSelection` and `WithBlockIDOrFinality` interfaces are the two most
most common ones. If you want to see their source code you can check out my repository
on [GitHub](https://github.com/petarvujovic98/near-zapier).

Apart from these types related to the users' input, I also created the types for the output
of these actions, this way not only do I force myself to return what is expected, but I
also force myself to provide correctly typed result samples.
This looks something like the following:

```typescript
export interface ViewAccountResult extends AccountView, OutputItem {}
```

Where the `AccountView` interfaces is imported from the `near-api-js` library and the `OutputItem`
is just an interface with an `id` field because Zapier expects it in the output.

Since all of this is a bit separated (samples, input fields, input types, output types) I
created some helper functions for creating these Zapier actions. They are just identity functions,
but since they are typed, they force the developer (me) to provide the correct input:

```typescript
/**
 * Helper function to create a search operation.
 *
 * @param  {Search} definition The search definition.
 * @returns Search
 */
export function createSearch<
  Input = unknown,
  Output extends OutputItem = OutputItem
>(definition: Search<Input, Output>): Search<Input, Output> {
  return definition;
}
```

You might be wondering what the `Search` type is and why it is generic... Short answer,
it is a type definition based on the `Search` schema on Zapier and since the input and output
is arbitrary meaning it changes from action to action, I made it generic to generate a
different type for each action.

Now this is what the `Search` type looks like:

```typescript
** How will Zapier search for existing objects? */
export interface SearchHidden<
  Input = unknown,
  Output extends OutputItem = OutputItem
> {
  /** A key to uniquely identify this search. */
  key: string;
  /** A noun for this search that completes the sentence "finds a specific XXX". */
  noun: string;
  /** Configures the UI for this search. */
  display: BasicDisplayHidden;
  /** Powers the functionality for this search. */
  operation: BasicActionOperation<Input, Output>;
}

/** How will Zapier search for existing objects? */
export interface SearchVisible<
  Input = unknown,
  Output extends OutputItem = OutputItem
> {
  /** A key to uniquely identify this search. */
  key: string;
  /** A noun for this search that completes the sentence "finds a specific XXX". */
  noun: string;
  /** Configures the UI for this search. */
  display: BasicDisplayVisible;
  /** Powers the functionality for this search. */
  operation: BasicActionOperation<Input, Output>;
}

/** How will Zapier get notified of new objects? */
export type Search<Input = unknown, Output extends OutputItem = OutputItem> =
  | SearchHidden<Input, Output>
  | SearchVisible<Input, Output>;
```

#### Action logic

This is the most important part of this process, namely writing the logic of the action.

Here you use the input that is provided to the action by the user (or another action) and
perform a call, or series of calls, to the API - in my case NEAR RPC API.

Most of the endpoints were just basic RPC calls using the `near-api-js` `JsonRpcProvider`,
and some of them were a bit more complex, like parsing the contract interfaces and sending
signed transactions using the `near-api-js` client.

Here is what the logic of the `ViewAccount` action looks like:

```typescript
export const perform = async (
  z: ZObject,
  { inputData }: Bundle<ViewAccountInput>
): Promise<Array<ViewAccountResult>> => {
  const rpc = new providers.JsonRpcProvider({ url: getNetwork(inputData) });

  z.console.log(
    `Getting account with input data: ${JSON.stringify(inputData)}`
  );

  const accountView = await rpc.query<AccountView>({
    request_type: "view_account",
    account_id: inputData.accountId,
    ...getBlockIDOrFinalityForQuery(inputData),
  });

  z.console.log("Got account successfully");

  return [{ id: new Date().toISOString(), ...accountView }];
};
```

Here we have some straight forward code, format the input data into what we need, log before
and after performing the action, perform the RPC call and return the result.
You might find the `id: new Date().toISOString()` part a bit wierd, I do too, but it is there
because Zapier needs your API to return an ID for each result, which in our case is meaningless.

#### Testing

You can see that there is a lot of involvement from the Zapier library, from the `ZObject`,
input `Bundle` and the execution context itself, in order to test the action properly we
need to set up an adequate environment.

The Zapier SDK provides us with a helper function that sets up the context and bootstraps
our App to make sending requests easier. After that we just need to pass the function reference
to the environment, along with the input (not the `ZObject` as this is provided by the SDK setup)
and voila we performed a call just like we would if we were running a Zap.

Here is what this setup comes down to:

```typescript
let appTester: ReturnType<typeof createAppTester>;
let perform: PureFunctionTester<ViewAccountInput, ViewAccountResult>;

beforeEach(() => {
  appTester = createAppTester(App);
  tools.env.inject();
  perform = (input) =>
    appTester(
      App.searches[View.key].operation.perform as typeof viewPerform,
      input
    );
});
```

The `PureFunctionTester` type is a helper definition I created for typeing the `perform` operation
in tests, since the `perform` in the actual action is a bit different, it expects the `ZObject` as the
first parameter.

#### Documentation and samples

As I mentioned before, I created a few helper functions to properly check sample validity,
and not to forget any key descriptions or labels, so this is what it looks like when writing
them into the action:

```typescript
export default createSearch<ViewAccountInput, ViewAccountResult>({
  key: "viewAccount",
  noun: "View Account",
  display: {
    label: "View Account",
    description: "Returns basic account information.",
  },
  operation: {
    perform,
    inputFields: [NetworkSelectField, BlockIDOrFinalityField, AccountIdField],
    sample: {
      id: "1",
      amount: "399992611103597728750000000",
      locked: "0",
      code_hash: "11111111111111111111111111111111",
      storage_usage: 642,
      storage_paid_at: 0,
      block_height: 17795474,
      block_hash: "9MjpcnwW3TSdzGweNfPbkx8M74q1XzUcT1PAN8G5bNDz",
    },
  },
});
```

#### Bringing it all together

So all of these components represent what you need to create an action, and this is how it
looks:

```typescript
import { providers } from "near-api-js";
import { AccountView } from "near-api-js/lib/providers/provider";
import { Bundle, ZObject } from "zapier-platform-core";

import { OutputItem, createSearch } from "../../../types";
import {
  AccountIdField,
  WithAccountId,
  NetworkSelectField,
  WithNetworkSelection,
  getNetwork,
  WithBlockIDOrFinality,
  getBlockIDOrFinalityForQuery,
  BlockIDOrFinalityField,
} from "../../common";

export interface ViewAccountInput
  extends WithNetworkSelection,
    WithAccountId,
    WithBlockIDOrFinality {}

export interface ViewAccountResult extends AccountView, OutputItem {}

export const perform = async (
  z: ZObject,
  { inputData }: Bundle<ViewAccountInput>
): Promise<Array<ViewAccountResult>> => {
  const rpc = new providers.JsonRpcProvider({ url: getNetwork(inputData) });

  z.console.log(
    `Getting account with input data: ${JSON.stringify(inputData)}`
  );

  const accountView = await rpc.query<AccountView>({
    request_type: "view_account",
    account_id: inputData.accountId,
    ...getBlockIDOrFinalityForQuery(inputData),
  });

  z.console.log("Got account successfully");

  return [{ id: new Date().toISOString(), ...accountView }];
};

export default createSearch<ViewAccountInput, ViewAccountResult>({
  key: "viewAccount",
  noun: "View Account",
  display: {
    label: "View Account",
    description: "Returns basic account information.",
  },
  operation: {
    perform,
    inputFields: [NetworkSelectField, BlockIDOrFinalityField, AccountIdField],
    sample: {
      id: "1",
      amount: "399992611103597728750000000",
      locked: "0",
      code_hash: "11111111111111111111111111111111",
      storage_usage: 642,
      storage_paid_at: 0,
      block_height: 17795474,
      block_hash: "9MjpcnwW3TSdzGweNfPbkx8M74q1XzUcT1PAN8G5bNDz",
    },
  },
});
```

## Wrap up

Overall the process of developing an integration for Zapier was quite enjoyable, a bit of
repetetive work here and there, but not too bad. Their approach to createing integrations
is quite adaptable since they allow you to use pretty much anything that can run on the
serverless environment (AWS Lambda to be exact).

Their documentation is not as eye opening as I would have liked. And when I say eye opening
I mean that there were still some nuances left for me to dig into, whether through their
codebase or by trying things out, instead of them just straight up explaining what certain
things do. For example I didn't realise that `Triggers` are the only actions that can be
used to start a Zap, yes their name implies that they _trigger_ a Zap but nowhere does it
say that it's not allowed for `Searches` to do that too. That might just be me being used
to how other platforms work (_cough, cough_ Integromat _cough, cough_).

Another thing is that I wish they provided the functionality that I created manually out of
the box, meaning providing you with type definitions for fields, functions and actions. I
found the help of those type definitions quite useful, even though they do not convey the
whole schema validity or restrictions, they do enough to speed up the process.

The NEAR side of things was mostly good in terms of the RPC API, but the client documentation
was not as comprehensive as I thought it should be. The [quick reference](https://docs.near.org/docs/api/naj-quick-reference)
and [cookbook](https://docs.near.org/docs/api/naj-cookbook) provided offer some good
information and example use cases, but for anything outside of that you are left to
yourself. The [typedocs](https://near.github.io/near-api-js) give you explanations of the
library structure and they tell you the _what_ and the _how_ of the functionalities, but
they don't show you usage examples and they don't make all of the functionality easily
discoverable. So some of the use cases I had required me to jump between the typedocs, the
RPC docs and the source code of the library, which I didn't find difficult but do think is
not the ideal user experience especially for people just getting started with NEAR. Ideally
everything should be documented in one place for ease of readability, understanding and
discoverability.

All in all I can say that the integration process was definitely not boring, I had fun
developing and learning the platform and I believe anyone with prior experience with either
platform could easily do the same in no time. I hope that Zapier integrates some of the
features that I talked about eariler, and I'm sure that the NEAR docs will only get better.
