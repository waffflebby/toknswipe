/**
 * Logger utility for development and production
 * Set DEBUG=true in environment to enable detailed logging
 */

const isDev = process.env.NODE_ENV === 'development'
const DEBUG = process.env.DEBUG === 'true' || isDev

export const logger = {
  log: (prefix: string, ...args: any[]) => {
    if (DEBUG) {
      console.log(`[${prefix}]`, ...args)
    }
  },

  error: (prefix: string, ...args: any[]) => {
    console.error(`[${prefix}]`, ...args)
  },

  warn: (prefix: string, ...args: any[]) => {
    if (DEBUG) {
      console.warn(`[${prefix}]`, ...args)
    }
  },

  debug: (prefix: string, ...args: any[]) => {
    if (DEBUG) {
      console.debug(`[${prefix}]`, ...args)
    }
  },
}
