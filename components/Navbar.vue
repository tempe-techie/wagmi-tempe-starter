<template>
<nav class="navbar bg-primary" data-bs-theme="dark">
  <div class="container-fluid">
    <NuxtLink to="/" class="navbar-brand">
      Wagmi Tempe Starter
    </NuxtLink>

    <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel" data-bs-theme="dark">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="offcanvasNavbarLabel">Menu</h5>
        <button type="button" class="btn-close custom-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body">
        <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
          
          <li class="nav-item mb-4" data-bs-dismiss="offcanvas" aria-label="Close">
            <NuxtLink to="/about" class="btn btn-primary btn-lg w-100">About</NuxtLink>
          </li>

          <!-- Network dropdown -->
          <li v-if="isActivated" class="nav-item dropdown mb-4">
            <button 
              class="btn btn-primary btn-lg w-100 dropdown-toggle network-dropdown" 
              data-bs-toggle="dropdown" type="button" 
              aria-haspopup="true" aria-expanded="false"
            >{{ accountData.networkName }}</button>

            <div class="dropdown-menu p-2 dropdown-menu-end set-cursor-pointer">
              <span 
                class="dropdown-item"
                v-for="networkData in getNetworks"
                :key="networkData.chainId"
                @click="changeNetwork(networkData.chainId)"
              >{{networkData.networkName}}</span>
            </div>
          </li>
          <!-- END Network dropdown -->

          <!-- Account dropdown -->
          <li v-if="isActivated" class="nav-item dropdown mb-4">
            <button 
              class="btn btn-primary btn-lg w-100 dropdown-toggle" 
              data-bs-toggle="dropdown" type="button" 
              aria-haspopup="true" aria-expanded="false"
            >
              {{ accountData.addressShort }}
            </button>

            <div class="dropdown-menu dropdown-menu-end set-cursor-pointer">
              
              <a :href="getBlockExplorerBaseUrl+'/address/'+accountData.address" class="short-address text-decoration-none" target="_blank">
                <span class="dropdown-item w-100">
                  {{ accountData.addressShort }}
                </span>
              </a>
              
              <span v-if="accountData.balanceEth" class="dropdown-item w-100">{{ accountData.balanceEth }} {{ chainCurrency[accountData.chainId] }}</span>

              <span class="dropdown-item w-100" @click="accountData.disconnect">Disconnect</span>
            </div>
          </li>
          <!-- END Account dropdown -->

          <!-- Connect button -->
          <li class="nav-item mb-4" v-if="!isActivated">
            <ConnectButton customClass="btn-primary btn-lg w-100" />
          </li>
          <!-- END Connect button -->

          <!-- Add to favorites button -->
          <li v-if="isFarcasterEnvironment" class="nav-item mb-4">
            <button class="btn btn-success btn-lg w-100" @click="handleAddFavorite">
              Add to favorites
            </button>
          </li>

          <!-- Share on Farcaster button -->
          <li v-if="isFarcasterEnvironment" class="nav-item mb-4">
            <button class="btn btn-info btn-lg w-100" @click="handleShare">
              Share on Farcaster
            </button>
          </li>

          <li class="nav-item mb-4">
            <button class="btn btn-warning btn-lg w-100" data-bs-dismiss="offcanvas" aria-label="Close">Close menu</button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</nav>
</template>

<script>
import { sdk } from '@farcaster/miniapp-sdk'
import ConnectButton from './ConnectButton.vue';
import chainsData from '../data/chains.json'
import { useWeb3 } from '../composables/useWeb3'
import { useAccountData } from '../composables/useAccountData'

export default {
  name: "Navbar",

  components: {
    ConnectButton,
  },

  data() {
    return {
      web3: null,
      accountData: null,
    }
  },

  computed: {
    isActivated() {
      return this.accountData?.isActivated || false
    },

    isFarcasterEnvironment() {
      return this.web3?.environment === 'farcaster'
    },

    getBlockExplorerBaseUrl() {
      const blockExplorerBaseUrl = Object.fromEntries(
        chainsData.map((chain) => [chain.id, chain.blockExplorer]),
      )
      return blockExplorerBaseUrl[this.accountData?.chainId]
    },

    getNetworks() {
      return chainsData.map((chain) => ({
        chainId: chain.id,
        networkName: chain.name,
      }))
    },

    chainCurrency() {
      return Object.fromEntries(chainsData.map((chain) => [chain.id, chain.nativeCurrency]))
    },
  },

  methods: {
    async changeNetwork(chainId) {
      await this.accountData.switchToNetwork(chainId)
    },

    async handleAddFavorite() {
      try {
        const result = await sdk.actions.addFrame()
        console.log('Add to favorites result:', result)
        // Handle the result based on what the SDK returns
        if (result) {
          console.log('Added to favorites!')
        }
      } catch (err) {
        console.error('Error adding frame:', err)
      }
    },

    async handleShare() {
      try {
        await sdk.actions.composeCast({
          text: 'Check out Wagmi Tempe Starter - A starter template for building Web3 applications with Wagmi and Nuxt! 💸',
          embeds: [window.location.href],
        })
      } catch (err) {
        console.error('Error sharing:', err)
      }
    },
  },

  mounted() {
    // Initialize composables
    this.web3 = useWeb3()
    this.accountData = useAccountData()
  },
}
</script>

<style scoped>
.custom-close {
  filter: brightness(0) invert(1);
}
</style>
