/** 
 * This code defines a function that uses the Bing Chat API to send a user's prompt and receive a response. 
 * @module Bing 
*/

import { BingChat } from "bing-chat"

/**
 * @global
 */

let bing = null

/** 
 * Creates a `BingChat` object if hasn't been created before. Require the `BING_COOKIE` environment variable.
 * @function
 * @returns {null }
 */
const initBing = () => {
  if (!process.env.BING_COOKIE) {
    console.log(
      "Bing cookie not found. Please set BING_COOKIE environment variable.\n\nUse Microsoft Edge, navigate to Bing Chat, look at sent cookies in Console/Network and copy it. (only _U is required for authentication)"
    )
    process.exit(1)
  }
  if (!bing) {
    bing = new BingChat({
      cookie: process.env.BING_COOKIE,
    })
  }
}

/**
 * To interact with Bing API.
 * @function
 * @param {function} print - output text to a console or a user interface
 * @param {object} args - access various properties that control how the Bing API is called
 */
export const useBing = async ({ print, args }) => {
  initBing()
  if (!args.quiet) print(`User: ${args.prompt}`.gray)
  let variant
  if (args.model === "bing-creative") variant = "Creative"
  if (args.model === "bing-precise") variant = "Precise"
  else variant = "Balanced"
  const completion = (
    await bing.sendMessage(args.prompt, {
      variant,
    })
  ).text
  if (!args.quiet) print(`\nBing: `)
  print(completion)
  if (completion && !completion.endsWith("\n")) print("\n")
}
