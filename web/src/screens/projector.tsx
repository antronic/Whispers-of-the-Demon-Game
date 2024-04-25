import Logo from '@app/components/Logo'

const NamePage = () => {
  return (
    <p>Name</p>
  )
}

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

// ====================
interface IProps {

}

export const ProjectorScreen: React.FC<IProps> = () => {
  return (
    <div className="mx-auto max-h-2/3 w-3/4 bg-zinc-300 px-6 py-6 border-4 border-black rounded-xl shadow-md">
      <div className="text-7xl text-black">
        <Logo/>
      </div>
      <CharacterPreviewPage/>
    </div>
  )
}