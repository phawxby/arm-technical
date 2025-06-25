# Arm Technical test

https://gist.github.com/acabarbaye/ef96f6bfae5c0d350891143daa3e1dba

## Requirements

1. [Node 22](https://nodejs.org/en/download)
2. Make sure to first install dependencies `npm install`

## Running CLI

Run `npm run merge`. You should be presented with a CLI helper indicating what is needed for the program to run.

As an example `npm run merge example-boards output.json` will read the `example-boards` directory and output the result to `output.json`.

## Running HTTP server

Run `npm run server`. The server will start and be accessible on `http://localhost:3000/boards`.

## Running Tests

Run `npm run test` will execute the test suite in vitest.

# Resources

1. Most of the resources required for this were just the dependency docs.
   1. Yargs: https://github.com/yargs/yargs/blob/HEAD/docs/api.md
   2. Fastify: https://fastify.dev/
   3. Zod and vitest are 2 libraries I know inside and out, no consulting needed.
2. CircleCI reference guide: https://circleci.com/docs/configuration-reference/
3. Copilot was on but most of the time it was unhelpful.

# Extensions

1. CircleCI is implemented and working on Mac, Linux and Docker however I was unable to get this working on windows due to a bug somewhere, possibly in build config or in a dependency.
2. It would make sense to have the server as part of the CLI tool. `npm start server`.
3. While you cannot fully get away from having to install node to run this you can make it less painful. I have previously published these kinds of packages to a package registry so they can be installed globally and be used as a global function.
4. Nothing was specified to handle deduplication, that might be a sensible addition for the future.
5. More tests would be good.
