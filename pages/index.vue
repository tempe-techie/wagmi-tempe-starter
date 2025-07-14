<template>
  <div class="container">
    <div class="row mt-4">
      <div class="col-12">
        <h4 class="text-center">Home</h4>
      </div>
    </div>

    <!-- Centered card for wallet info or connect button -->
    <div class="d-flex justify-content-center mb-5">
      <div class="card text-white bg-primary custom-card">
        <div class="card-body text-center">
          <!-- Show wallet info when connected -->
          <div v-if="isActivated">
            <h5 class="card-title">Wallet Connected</h5>
            <p class="card-text"><strong>Address:</strong> {{ getShortAddress }}</p>
            <p class="card-text" v-if="getUserBalance">
              <strong>Balance:</strong> {{ getUserBalance }} {{ chainCurrency[chainId] }}
            </p>
            <p class="card-text" v-if="getCurrentNetworkName">
              <strong>Network:</strong> {{ getCurrentNetworkName }}
            </p>
          </div>

          <!-- Show connect button when not connected -->
          <div v-else>
            <h5 class="card-title">Connect Your Wallet</h5>
            <p class="card-text">Connect your wallet to get started with the app.</p>
            <ConnectButton customClass="btn-warning" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getBalance } from '@wagmi/core'
import { useAccount, useConfig } from '@wagmi/vue'
import { formatEther } from 'viem'
import ConnectButton from '@/components/ConnectButton.vue'
import chainsData from '@/data/chains.json'

export default {
  name: 'Home',
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
    }
  },
  computed: {
    isActivated() {
      return this.status === 'connected'
    },
    getCurrentNetworkName() {
      return this.fetchNetworkName(this.chainId)
    },
    getShortAddress() {
      if (this.address) {
        return this.address.slice(0, 6) + '...' + this.address.slice(-4)
      }
      return null
    },
    getUserBalance() {
      if (this.userBalanceWei) {
        const balance = formatEther(Number(this.userBalanceWei))
        return parseFloat(Number(balance).toFixed(4))
      }
      return null
    },
    chainCurrency() {
      return Object.fromEntries(chainsData.map((chain) => [chain.id, chain.nativeCurrency]))
    },
  },
  methods: {
    fetchNetworkName(networkId) {
      const supportedChains = chainsData.map((chain) => ({
        chainId: chain.id,
        networkName: chain.name,
      }))
      const network = supportedChains.find((chain) => chain.chainId === Number(networkId))
      return network ? network.networkName : 'Unsupported network'
    },
    async updateBalance() {
      if (this.address && this.config) {
        try {
          const userBalanceData = await getBalance(this.config, { address: this.address })
          this.userBalanceWei = userBalanceData.value
        } catch (error) {
          console.error('Failed to fetch balance:', error)
        }
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

    // Store config
    this.config = config
  },
}
</script>

<style scoped>
.custom-card {
  max-width: 400px;
  width: 100%;
}
</style>