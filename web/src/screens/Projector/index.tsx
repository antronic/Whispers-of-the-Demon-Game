import Logo from '@app/components/Logo'
import { useUiStore } from '@app/store/ui'
import { Frame } from '@app/components/common/Frame'
// import MainStage from './pages/MainStage'
import GamePage from './pages/Game'
import SignalRProvider from '@app/utils/signalr-hook/SignalRProvider'

const CharacterPreviewPage = () => {
  return (
    <div>
      <p className="text-4xl text-slate-700 my-4 text-center">
        Character preview
      </p>

      {/* DIV Ancient picture frame, Img inside */}
      <div className="bg-zinc-300 border-8 border-orange-900 shadow-md w-2/4 mx-auto">
        <img
          src="https://stgisekaigamesea.blob.core.windows.net/public/character-preview.png?sp=r&st=2024-04-25T03:10:53Z&se=2024-04-25T11:10:53Z&spr=https&sv=2022-11-02&sr=b&sig=d3SM%2Bz6KZ2hxTNc5HvM3JKGxI%2F%2BRABK6CCZc2%2FA%2F17w%3D"
          alt="Character preview"
        />
      </div>

      <div className="mt-4 text-black text-xl">
        <p className="">Prompt:</p>
        <div className="bg-zinc-400 px-2 py-2">
          <p>8-bit design with dimensions 16x16 pixels, isekai ancient style, women, red dress, wizard, white background</p>
        </div>
      </div>
    </div>
  )
}

export const ProjectorScreen: React.FC = () => {
  const [page, setPage] = useUiStore((s) => [s.projectorPage, s.setProjectorPage])

  function routing() {

    switch (page) {
      case 'GAME':
        return <GamePage/>

      default:
        return (
          <p className="text-red-500 bg-white">Not found / Current: {page} </p>
        )
    }
  }

  return (
    <SignalRProvider>
      <div>
        <div className="text-[8rem] text-center text-slate-900 text-shadow mb-2">
          <Logo/>
        </div>
      {routing()}
      </div>
    </SignalRProvider>
    // <Frame>
    // </Frame>
  )
}

export default ProjectorScreen