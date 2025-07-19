// composables/useWeb3.ts
import { ref, computed } from 'vue'
import {
  useAccount,
  useBalance,
  useChainId,
  useReadContract,
  useWriteContract,
  useSendTransaction,
  useSignMessage,
  useSignTypedData
} from '@wagmi/vue'
import { parseEther, formatEther } from 'viem'

export function useWeb3() {
  const environment = ref<'standard' | 'farcaster'>('standard')

  // Lazy detection function that checks environment when needed
  function getCurrentEnvironment(): 'standard' | 'farcaster' {
    if (typeof window !== 'undefined') {
      if ((window as any).parent !== window) {
        environment.value = 'farcaster'
        return 'farcaster'
      }
    }

    environment.value = 'standard'
    return 'standard'
  }

  // Initial detection when composable is mounted
  environment.value = getCurrentEnvironment()

  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { data: balanceData } = useBalance({ address })

  // Function to get current user's address based on environment
  function getCurrentUserAddress(): string | null {
    const currentEnv = getCurrentEnvironment()
    
    if (currentEnv === 'farcaster') {
      // In Farcaster environment, use the connected address
      return address.value || null
    } else {
      // In standard environment, use the connected address
      return address.value || null
    }
  }

  // Function to get current chain ID based on environment
  function getCurrentChainId(): number {
    // For standard and Farcaster environments, use the connected chain ID
    return chainId.value || 1
  }

  // Function to get native balance based on environment
  async function getNativeBalance(): Promise<string | null> {
    const currentEnv = getCurrentEnvironment()
    const walletAddress = getCurrentUserAddress()
    
    if (!walletAddress) {
      console.warn('No wallet address available. User may need to complete wallet authentication first.')
      return null
    }
    
    try {
      // For standard and Farcaster environments, use the connected balance
      return balanceData.value?.formatted || null
    } catch (error) {
      console.error('Failed to get native balance:', error)
      return null
    }
  }

  async function sendNativeCoin(to: string, amountEth: string) {
    // Use sendTransaction for all environments
    const { sendTransactionAsync } = useSendTransaction()
    return await sendTransactionAsync({
      to: to as `0x${string}`,
      value: parseEther(amountEth),
    })
  }

  async function readData(config: any) {
    const { data } = useReadContract(config)
    return data
  }

  async function writeData(config: any) {
    // Use writeContract for all environments
    const { writeContractAsync } = useWriteContract()
    return await writeContractAsync(config)
  }

  async function signMessage(message: string) {
    // For standard and Farcaster environments, use wagmi's useSignMessage
    const { signMessageAsync } = useSignMessage()
    try {
      const signature = await signMessageAsync({ message })
      return signature
    } catch (error) {
      console.error('Message signing failed:', error)
      throw new Error('Message signing failed')
    }
  }

  async function signTypedData(payload: {
    domain: any
    types: any
    primaryType: string
    message: any
  }) {
    // For standard and Farcaster environments, use wagmi's useSignTypedData
    const { signTypedDataAsync } = useSignTypedData()
    try {
      const signature = await signTypedDataAsync(payload)
      return signature
    } catch (error) {
      console.error('Typed data signing failed:', error)
      throw new Error('Typed data signing failed')
    }
  }

  return {
    environment,
    getCurrentUserAddress,
    getCurrentChainId,
    getNativeBalance,
    sendNativeCoin,
    readData,
    writeData,
    signMessage,
    signTypedData,
  }
}
