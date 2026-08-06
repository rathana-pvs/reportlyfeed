export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const originalConsoleError = console.error
    console.error = (...args: any[]) => {
      const msg = typeof args[0] === 'string' ? args[0] : (args[0]?.message || '')
      if (msg.includes('getFromImportMap') || (typeof args[1] === 'string' && args[1].includes('getFromImportMap'))) {
        return
      }
      originalConsoleError(...args)
    }
  }
}
