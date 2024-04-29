
import React from 'react'
import { HubConnection } from '@microsoft/signalr'

export type SignalRContextValue = {
  connection: HubConnection | null
  createConnection: () => Promise<HubConnection | null>
  getConnection: () => HubConnection | null
}

export const SignalRContext = React.createContext<SignalRContextValue>({
  connection: null,
  createConnection: async () => null,
  getConnection: () => null,
})

export default SignalRContext