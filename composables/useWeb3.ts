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
import { parseEther, formatEther, createPublicClient, http } from 'viem'
import { worldchain } from 'viem/chains'

// Optional MiniKit import - will be null if package is not installed
let MiniKit: any = null

// Try to import MiniKit dynamically
try {
  const minikitModule = require('@worldcoin/minikit-js')
  MiniKit = minikitModule.MiniKit
} catch (error) {
  console.warn('@worldcoin/minikit-js not installed, Worldcoin features will be disabled')
}

export function useWeb3() {
  const environment = ref<'standard' | 'farcaster' | 'world'>('standard')

  // Lazy detection function that checks environment when needed
  function getCurrentEnvironment(): 'standard' | 'farcaster' | 'world' {
    if (typeof window !== 'undefined') {
      // Only check for MiniKit if it's available
      if (MiniKit && (window as any).MiniKit?.isInstalled?.()) {
        environment.value = 'world'
        return 'world'
      } else if ((window as any).parent !== window) {
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
    
    if (currentEnv === 'world' && MiniKit) {
      // In World environment, get address from MiniKit
      // Note: This requires the user to have completed wallet auth first
      return (window as any).MiniKit?.walletAddress || MiniKit.walletAddress || null
    } else if (currentEnv === 'farcaster') {
      // In Farcaster environment, use the connected address
      return address.value || null
    } else {
      // In standard environment, use the connected address
      return address.value || null
    }
  }

  // Function to get current chain ID based on environment
  function getCurrentChainId(): number {
    const currentEnv = getCurrentEnvironment()
    
    if (currentEnv === 'world') {
      // World environment always uses World chain
      return worldchain.id
    } else {
      // For standard and Farcaster environments, use the connected chain ID
      return chainId.value || 1
    }
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
      if (currentEnv === 'world') {
        // Use worldchain client for World environment
        const worldchainClient = createPublicClient({
          chain: worldchain,
          transport: http(),
        })
        
        const balance = await worldchainClient.getBalance({
          address: walletAddress as `0x${string}`,
        })
        
        return formatEther(balance)
      } else {
        // For standard and Farcaster environments, use the connected balance
        return balanceData.value?.formatted || null
      }
    } catch (error) {
      console.error('Failed to get native balance:', error)
      return null
    }
  }

  async function sendNativeCoin(to: string, amountEth: string) {
    const currentEnv = getCurrentEnvironment()
    if (currentEnv === 'world' && MiniKit) {
      try {
        const payload = await MiniKit.commandsAsync.sendTransaction({
          transaction: [{
            address: '0x087d5449a126e4e439495fcBc62A853eB3257936', // Forward.sol
            abi: [{ type: 'function', name: 'pay', stateMutability: 'payable', inputs: [{ name: 'to', type: 'address' }], outputs: [] }],
            functionName: 'pay',
            args: [to],
            value: `0x${parseEther(amountEth).toString(16)}`,
          }],
        })
        return payload
      } catch (error) {
        console.warn('Worldcoin transaction failed, falling back to standard:', error)
        // Fall back to standard transaction
      }
    }
    
    // For standard environment or fallback, use sendTransaction
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
    const currentEnv = getCurrentEnvironment()
    if (currentEnv === 'world' && MiniKit) {
      try {
        const payload = await MiniKit.commandsAsync.sendTransaction({
          transaction: [config as any],
        })
        return payload
      } catch (error) {
        console.warn('Worldcoin contract write failed, falling back to standard:', error)
        // Fall back to standard contract write
      }
    }
    
    // For standard environment or fallback, use writeContract
    const { writeContractAsync } = useWriteContract()
    return await writeContractAsync(config)
  }

  async function signMessage(message: string) {
    const currentEnv = getCurrentEnvironment()
    if (currentEnv === 'world' && MiniKit) {
      try {
        const { finalPayload } = await MiniKit.commandsAsync.signMessage({ message })
        return finalPayload.status === 'success' ? finalPayload.signature : null
      } catch (error) {
        console.warn('Worldcoin message signing failed:', error)
        throw new Error('Message signing failed in Worldcoin environment')
      }
    } else {
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
  }

  async function signTypedData(payload: {
    domain: any
    types: any
    primaryType: string
    message: any
  }) {
    const currentEnv = getCurrentEnvironment()
    if (currentEnv === 'world' && MiniKit) {
      try {
        const { finalPayload } = await MiniKit.commandsAsync.signTypedData(payload as any)
        return finalPayload.status === 'success' ? finalPayload.signature : null
      } catch (error) {
        console.warn('Worldcoin typed data signing failed:', error)
        throw new Error('Typed data signing failed in Worldcoin environment')
      }
    } else {
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
