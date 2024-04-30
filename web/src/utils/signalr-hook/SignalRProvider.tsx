import { useEffect, useRef } from 'react'
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr'
import { AppStorage } from '@app/utils/storage'

import SignalRContext from './SignalRContext'

const SignalRProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const connection = useRef<HubConnection | null>(null)
  const status = useRef<'CONNECTING' | 'CONNECTED' | 'RECONNECTING' | 'DISCONNECTED'>('DISCONNECTED')

  // useEffect(() => {
  //   const url = AppStorage.get('SIGNAL_R_URL')

  //   connection.current = new HubConnectionBuilder()
  //     .withUrl(`${url}/serverless`)
  //     .withAutomaticReconnect()
  //     .build()

  //   connect()

  //   connection.current.onreconnecting(() => {
  //     console.log('Reconnecting...')
  //   })

  //   connection.current.onclose(async () => {
  //     await connect()
  //   })

  //   return () => {
  //     connection.current?.stop()
  //   }
  // })

  const createConnection = async () => {
    const url = AppStorage.get('SIGNAL_R_URL').text()

    connection.current = new HubConnectionBuilder()
      .withUrl(`${url}/serverless`)
      .withAutomaticReconnect()
      .build()

    await connect()
    return connection.current
  }

  const getConnection = () => {
    return connection.current
  }

  const connect = async () => {
    try {
      await connection.current?.start()
      AppStorage.set('SIGNAL_R_ID', connection.current?.connectionId as string)

      console.log('SignalR Connected.', connection.current?.connectionId)
      setStatus('CONNECTED')
    } catch (error) {
      setStatus('DISCONNECTED')
      console.error('SignalR Connection Error.', error)
    }
  }

  const setStatus = (_status: 'CONNECTING' | 'CONNECTED' | 'RECONNECTING' | 'DISCONNECTED') => {
    status.current = _status
  }

  return (
    <SignalRContext.Provider value={{ connection: connection.current, createConnection, getConnection, status: status.current, setStatus }}>
      {children}
    </SignalRContext.Provider>
  )
}

export default SignalRProvider