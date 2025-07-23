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
            <p class="card-text"><strong>Address:</strong> {{ addressShort }}</p>
            <p class="card-text" v-if="balanceEth">
              <strong>Balance:</strong> {{ balanceEth }} {{ chainCurrency[chainId] }}
            </p>
            <p class="card-text" v-if="networkName">
              <strong>Network:</strong> {{ networkName }}
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
import { computed } from 'vue'
import ConnectButton from '@/components/ConnectButton.vue'
import chainsData from '@/data/chains.json'
import { useAccountData } from '@/composables/useAccountData'

export default {
  name: 'Home',
  components: {
    ConnectButton,
  },
  setup() {
    const {
      address,
      addressShort,
      balanceWei,
      chainId,
      isActivated,
      networkName,
      balanceEth,
    } = useAccountData()

    // Computed properties
    const chainCurrency = computed(() => {
      return Object.fromEntries(chainsData.map((chain) => [chain.id, chain.nativeCurrency]))
    })

    return {
      // Account data from composable
      address,
      addressShort,
      balanceWei,
      chainId,
      isActivated,
      networkName,
      balanceEth,
      
      // Computed properties
      chainCurrency,
    }
  },
}
</script>

<style scoped>
.custom-card {
  max-width: 400px;
  width: 100%;
}
</style>