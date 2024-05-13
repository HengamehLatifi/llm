/** 
 * * Defines utility functions aimed at formatting and handling date calculations, securing shell commands, and managing file paths.
 * @file utils 
 */

/**
 * Calculates the time elapsed from a given date to the current date and formats this difference as a relative time string, such as `5 days ago`.
 * @function <relativeDate>
 * @param {Date | number} date
 * @returns {string}
 */
export const relativeDate = (date) => {
  if (typeof date !== "object") {
    date = parseInt(date) * 1000
    date = new Date(date)
  }
  const diff = new Date() - date
  const day = 1000 * 60 * 60 * 24
  const hour = 1000 * 60 * 60
  const minute = 1000 * 60
  if (diff / day > 1) {
    return `${Math.floor(diff / day)} days ago`
  }
  if (diff / hour > 1) {
    return `${Math.floor(diff / hour)} hours ago`
  }
  if (diff / minute > 1) {
    return `${Math.floor(diff / minute)} minutes ago`
  }
  return "just now"
}

/**
 * Takes a string command (cmd) and escapes potentially dangerous characters 
 * @function
 * @param {string} cmd 
 * @returns {string}
 */
export const escapeShell = (cmd) => {
  return cmd.replace(/(["'$`\\])/g, "\\$1")
}

/**
 * Takes two path strings as inputs, and concatenates them into a single path. 
 * It ensures that there is exactly one slash between two paths.
 * @function
 * @param {string} path1 
 * @param {string} path2 
 * @returns {string}
 */
export const concatPath = (path1, path2) => {
  let newPath = path1.replace(/\/$/, "") + "/" + path2.replace(/^\//, "")
  return compatiblePath(newPath)
}

/**
 * Ensures that file paths are compatible with the operating system's expected path formatting.
 * @function
 * @param {string} path 
 * @returns {string}
 */
export const compatiblePath = (path) => {
  if (process.platform === "win32") {
    return path.replace(/\//g, "\\")
  }
  return path
}
