import React, { useEffect } from 'react'
import { ProjectorScreen } from './screens/Projector/index'
import { UserScreen } from './screens/User/index'
import { AppStorage } from './utils/storage'
import Debugger from './components/Debugger'

// Main page
const MainPage: React.FC = () => {
  return (
    <>
      <div className="bg-white px-2 py-4">
        <p className="text-black bg-white text-xl mb-2">Main page</p>

        <ul className="text-blue-700">
          <li><a href="/projector">Projector</a></li>
          <li><a href="/user">User</a></li>
        </ul>
      </div>
    </>
  )
}

// App
function App() {
  useEffect(() => {
    AppStorage.setup()
  }, [])

  function routing() {
    // By path
    switch (location.pathname) {
      case "/":
        return <MainPage/>

      case "/projector":
        return <ProjectorScreen/>

      case "/user":
        return <UserScreen/>

      default:
        return (
          <p className="text-red-500 bg-white">Not found</p>
        )
    }
  }

  return (
    <>
      <Debugger/>
      <div className="flex justify-center items-center h-screen">
        {routing()}
      </div>
    </>
  )
}

export default App
