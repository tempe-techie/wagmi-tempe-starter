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
            >{{ getCurrentNetworkName }}</button>

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
              {{ getShortAddress }}
            </button>

            <div class="dropdown-menu dropdown-menu-end set-cursor-pointer">
              
              <a :href="getBlockExplorerBaseUrl+'/address/'+address" class="short-address text-decoration-none" target="_blank">
                <span class="dropdown-item w-100">
                  {{ getShortAddress }}
                </span>
              </a>
              
              <span v-if="getUserBalance" class="dropdown-item w-100">{{ getUserBalance }} {{ chainCurrency[chainId] }}</span>

              <span class="dropdown-item w-100" @click="disconnect">Disconnect</span>
            </div>
          </li>
          <!-- END Account dropdown -->

          <!-- Connect button -->
          <li class="nav-item mb-4" v-if="!isActivated">
            <ConnectButton customClass="btn-primary btn-lg w-100" />
          </li>
          <!-- END Connect button -->

          <!-- Add to favorites button -->
          <li class="nav-item mb-4">
            <button class="btn btn-success btn-lg w-100" @click="handleAddFavorite">
              Add to favorites
            </button>
          </li>

          <!-- Share on Farcaster button -->
          <li class="nav-item mb-4">
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
import { getBalance, switchChain } from '@wagmi/core'
import { useAccount, useConfig, useDisconnect } from '@wagmi/vue';
import { formatEther } from 'viem'
import { sdk } from '@farcaster/miniapp-sdk'
import ConnectButton from './ConnectButton.vue';
import chainsData from '../data/chains.json'

export default {
  name: "Navbar",

  components: {
    ConnectButton,
  },

  data() {
    return {
      userBalanceWei: null,
      address: null,
      chainId: null,
      status: null,
      config: null,
      disconnect: null,
    }
  },

  computed: {
    isActivated() {
      return this.status === 'connected'
    },

    getBlockExplorerBaseUrl() {
      const blockExplorerBaseUrl = Object.fromEntries(
        chainsData.map((chain) => [chain.id, chain.blockExplorer]),
      )
      return blockExplorerBaseUrl[this.chainId]
    },

    getCurrentNetworkName() {
      return this.fetchNetworkName(this.chainId);
    },

    getNetworks() {
      return chainsData.map((chain) => ({
        chainId: chain.id,
        networkName: chain.name,
      }))
    },

    getShortAddress() {
      if (this.address) {
        return this.address.slice(0, 6) + '...' + this.address.slice(-4);
      }

      return null
    },

    getUserBalance() {
      if (this.userBalanceWei) {
        const balance = formatEther(Number(this.userBalanceWei));
        return parseFloat(Number(balance).toFixed(4));
      }

      return null;
    },

    chainCurrency() {
      return Object.fromEntries(chainsData.map((chain) => [chain.id, chain.nativeCurrency]))
    },
  },

  methods: {
    async changeNetwork(chainId) {
      await switchChain(this.config, { chainId })
    },

    fetchNetworkName(networkId) {
      const supportedChains = chainsData.map((chain) => ({
        chainId: chain.id,
        networkName: chain.name,
      }))
      const network = supportedChains.find((chain) => chain.chainId === Number(networkId))
      return network ? network.networkName : 'Unsupported network'
    },

    async updateBalance() {
      if (this.address) {
        const userBalanceData = await getBalance(this.config, { address: this.address })
        this.userBalanceWei = userBalanceData.value
      }
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

  watch: {
    address: {
      handler(newAddress) {
        if (newAddress) {
          this.updateBalance()
        }
      },
      immediate: true,
    },
    chainId: {
      handler() {
        if (this.address) {
          this.updateBalance()
        }
      },
      immediate: true,
    },
  },

  mounted() {
    // Initialize wagmi composables
    const { address, chainId, status } = useAccount()
    const config = useConfig()
    const { disconnect } = useDisconnect()

    // Set up reactive watchers for wagmi state
    this.$watch(
      () => address.value,
      (newAddress) => {
        this.address = newAddress
      },
      { immediate: true },
    )

    this.$watch(
      () => chainId.value,
      (newChainId) => {
        this.chainId = newChainId
      },
      { immediate: true },
    )

    this.$watch(
      () => status.value,
      (newStatus) => {
        this.status = newStatus
      },
      { immediate: true },
    )

    // Store config and disconnect function
    this.config = config
    this.disconnect = disconnect
  },
}
</script>

<style scoped>
.custom-close {
  filter: brightness(0) invert(1);
}
</style>
