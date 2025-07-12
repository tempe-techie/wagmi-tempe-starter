import { http, cookieStorage, createConfig, createStorage } from '@wagmi/vue'
import { mainnet, optimism, base, arbitrum } from '@wagmi/vue/chains'
import { injected, metaMask, walletConnect } from '@wagmi/vue/connectors'

export const config = createConfig({
  chains: [mainnet, optimism, base, arbitrum],
  connectors: [
    injected(),
    metaMask(),
    walletConnect({
      projectId: import.meta.env.VITE_WC_PROJECT_ID,
    }),
  ],
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  transports: {
    [mainnet.id]: http(),
    [optimism.id]: http(),
    [base.id]: http(),
    [arbitrum.id]: http(),
  },
})

declare module '@wagmi/vue' {
  interface Register {
    config: typeof config
  }
}
