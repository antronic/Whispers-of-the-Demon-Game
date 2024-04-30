
import React from 'react'
import { HubConnection } from '@microsoft/signalr'

export type SignalRContextValue = {
  connection: HubConnection | null
  createConnection: () => Promise<HubConnection | null>
  getConnection: () => HubConnection | null
  status: 'CONNECTING' | 'CONNECTED' | 'RECONNECTING' | 'DISCONNECTED'
  setStatus: (status: 'CONNECTING' | 'CONNECTED' | 'RECONNECTING' | 'DISCONNECTED') => void
}

export const SignalRContext = React.createContext<SignalRContextValue>({
  connection: null,
  createConnection: async () => null,
  getConnection: () => null,
  status: 'DISCONNECTED',
  setStatus: () => {},
})

export default SignalRContext