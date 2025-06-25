import Fastify from "fastify";
import { merge } from "./merge";
import chalk from "chalk";

const fastify = Fastify();

fastify.get("/boards", async (request, reply) => {
  return await merge("example-boards");
});

const port = 3000;

fastify
  .listen({ port })
  .then(() => {
    console.log(
      chalk.green(`Server is running: http://localhost:${port}/boards`)
    );
  })
  .catch((error) => {
    console.error(chalk.red("Error starting server:"), error);
    process.exit(1);
  });
