import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@wagmi/vue/nuxt', '@vite-pwa/nuxt'],
  compatibilityDate: '2025-06-21',
  vite: {
    server: {
      allowedHosts: true
    }
  },
  pwa: {
    registerType: 'autoUpdate',
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallbackAllowlist: [/^\/$/],
      type: 'module',
    },
    includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
    manifest: {
      name: 'Wagmi Tempe Starter',
      short_name: 'Wagmi Tempe',
      description: 'A starter template for Wagmi Nuxt projects',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone',
      orientation: 'portrait',
      scope: '/',
      start_url: '/',
      icons: [
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable',
        },
      ],
    },
  },
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
        {
          // PWA Manifest
          rel: 'manifest',
          href: '/manifest.webmanifest',
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
    }
  }
})