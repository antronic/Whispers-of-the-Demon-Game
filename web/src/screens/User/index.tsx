import { useEffect } from 'react'
import { css, Global } from '@emotion/react'

import SetNamePage from './pages/SetName'
import CharacterPage from './pages/CreateCharacter'
import HomePage from './pages/Home'
import { Frame } from '@app/components/common/Frame'

import { useUiStore } from '@app/store/ui'
import SignalRProvider from '@app/utils/signalr-hook/SignalRProvider'
import GamePage from './pages/Game/index'

export const UserScreen: React.FC = () => {
  const [page, setPage] = useUiStore((s) => [s.userPage, s.setUserPage])

  function routing() {
    switch (page) {
      case 'HOME':
        return <HomePage/>

      case 'NAME':
        return <SetNamePage/>

      case 'GAME_PROMPT':
        return <GamePage/>

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
        {/* <Global
          styles={css({
            body: {
              backgroundImage: `url('/images/wall-bg-1.webp')`,
              backgroundSize: '256px',
              backdropFilter: 'blur(10px)',
            }
          })}
        /> */}
        {routing()}
        <div className="w-full h-full absolute z-[-1] top-0 left-0 projector-bg grayscale-[100%] blur-sm"/>
      </Frame>
    </SignalRProvider>
  )
}