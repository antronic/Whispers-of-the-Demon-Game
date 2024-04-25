import Logo from '@app/components/Logo'
import { useUiStore } from '@app/store/ui'

interface IProps {

}

const NamePage = () => {
  return (
    <div>
      <p className="text-3xl text-shadow mb-2">How do I call you?</p>

        <input className="w-full px-2 py-1 input-text" type="text" />

        {/* Minecraft button */}
        <button
          className={`
            text-xl bg-green-500 w-full
            border-r-4 border-b-4 active:border-r-0 active:border-b-0 active:border-t-2 active:border-l-2
          border-zinc-800 hover:border-b-zinc-300 hover:border-r-zinc-300
            text-white px-4 py-2 mt-4
          `}
        >
            Next
        </button>
    </div>
  )
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
        return <NamePage/>

      case 'NAME':
        return <NamePage/>

      case 'CHARACTER':
        return <CharacterPage/>

      default:
        return (
          <p className="text-red-500 bg-white">Not found</p>
        )
    }
  }

  return (
    <div className="w-full max-h-2/3 px-4">
      <div className="mx-auto max-h-2/3 lg:w-3/4 bg-zinc-300 px-6 py-6 border-4 border-black rounded-xl shadow-md">
        <div className="text-[5rem] text-stone-800 text-center">
          <Logo/>
        </div>

        <div className="bg-zinc-500 px-4 py-4 border-2 border-t-zinc-800 border-l-zinc-800">
          {routing()}
        </div>
      </div>
    </div>
  )
}