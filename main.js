#! /usr/bin/env node

/** 
 * @file main
 * This JavaScript file sets up a command-line interface (CLI) tool named llm using the yargs library
 * to manage interactions with large language models (LLMs) like GPT from OpenAI.
 * It allows users to execute language model prompts directly from the command line.
*/
import yargs from "yargs"
import { hideBin } from "yargs/helpers"
import "colors"
import { MODELS } from "./constants.js"
import dotenv from "dotenv"
import { relativeDate } from "./utils.js"
import { openai, initOpenai } from "./apis/openai/api.js"
import { useLlm } from "./lib.js"

/**
 * To load environment variables from a .`env` file into `process.env`
 * @function
 */
dotenv.config()

export * from "./lib.js"

// directory of this file
/**
 * Gives the URL of the current module.
 */
let __dirname = new URL(".", import.meta.url).pathname

// if windows
/**
 * If the operating system is windows then modifies the `__dirname` path format specifically for compatibility reasons on Windows systems.
 */
const isWindows = process.platform === "win32"
if (isWindows) {
  // /C:/ -> /c/
  __dirname = __dirname.replace(/^\/([A-Z]):/, (match, p1) => {
    return "/" + p1.toLowerCase()
  })
}

/**
 * Configure and run commands related to interacting with large language models (LLMs).
 * The script allows for extensive customization of model parameters, input methods, and output preferences.
 *
 * @scriptName "llm" - Names the script 'llm' to be used in command line invocation.
 * @command "$0 <prompt>" - The default command to execute when no specific sub-command is provided.
 * @description "Use large language models" - Describes the primary function of the command.
 * @option "model" - Specifies the language model to use. Possible values include names like 'text-davinci-003', 'bing', etc.
 * @option "temperature" - Sets the creativity or randomness level of the output.
 * @option "system" - Provides a system-level context or prompt to the model.
 * @option "max-tokens" - Limits the number of tokens (words/pieces of words) the model generates.
 * @option "file" - Determines if the prompt should be read from a specified file path instead of direct input.
 * @option "quiet" - Controls whether to suppress all output except the completion.
 * @option "verbose" - Enables verbose output during execution, providing more detailed information about the process.
 * @option "plugins" - Enables the use of plugins for processing requests.
 * @option "chain" - Enables the chaining of commands or files for sequential processing.
 * @option "interpret" - Enables an interpreter mode that processes embedded commands within the prompt.
 * @action async (args) => { return await useLlm(args) } - Defines the action to be executed when the command is invoked.
 *                                                       This action utilizes the 'useLlm' function, passing in the parsed arguments.
 */
yargs(hideBin(process.argv))
  .scriptName("llm")
  .command(
    "$0 <prompt>",
    "Use large language models",
    (yargs) => {
      yargs.option("model", {
        describe: "text-davinci-003,bing,...",
        default: process.env.LLM_DEFAULT_MODEL || "gpt-3.5-turbo",
        alias: "m",
      })
      yargs.option("temperature", {
        describe: "temperature",
        default: 0,
        alias: "t",
        number: true,
      })
      yargs.option("system", {
        describe: "system prompt",
        default: "",
        alias: "s",
      })
      yargs.option("max-tokens", {
        describe: "max tokens",
        default: null,
        alias: "T",
      })
      yargs.option("file", {
        describe: "read prompt as ./path/to/file.txt",
        default: false,
        boolean: true,
        alias: "f",
      })
      yargs.option("quiet", {
        describe: "print only the completion",
        default: true,
        boolean: true,
        alias: "q",
      })
      yargs.option("verbose", {
        describe: "verbose output",
        default: false,
        boolean: true,
        alias: "v",
      })
      yargs.option("plugins", {
        describe: "use plugins",
        default: false,
        boolean: true,
        alias: "P",
      })
      yargs.option("chain", {
        describe: "use chaining",
        default: false,
        boolean: true,
        alias: "C",
      })
      yargs.option("interpret", {
        describe: "use intrepreter",
        default: false,
        boolean: true,
        alias: "I",
      })
    },
    async (args) => {
      return await useLlm(args)
    }
  )

  /** 
 * Command to list all models.
 * @command
 * @param {object} yargs - The yargs instance.
 * @param {object} args - The command arguments.
 */
  .command(
    "ls",
    "List all models",
    (yargs) => {},
    async (args) => {
      initOpenai()
      const models = (await openai.listModels()).data.data.sort(
        (a, b) => a.created - b.created
      )

      for (const model in MODELS) {
        if (models.map((e) => e.id).indexOf(model) === -1) {
          models.push({ id: model })
        }
      }

      console.log(
        models
          .map(
            (e) =>
              `${e.id.padEnd(36)} ${e.created ? relativeDate(e.created) : ""}`
          )
          .join("\n")
      )
      console.log(
        "\nnote: plus any text-generation model from huggingface.co/models".gray
      )
    }
  )
  
  /** 
  Parse the command-line arguments and execute the command based on the input.
  @type {method}
 */
  .parse()
