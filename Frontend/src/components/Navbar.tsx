import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { MenuIcon, XIcon } from 'lucide-react'

interface NavLinkType {
  name: string
  path: string
}

const navLinks: NavLinkType[] = [
  { name: 'Home', path: '/' },
  { name: 'Lobby', path: '/lobby' },
  { name: 'Pricing', path: '/pricing' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
  { name: 'Profile', path: '/profile' },
]

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [username, setUsername] = useState<string | null>(null)
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/api/auth/me", {
      credentials: "include",
    })
      .then(async res => {
        if (res.ok) {
          const data = await res.json();
          setLoggedIn(true);
          setUsername(data.username);
        } else {
          setLoggedIn(false);
          setUsername(null);
        }
      })
      .catch(() => {
        setLoggedIn(false);
        setUsername(null);
      });
  }, []);

  const handleSignOut = async () => {
    await fetch("http://localhost:3000/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setLoggedIn(false);
    setUsername(null);
    navigate("/login");
  };

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
          {!loggedIn ? (
            <li>
              <NavLink to="/login">Login</NavLink>
            </li>
          ) : (
            <>
              <li>
                <span className="font-semibold text-blue-700">Hello {username}</span>
              </li>
              <li>
                <button
                  onClick={handleSignOut}
                  className="rounded-lg py-2 px-4 bg-red-500 text-white hover:bg-red-600"
                >
                  Sign Out
                </button>
              </li>
            </>
          )}
        </ul>
        <button
          aria-label='Menu Toggle Button'
          className='block md:hidden'
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
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