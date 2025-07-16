# Wagmi Tempe Starter

A starter template for Wagmi Nuxt projects

Website: https://example.com

## World MiniKit

Using World MiniKit library is optional. If you have a World app, then install the mini kit:

```bash
npm i @worldcoin/minikit-js
```

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