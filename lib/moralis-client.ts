// Moralis SDK initialization and utilities
let isInitialized = false

export async function initMoralis(): Promise<void> {
  if (isInitialized) {
    return
  }
  
  // Moralis SDK initialization would go here if needed
  // For now, we're using direct REST API calls instead of the SDK
  isInitialized = true
}

// Export a dummy Moralis object for compatibility
export const Moralis = {
  initialize: initMoralis,
}
