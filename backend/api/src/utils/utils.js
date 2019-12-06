import fs from "fs";


/**
 * Removes a file from the filesystem.
 *
 * @param {string} fileUrl - The file url.
 */
export function removeFile(fileUrl) { try { fs.unlinkSync(fileUrl) } catch (e) { console.error(e) } }
