/// <reference types="vite/client" />

declare module '@originjs/vite-plugin-federation' {
  import type { Plugin } from 'vite'

  interface FederationOptions {
    name: string
    filename: string
    exposes?: Record<string, string>
    remotes?: Record<string, string>
    shared?: Record<string, { singleton?: boolean; requiredVersion?: string }>
    /**
     * Current operating mode
     */
    mode?: string
  }

  export default function federation(options: FederationOptions): Plugin
}
