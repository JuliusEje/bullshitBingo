import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { MenuIcon, XIcon } from 'lucide-react'

interface NavLinkType {
  name: string
  path: string
}

const navLinks: NavLinkType[] = [
    { name: 'Home', path: '/' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
]

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  return (
<header className='fixed w-full px-8 shadow-sm shadow-neutral-500 h-14 flex items-center'>
  <nav className='flex justify-between items-center w-full'>
    <NavLink to='/' className='font-bold'>
      Bullshit Bingo
    </NavLink>
    <ul className='flex items-center gap-8'>
      {navLinks.map((link) => (
        <li key={link.name}>
          <NavLink to={link.path}>{link.name}</NavLink>
        </li>
      ))}
      {/* <a
        href='http://localhost:5173/'
        className='rounded-lg py-2 px-4 bg-[#1FABEB]'
      >
        Explore Further
      </a> */}
    </ul>
    <button aria-labelledby='Menu Toggle Button' className='block md:hidden'>
      {isMenuOpen ? (
        <XIcon className='size-6 text-secondary' />
      ) : (
        <MenuIcon className='size-6 text-secondary' />
      )}
    </button>
  </nav>
</header>
  )
}