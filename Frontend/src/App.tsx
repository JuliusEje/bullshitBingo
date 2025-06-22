import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { About, Contact, Home, Login, Pricing } from './components/Pages'
import { Profile } from './components/Profile' 
import { Navbar } from './components/Navbar'
import { GameLobby } from './components/GameLobby'
import { GamePlay } from './components/GamePlay'

function App() {
  return (
    <main>
      <BrowserRouter>
        <Navbar />
        <div className='min-h-screen w-full flex items-center justify-center'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/about' element={<About />} />
            <Route path='/pricing' element={<Pricing />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/login' element={<Login />}></Route>
            <Route path='/profile' element={<Profile />} />
            <Route path='/lobby' element={<GameLobby />} /> 
            <Route path='/game/:gameId' element={<GamePlay />} /> 
          </Routes>
        </div>
      </BrowserRouter>
    </main>
  )
}
export default App