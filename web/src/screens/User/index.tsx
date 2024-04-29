import { useEffect } from 'react'
import { css, Global } from '@emotion/react'

import SetNamePage from './pages/SetName'
import CharacterPage from './pages/CreateCharacter'
import HomePage from './pages/Home'
import { Frame } from '@app/components/common/Frame'

import { useUiStore } from '@app/store/ui'
import SignalRProvider from '@app/utils/signalr-hook/SignalRProvider'

export const UserScreen: React.FC = () => {
  const [page, setPage] = useUiStore((s) => [s.userPage, s.setUserPage])
  // const connectSignalR = async () => {
  //   console.log(connection)
  //   // Start SignalR
  //   const connectionId = await start()
  //   // Save connectionId to local storage
  //   if (connectionId) {
  //     AppStorage.set('SIGNAL_R_ID', connectionId)
  //   }

  //   console.log('SignalR already connected.')
  // }

  // useEffect(() => {
  //   connectSignalR()
  // }, [])

  function routing() {
    switch (page) {
      case 'HOME':
        return <HomePage/>

      case 'NAME':
        return <SetNamePage/>

      case 'GENERATED_NAME':
        return (
          <div>
          </div>
        )

      case 'CHARACTER':
        return <CharacterPage/>

      default:
        return (
          <p className="text-red-500 bg-white">Not found / Current: {page} </p>
        )
    }
  }

  return (
    <SignalRProvider>
      <Frame>
        <Global
          styles={css({
            body: {
              backgroundImage: `url('/images/wall-bg-1.webp')`,
              backgroundSize: '256px',
              backdropFilter: 'blur(10px)',
            }
          })}
        />
        {routing()}
      </Frame>
    </SignalRProvider>
  )
}