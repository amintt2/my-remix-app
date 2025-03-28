/**
 * Utility to override console.error and filter specific error messages
 */

/**
 * Initializes console error filtering to suppress specific error messages
 */
export function initConsoleErrorFiltering(): void {
  // Save the original console functions
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;
  const originalConsoleLog = console.log;

  // Log that the override is being initialized
  originalConsoleLog.apply(console, ["Initializing console error filtering..."]);

  const filterMessage = "please provide a 'game' argument";

  // Override console.error
  console.error = function(...args: [message?: unknown, ...optionalParams: unknown[]]) {
    // Log the received error message for debugging
    originalConsoleLog.apply(console, ["console.error received:", args[0]]); 

    if (args.length > 0 && 
        typeof args[0] === 'string' && 
        args[0].toLowerCase().includes(filterMessage)) {
      // Log as a regular message instead of an error
      originalConsoleLog.apply(console, args);
      return;
    }
    originalConsoleError.apply(console, args);
  };

  // Override console.warn
  console.warn = function(...args: [message?: unknown, ...optionalParams: unknown[]]) {
    // Log the received warning message for debugging
    originalConsoleLog.apply(console, ["console.warn received:", args[0]]); 

    if (args.length > 0 && 
        typeof args[0] === 'string' && 
        args[0].toLowerCase().includes(filterMessage)) {
      // Log as a regular message instead of a warning
      originalConsoleLog.apply(console, args);
      return;
    }
    originalConsoleWarn.apply(console, args);
  };

  // Override console.log
  console.log = function(...args: [message?: unknown, ...optionalParams: unknown[]]) {
    // Always allow the message to be logged if originally called via console.log
    // (The check for filterMessage is technically redundant here if we always log,
    // but keeping it doesn't hurt and maintains consistency)
    // if (args.length > 0 && 
    //     typeof args[0] === 'string' && 
    //     args[0].toLowerCase().includes(filterMessage)) {
    //   // Ensure it gets logged
    //   originalConsoleLog.apply(console, args);
    //   return;
    // }
    // Let all other log messages pass through
    originalConsoleLog.apply(console, args);
  };
}

// Default export for easier importing
export default { initConsoleErrorFiltering }; 