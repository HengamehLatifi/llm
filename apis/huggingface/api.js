/** 
 * 
 * This module defines a setup in JavaScript to execute shell commands and interact with a Python script for using a Hugging Face machine learning models. 
 * @module HuggingFace 
 */




import child_process from "child_process"
import { promisify } from "util"

/**
 * Executes a shell command and returns a promise that resolves with the result of the command.
 * This function is a promisified version of `child_process.exec`.
 * @param {string} command - The shell command to execute.
 * @param {Object} [options] - Optional settings that customize the child process's behavior.
 * @returns {Promise<{stdout: string, stderr: string}>} -A promise with an object containing the command's output (`stdout`) and errors (`stderr`).
 */
const execPromise = promisify(child_process.exec)
import { escapeShell, concatPath } from "../../utils.js"

// directory of this file
/**
 * Gets the directory path of the current module.
 */
let __dirname = new URL(".", import.meta.url).pathname

// if windows
/**
 *  Checks if the code is running on a Windows operating system.
 * @type {boolean}
 */
const isWindows = process.platform === "win32"    
if (isWindows) {
  // /C:/ -> /c/

/**
 * Normalizes the Windows drive letter in a file path to lowercase for case-sensitive environments.
 * @param {string} `__dirname`
 * @returns {string}
 */
  __dirname = __dirname.replace(/^\/([A-Z]):/, (match, p1) => {
    return "/" + p1.toLowerCase()
  })
}

/**
 * Interact with a Hugging Face model by invoking a Python script.
 * @function
 * @param {Object} options - The options for the function.
 * @param {function} options.print - To print output to the console.
 * @param {Object} options.args - Arguments for the function execution:
 *   @param {boolean} options.args.quiet - If true, suppresses print output.
 *   @param {string} options.args.model - The Hugging Face model identifier.
 *   @param {string} options.args.prompt - The text prompt to send to the model.
 * @returns {Promise<string>} A promise that resolves to the Python script's output.
 */
export const useHuggingface = async ({ print, args }) => {
  if (!args.quiet) print(args.prompt.gray)
  try {
    const { stdout } = await execPromise(
      `python ${concatPath(
        __dirname,
        "/models/huggingface/use.py"
      )} --model "${escapeShell(args.model)}" --prompt "${escapeShell(
        args.prompt
      )}"`,
      {
        cwd: __dirname,
        encoding: "utf8",
      }
    )
    process.stdout.write(stdout)
    return stdout
  } catch (error) {
    console.error(`Error: ${error.message}`)
    process.exit(1)
  }
}
