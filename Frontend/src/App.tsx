import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { About, Contact, Home, Pricing } from './components/Pages'
import { Navbar } from './components/Navbar'

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
          </Routes>
        </div>
      </BrowserRouter>
    </main>
  )
}
export default App