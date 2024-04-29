import { UIState, useUiStore } from '@app/store/ui'
import { AppStorage } from '@app/utils/storage'

const userPages: UIState['userPage'][] = ['HOME', 'NAME', 'CHARACTER', 'GAME', 'GENERATED_NAME']
const projectorPages: UIState['projectorPage'][] = ['HOME', 'GAME']

export const Debugger = () => {
  const [userPage, setUserPage] = useUiStore((s) => [s.userPage, s.setUserPage])
  const [projectorPage, setProjectorPage] = useUiStore((s) => [s.projectorPage, s.setProjectorPage])

  const navTo = (path: UIState['userPage']) => {
    setUserPage(path)
  }

  const navProjectorTo = (path: UIState['projectorPage']) => {
    setProjectorPage(path)
  }

  return (
    <div className="fixed bottom-0 left-0 w-full bg-black">
      {
        location.pathname === '/user' && (
          <div className="">
            <p className="inline-block mr-2">USER NAV:</p>
            {
              userPages.map((page) => (
                <button
                  className="mr-2"
                  key={page}
                  onClick={() => navTo(page)}
                >
                  {page}
                </button>
              ))
            }
          </div>
        )
      }
      {
        location.pathname === '/projector' && (
          <div className="">
            <p className="inline-block mr-2">PROJECTOR NAV:</p>
            {
              projectorPages.map((page) => (
                <button
                  className="mr-2"
                  key={page}
                  onClick={() => navProjectorTo(page)}
                >
                  {page}
                </button>
              ))
            }
          </div>
        )
      }
    </div>
  )
}

export default Debugger