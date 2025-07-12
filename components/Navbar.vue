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
            <NuxtLink to="/about" class="btn btn-primary">About</NuxtLink>
          </li>

          <!-- Network dropdown -->
          <li v-if="isActivated" class="nav-item dropdown mb-4">
            <button 
              class="btn btn-primary dropdown-toggle network-dropdown" 
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
              class="btn btn-primary dropdown-toggle" 
              data-bs-toggle="dropdown" type="button" 
              aria-haspopup="true" aria-expanded="false"
            >
              {{ getShortAddress }}
            </button>

            <div class="dropdown-menu dropdown-menu-end set-cursor-pointer">
              
              <a :href="getBlockExplorerBaseUrl+'/address/'+address" class="short-address text-decoration-none" target="_blank">
                <span class="dropdown-item">
                  {{ getShortAddress }}
                </span>
              </a>
              
              <span v-if="getUserBalance" class="dropdown-item">{{ getUserBalance }} {{ $config.public.chainCurrency[chainId] }}</span>

              <span class="dropdown-item" @click="disconnect">Disconnect</span>
            </div>
          </li>
          <!-- END Account dropdown -->

          <!-- Connect button -->
          <li class="nav-item mb-4" v-if="!isActivated">
            <ConnectButton />
          </li>
          <!-- END Connect button -->

          <li class="nav-item mb-4">
            <button class="btn btn-warning" data-bs-dismiss="offcanvas" aria-label="Close">Close menu</button>
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
import ConnectButton from './components/ConnectButton.vue';

export default {
  name: "Navbar",

  components: {
    ConnectButton,
  },

  data() {
    return {
      userBalanceWei: null,
    }
  },

  computed: {
    isActivated() {
      return this.status === 'connected'
    },

    getBlockExplorerBaseUrl() {
      return this.$config.public.blockExplorerBaseUrl[this.chainId]
    },

    getCurrentNetworkName() {
      return this.fetchNetworkName(this.chainId);
    },

    getNetworks() {
      return this.$config.public.supportedChains;
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
  },

  methods: {
    async changeNetwork(chainId) {
      await switchChain(this.config, { chainId })
    },

    fetchNetworkName(networkId) {
      const network = this.$config.public.supportedChains.find(
        chain => chain.chainId === Number(networkId)
      );
      
      return network ? network.networkName : "Unsupported network";
    },
  },

  setup() {
    const { address, chainId, status } = useAccount()
    const config = useConfig()
    const { disconnect } = useDisconnect()

    return {
      address,
      chainId,
      config,
      disconnect,
      status,
    }
  },

  watch: {
    async address(newAddress) {
      const userBalanceData = await getBalance(this.config, { address: newAddress })
      this.userBalanceWei = userBalanceData.value
    },

    async chainId() {
      if (this.address) { 
        const userBalanceData = await getBalance(this.config, { address: this.address })
        this.userBalanceWei = userBalanceData.value
      }
    }
  }
}
</script>

<style scoped>
.custom-close {
  filter: brightness(0) invert(1);
}
</style>
