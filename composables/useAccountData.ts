// composables/useAccountData.ts
import { formatEther } from 'viem'
import { computed } from 'vue'
import { switchChain } from '@wagmi/core'
import {
  useAccount,
  useBalance,
  useChainId,
  useConfig,
  useDisconnect,
  useConnect
} from '@wagmi/vue'
import chainsData from '@/data/chains.json'

export function useAccountData() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { data: balanceData } = useBalance({ address })
  const { disconnect } = useDisconnect()
  const { connect, connectors, error: connectError, status: connectStatus } = useConnect()
  const config = useConfig()

  // Function to get current user's address
  function getCurrentUserAddress(): string | null {
    return address.value || null
  }

  // Function to get current chain ID
  function getCurrentChainId(): number {
    return chainId.value || 1
  }

  // Function to switch to a different network
  async function switchToNetwork(targetChainId: number): Promise<void> {
    try {
      await switchChain(config, { chainId: targetChainId as any })
    } catch (error) {
      console.error('Failed to switch network:', error)
      throw new Error('Network switching failed')
    }
  }

  // Function to get native balance
  async function getNativeBalance(): Promise<string | null> {
    const walletAddress = getCurrentUserAddress()
    
    if (!walletAddress) {
      console.warn('No wallet address available. User may need to complete wallet authentication first.')
      return null
    }
    
    try {
      return balanceData.value?.formatted || null
    } catch (error) {
      console.error('Failed to get native balance:', error)
      return null
    }
  }

  // Function to get current connection status
  function getCurrentConnectionStatus(): boolean {
    return isConnected.value
  }

  // Function to get current balance in wei
  function getCurrentBalanceWei(): bigint {
    if (!balanceData.value) return BigInt(0)
    return BigInt(balanceData.value.value)
  }

  // Function to shorten address
  function shortenAddress(address: string, chars = 4): string {
    if (!address) return ''
    return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`
  }

  // Function to get network name from chain ID
  function getNetworkName(networkId: number): string {
    const supportedChains = chainsData.map((chain) => ({
      chainId: chain.id,
      networkName: chain.name,
    }))
    const network = supportedChains.find((chain) => chain.chainId === Number(networkId))
    return network ? network.networkName : 'Unsupported network'
  }

  // Function to get formatted balance in ETH
  function getBalanceEth(): number | null {
    const currentBalanceWei = getCurrentBalanceWei()
    if (currentBalanceWei) {
      const balanceEth = formatEther(currentBalanceWei)
      return parseFloat(Number(balanceEth).toFixed(4))
    }
    return null
  }

  return {
    // Core properties
    address: computed(() => getCurrentUserAddress()),
    addressShort: computed(() => shortenAddress(getCurrentUserAddress() || '')),
    balanceWei: computed(() => getCurrentBalanceWei()),
    chainId: computed(() => getCurrentChainId()),
    isActivated: computed(() => getCurrentConnectionStatus()),
    
    // Enhanced computed properties
    networkName: computed(() => getNetworkName(getCurrentChainId())),
    balanceEth: computed(() => getBalanceEth()),

    // Connect properties
    connectors,
    connectError,
    connectStatus,

    // Methods
    connect,
    disconnect,
    switchToNetwork,
    getCurrentChainId,
    getCurrentUserAddress,
    getNativeBalance,
    shortenAddress,
    getNetworkName,
    getBalanceEth,
  }
} 