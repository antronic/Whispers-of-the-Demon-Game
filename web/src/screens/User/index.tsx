import Logo from '@app/components/Logo'
import { useUiStore } from '@app/store/ui'
import SetNamePage from './pages/SetName'
import { Frame } from '@app/components/common/Frame'
import AnimateText from '@app/components/AnimateText'

interface IProps {

}


const CharacterPage = () => {
  return (
    <div>
      <p className="text-3xl text-shadow mb-2">Describe your character</p>

        <input className="w-full px-2 py-1 input-text" type="text" />

        {/* Minecraft button */}
        <button
          className={`
            text-xl bg-green-500 w-full
            border-r-2 border-b-2 active:border-r-0 active:border-b-0 active:border-t-2 active:border-l-2
          border-zinc-800 hover:border-b-zinc-300 hover:border-r-zinc-300
            text-white px-4 py-2 mt-4
          `}
        >
            Next
        </button>
    </div>
  )
}

export const UserScreen: React.FC<IProps> = () => {
  const [page, setPage] = useUiStore((s) => [s.userPage, s.setUserPage])


  function routing() {

    switch (page) {
      case 'HOME':
        return <SetNamePage/>

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
    <Frame>
      {/* <div>
        <button
        onClick={() => setPage('NAME')}
        >
          name
        </button>
      <button
        onClick={() => setPage('GENERATED_NAME')}
        >
          generated_name
        </button>
      </div> */}
      {/* Current route {page} */}
      {routing()}
    </Frame>
  )
}