import { useContext, useEffect, useRef, useState } from 'react'
import SignalRContext, { SignalRContextValue } from './signalr-hook/SignalRContext'
import { HubConnection } from '@microsoft/signalr'

export type SignalRStatus = 'CONNECTING' | 'CONNECTED' | 'RECONNECTING' | 'DISCONNECTED'

export type SIGNAL_R_METHOD = 'broadcastMessage' | 'ReceiveMessage' | 'GENERATED_AVATAR' | 'GENERATED_NAME' | 'USER_MESSAGE' | 'PROJECTOR_ATTACK' | 'GENERATED_PALUNG' | 'EXTRACT_CHARACTER'

let i = 0
function useSignalR<T>(method: SIGNAL_R_METHOD) {
  // const [status, setStatus] = useState<SignalRStatus>('DISCONNECTED')
  const [message, setMessage] = useState<T | null>(null)

  const connection = useRef<HubConnection | null>(null)

  const { createConnection, getConnection, status, setStatus } = useContext<SignalRContextValue>(SignalRContext)

  useEffect(() => {
    if (status === 'DISCONNECTED') {
      connect()
    }
  }, [status])

  const connect = async () => {
    console.log('connecting...')
    setStatus('CONNECTING')
    connection.current = await createConnection()
  }

  useEffect(() => {
    const connection = getConnection()
    connection?.on(method, (user, message: T) => {
      console.log(`SignalR ${method}:`, message)
      setMessage(message)
    })
  }, [])

  return {
    message,
    reset: () => setMessage(null),
  }
}

export default useSignalR