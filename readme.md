# Wagmi Tempe Starter

A web3 starter template which uses the following stack:

- Nuxt
- Wagmi
- Farcaster (optional, suitable for mini apps)
- Bootstrap

## How to connect your Safe to the app

0. Make sure you have WalletConnect project ID in environment variables (check example.env to see how)
1. In the app, click on the "Connect Wallet" button and select "WalletConnect"
2. A small modal will appear. Click on the copy icon (two overlapping squares) to copy the WalletConnect URI
3. Go to https://app.safe.global/ and open your Safe
4. In the navigation bar, click on the "WalletConnect" icon
5. In the modal that appears, enter the WalletConnect URI that you copied in the previous step
6. Wait for the Safe to connect
7. You should now see your Safe address in the app

## Cloudflare Tunnel for Farcaster testing

1. Install cloudflared: `npm install -g cloudflared` (or download from [cloudflare.com](https://cloudflare.com))
2. Run the tunnel: `cloudflared tunnel --url http://localhost:3000`
3. Use the generated public URL for Farcaster testing

## WalletConnect

If you want WalletConnect support, make sure to copy `.env.example` in to `.env` and enter your WalletConnect project ID into `VITE_WC_PROJECT_ID`.

If you don't want to use WC, then you can remove it from `wagmi.ts` and `/components/ConnectButton.vue`.

## World MiniKit

World MiniKit is not natively supported in this project, but you can implement it yourself by installing `@worldcoin/minikit-js` library and adapting the code, more precisely in files:

- /components/ConnectButton.vue
- /composables/useAccountData.ts
- /composables/useWeb3.ts

And maybe in some others too.