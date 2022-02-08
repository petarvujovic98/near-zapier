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
