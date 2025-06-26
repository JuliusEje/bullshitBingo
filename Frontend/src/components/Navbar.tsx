import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { MenuIcon, XIcon } from "lucide-react";

interface NavLinkType {
	name: string;
	path: string;
}

const navLinks: NavLinkType[] = [
	{ name: "Home", path: "/" },
	{ name: "Lobby", path: "/lobby" },
	{ name: "Profile", path: "/profile" },
	{ name: "About", path: "/about" },
	{ name: "Impressum", path: "/impressum" },
];

export const Navbar = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [loggedIn, setLoggedIn] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		fetch("http://localhost:3000/api/auth/me", {
			credentials: "include",
		})
			.then(async (res) => {
				if (res.ok) {
					setLoggedIn(true);
				} else {
					setLoggedIn(false);
				}
			})
			.catch(() => {
				setLoggedIn(false);
			});
	}, [location]);

	const handleSignOut = async () => {
		await fetch("http://localhost:3000/api/auth/logout", {
			method: "POST",
			credentials: "include",
		});
		setLoggedIn(false);
		navigate("/login");
	};

	return (
		<header className="fixed w-full px-8 shadow-sm shadow-neutral-500 h-14 flex items-center bg-white z-50">
			<nav className="flex justify-between items-center w-full">
				<NavLink to="/" className="font-bold">
					Bullshit Bingo
				</NavLink>
				<ul className="hidden md:flex items-center gap-8">
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
						<li>
							<button
								onClick={handleSignOut}
								className="rounded-lg py-2 px-4 bg-red-500 text-white hover:bg-red-600"
							>
								Sign Out
							</button>
						</li>
					)}
				</ul>
				<button
					aria-label="Menu Toggle Button"
					className="block md:hidden"
					onClick={() => setIsMenuOpen(!isMenuOpen)}
				>
					{isMenuOpen ? (
						<XIcon className="size-6 text-secondary" />
					) : (
						<MenuIcon className="size-6 text-secondary" />
					)}
				</button>
				{isMenuOpen && (
					<>
						<div
							className="fixed inset-0 bg-black opacity-75 z-40"
							onClick={() => setIsMenuOpen(false)}
						/>
						<div
							className={`
                fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50
                transform transition-transform duration-300 ease-in-out
                ${isMenuOpen ? "translate-x-0" : "translate-x-full"}
            `}
						>
							<ul className="flex flex-col items-center gap-4 py-8">
								{navLinks.map((link) => (
									<li key={link.name}>
										<NavLink
											to={link.path}
											onClick={() => setIsMenuOpen(false)}
										>
											{link.name}
										</NavLink>
									</li>
								))}
								{!loggedIn ? (
									<li>
										<NavLink to="/login" onClick={() => setIsMenuOpen(false)}>
											Login
										</NavLink>
									</li>
								) : (
									<li>
										<button
											onClick={() => {
												handleSignOut();
												setIsMenuOpen(false);
											}}
											className="rounded-lg py-2 px-4 bg-red-500 text-white hover:bg-red-600"
										>
											Sign Out
										</button>
									</li>
								)}
							</ul>
						</div>
					</>
				)}
			</nav>
		</header>
	);
};
