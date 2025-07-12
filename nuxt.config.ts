import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@wagmi/vue/nuxt'],
  compatibilityDate: '2025-06-21',
  app: {
    head: {
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        {
          charset: 'utf-8',
        },
      ],
      link: [
        {
          // Bootstrap
          rel: 'stylesheet',
          href: '/css/bootstrap.css',
        },
        {
          // Bootstrap icons
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css',
        },
        {
          // Custom
          rel: 'stylesheet',
          href: '/css/custom.css',
        },
      ],
      script: [
        {
          src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
        },
      ],
    },
  },
  components: false,
  runtimeConfig: {
    public: {
      blockExplorerBaseUrl: {
        1: 'https://etherscan.io',
        10: 'https://optimistic.etherscan.io',
        8453: 'https://basescan.org',
        42161: 'https://arbiscan.io',
      },
      chainCurrency: {
        1: 'ETH',
        10: 'ETH',
        8453: 'ETH',
        42161: 'ETH',
      },
      favicon: '/img/logo.png',
      projectMetadataTitle: 'Wagmi Tempe Starter',
      projectDescription: 'A starter template for Wagmi Nuxt projects',
      projectUrl: 'https://example.com',
      projectTwitter: '@example',
      previewImage: '/img/preview.png',
      supportedChains: [
        { chainId: 1, networkName: 'Ethereum' },
        { chainId: 10, networkName: 'Optimism' },
        { chainId: 8453, networkName: 'Base' },
        { chainId: 42161, networkName: 'Arbitrum' },
      ],
      wcProjectId: process.env.NUXT_PUBLIC_WC_PROJECT_ID,
    }
  }
})