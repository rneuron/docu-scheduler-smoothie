
/// <reference types="vite/client" />

// Add global function declarations
interface Window {
  createDemoDoctors: () => Promise<number>;
  verifyDemoDoctors: () => Promise<any[]>;
}
