import AnimateText from '@app/components/AnimateText'
import { Button } from '@app/components/common/UI'

export const CharacterPage = () => {


  return (
    <div>
      <div className="text-3xl text-shadow mb-2">
        <AnimateText text="Describe your character" />
      </div>

        <input className="w-full px-2 py-1 input-text" type="text" />

        {/* Minecraft button */}
        <Button>
          Create
        </Button>
    </div>
  )
}

export default CharacterPage