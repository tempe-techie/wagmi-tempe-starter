// composables/useWeb3.ts
import { ref, watch, computed } from 'vue'
import {
  useReadContract,
  useWriteContract,
  useSendTransaction,
  useSignMessage,
  useSignTypedData,
  useConfig,
} from '@wagmi/vue'
import { parseEther } from 'viem'

export function useWeb3() {
  const environment = ref<'standard' | 'farcaster'>('standard')
  const config = useConfig()

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

  async function sendNativeCoin(to: string, amountEth: string) {
    // Use sendTransaction for all environments
    const { sendTransactionAsync } = useSendTransaction()
    return await sendTransactionAsync({
      to: to as `0x${string}`,
      value: parseEther(amountEth),
    })
  }

  async function readData(contractConfig: any) {
    // Merge the contract config with the wagmi config
    const fullConfig = {
      ...contractConfig,
      config,
    }
    
    const { data, isError, error } = useReadContract(fullConfig)
    
    // Wait for the data to be available
    await new Promise((resolve) => {
      const unwatch = watch(data, (newData) => {
        if (newData !== undefined) {
          unwatch()
          resolve(newData)
        }
      }, { immediate: true })
      
      // Also watch for errors
      const unwatchError = watch(isError, (hasError) => {
        if (hasError) {
          unwatch()
          unwatchError()
          resolve(null)
        }
      }, { immediate: true })
    })
    
    if (isError.value) {
      console.error('Contract read error:', error.value)
      return null
    }
    
    return data.value
  }

  async function writeData(contractConfig: any) {
    // Merge the contract config with the wagmi config
    const fullConfig = {
      ...contractConfig,
      config,
    }
    
    // Use writeContract for all environments
    const { writeContractAsync } = useWriteContract()
    return await writeContractAsync(fullConfig)
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
    // Environment
    environment: computed(() => getCurrentEnvironment()),
    
    // Web3-specific methods
    readData,
    sendNativeCoin,
    signMessage,
    signTypedData,
    writeData,
  }
}
