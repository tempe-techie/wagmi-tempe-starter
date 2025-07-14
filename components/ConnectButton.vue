<template>
  <button class="btn" :class="customClass" @click="openModal">Connect wallet</button>

  <!-- Connect Wallet modal -->
  <div
    class="modal modal-sm fade"
    id="connectModal"
    tabindex="-1"
    aria-labelledby="connectModalLabel"
    aria-hidden="true"
    :class="{ show: isModalOpen }"
    v-show="isModalOpen"
    @click="closeModal"
  >
    <div class="modal-dialog" role="document" @click.stop>
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Connect your wallet</h5>
          <button
            type="button"
            class="btn-close"
            @click="closeModal"
            aria-label="Close"
            id="closeConnectModal"
          >
            <span aria-hidden="true"></span>
          </button>
        </div>
        <div class="modal-body row">
          <div class="card col-6 card-wallet" role="button" @click.stop="connectInjected">
            <img
              src="/img/wallets/rabby.png"
              class="card-img-top card-img-wallet"
              alt="Rabby"
            />
            <small class="text-center mb-3 text-muted">Rabby</small>
          </div>

          <div class="card col-6 card-wallet" role="button" @click.stop="connectWalletConnect">
            <img
              src="/img/wallets/wc.png"
              class="card-img-top card-img-wallet"
              alt="WalletConnect"
            />
            <small class="text-center mb-3 text-muted">WalletConnect</small>
          </div>

          <div class="card col-6 card-wallet" role="button" @click.stop="connectMetaMask">
            <img
              src="/img/wallets/metamask.png"
              class="card-img-top card-img-wallet"
              alt="MetaMask"
            />
            <small class="text-center mb-3 text-muted">MetaMask</small>
          </div>

          <div class="card col-6 card-wallet" role="button" @click.stop="connectInjected">
            <img
              src="/img/wallets/rainbow.png"
              class="card-img-top card-img-wallet"
              alt="Rainbow"
            />
            <small class="text-center mb-3 text-muted">Rainbow</small>
          </div>

          <div class="card col-6 card-wallet" role="button" @click.stop="connectInjected">
            <img
              src="/img/wallets/bifrost.png"
              class="card-img-top card-img-wallet"
              alt="Bifrost"
            />
            <small class="text-center mb-3 text-muted">Bifrost</small>
          </div>

          <div class="card col-6 card-wallet" role="button" @click.stop="connectInjected">
            <img
              src="/img/wallets/brave.png"
              class="card-img-top card-img-wallet"
              alt="Brave"
            />
            <small class="text-center mb-3 text-muted">Brave</small>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- END Connect Wallet modal -->
</template>

<script>
import { useChainId, useConnect } from '@wagmi/vue'

export default {
  name: 'ConnectButton',
  props: {
    customClass: {
      type: String,
      default: null,
    },
  },

  data() {
    return {
      isModalOpen: false,
    }
  },

  methods: {
    openModal() {
      this.isModalOpen = true
      document.body.classList.add('modal-open')
    },

    closeModal() {
      this.isModalOpen = false
      document.body.classList.remove('modal-open')
    },

    async connectInjected() {
      try {
        console.log('Connecting with injected wallet...')
        console.log('Connectors available:', this.connectors)
        console.log('Selected connector:', this.connectors[0])
        console.log('Chain ID:', this.chainId)

        await this.connect({ connector: this.connectors[0], chainId: this.chainId })
        this.closeModal()
      } catch (error) {
        console.error('Failed to connect injected wallet:', error)
        console.error('Error details:', error.message, error.stack)
      }
    },

    async connectMetaMask() {
      try {
        await this.connect({ connector: this.connectors[1], chainId: this.chainId })
        this.closeModal()
      } catch (error) {
        console.error('Failed to connect MetaMask:', error)
      }
    },

    async connectWalletConnect() {
      try {
        await this.connect({ connector: this.connectors[2], chainId: this.chainId })
        this.closeModal()
      } catch (error) {
        console.error('Failed to connect WalletConnect:', error)
      }
    },
  },

  setup() {
    const chainId = useChainId()
    const { connect, connectors, error, status } = useConnect()

    return {
      chainId,
      connect,
      connectors,
      error,
      status,
    }
  },
}
</script>