/**
 * This JavaScript file defines functions to initialize and interact with the OpenAI API using environment-set API keys.
 *  @module OpenAI 
 */

import { OpenAI } from "openai"

/**
 * Used to interact with the OpenAI API.
 * It is initially set to `null` and later is initialized with the API key and organization ID (if available).
 * @type {OpenAI | null}
 */
export let openai = null

/**
 * Initialize `openai` instance if it's `null`.
 * Require `OPENAI_API_KEY` environment variable.
 * @function initOpenai
 * @throws {Error} Shows an error if it couldn't find an API key
 */
export const initOpenai = () => {
  if (!process.env.OPENAI_API_KEY) {
    console.log(
      "OpenAI API key not found. Please set OPENAI_API_KEY environment variable.\n\nhttps://platform.openai.com/account/api-keys"
    )
    process.exit(1)
  }

  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      organizationId: process.env.OPENAI_ORGANIZATION_ID || null,
    })
  }
}

/**
 * Integrates API setup, user interaction, and API communication to fetch and display AI-generated text based on user inputs.
 * Generating general text completions based on a given prompt. 
 * @function
 * @param {Object} config - The configuration object containing print function and arguments.
 * @param {Function} config.print - The function to print output to the console.
 * @param {Object} config.args - The arguments for the API request and UI behavior.
 * @param {string} config.args.prompt - The input prompt to generate text completion.
 * @param {string} config.args.model - The model used for generating the text completion.
 * @param {number} config.args ["max-tokens"] - The maximum number of tokens to generate.
 * @param {number} config.args.temperature - Controls the randomness of the output.
 * @param {boolean} [config.args.quiet=false] - If true, suppresses printing the prompt and extra spaces.
 * @returns {Promise<string>} Returns a promise that resolves to the generated text completion.
 */
export const useOpenai = async ({ print, args }) => {
  initOpenai()

  if (!args.quiet) print(args.prompt.gray)
  if (!args.quiet) print(" ")

  const completion = (
    await openai.completions.create(
      {
        model: args.model,
        prompt: args.prompt,
        max_tokens: args["max-tokens"],
        temperature: args.temperature,
      },
      {
        timeout: 1000 * 60 * 60,
      }
    )
  ).choices[0].text
  print(completion)
  if (completion && !completion.endsWith("\n")) print("\n")
  return completion
}

/**
 * To interact with the OpenAI Chat API for generating chat completions.
 * This function is configured to handle a conversation with context.
 * @function
 * @param {Object} config - Configuration object containing the print function and arguments for the API call.
 * @param {Function} config.print - Function used to print output to the console.
 * @param {Object} config.args - Arguments for controlling the output and API parameters.
 * @param {string} config.args.model - The model identifier used for generating the chat completion.
 * @param {number} config.args ["max-tokens"] - The maximum number of tokens to generate for the completion.
 * @param {number} config.args.temperature - The randomness level in the completion generation.
 * @param {string} config.args.system - System context used for initializing the chat scenario.
 * @param {string} config.args.prompt - User input prompt to which the model responds.
 * @param {boolean} [config.args.quiet=false] - If true, suppresses all console outputs except the completion.
 * @returns {Promise<string>} A promise that resolves with the chat completion text. 
 */
export const useOpenaiChat = async ({ print, args }) => {
  initOpenai()
  if (!args.quiet) print(`System: ${args.system}\n`.gray)
  if (!args.quiet) print(`User: ${args.prompt}`.gray)
  const completion = (
    await openai.chat.completions.create(
      {
        model: args.model,
        max_tokens: args["max-tokens"],
        temperature: args.temperature,
        messages: [
          {
            role: "system",
            content: args.system,
          },
          {
            role: "user",
            content: args.prompt,
          },
        ],
      },
      {
        timeout: 1000 * 60 * 60,
      }
    )
  ).choices[0].message.content
  if (!args.quiet) print("\nAssistant: ")
  print(completion)
  // add \n if missing
  if (completion && !completion.endsWith("\n")) print("\n")
  return completion
}
