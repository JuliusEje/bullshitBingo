import React, { useState } from "react";
import BingoGrid from "./BingoGrid";
import LoginDialog from "./LoginDialog";

export const Home: React.FC = () => {
	const [fields, setFields] = useState<string[]>([]);
	const [crossed, setCrossed] = useState<boolean[]>(Array(25).fill(false));
	const [loading, setLoading] = useState(false);
	const [mode, setMode] = useState<"meeting" | "lecture">("meeting");
	const [editing, setEditing] = useState(true);
	const [bingoStatus, setBingoStatus] = useState<string | null>(null);

	const handleModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setMode(event.target.value as "meeting" | "lecture");
	};

	const handleNewGame = async () => {
		setLoading(true);
		try {
			const response = await fetch(`http://localhost:3000/${mode}`);
			if (!response.ok) throw new Error("Failed to fetch new bingo fields");
			const data = await response.json();
			setFields(data);
			setEditing(true);
			setCrossed(Array(25).fill(false));
		} catch (error) {
			alert("Could not fetch new bingo fields.");
		} finally {
			setLoading(false);
		}
	};

	const handleFieldChange = (index: number, value: string) => {
		setFields((prev) => {
			const updated = [...prev];
			updated[index] = value;
			return updated;
		});
	};

	const handleFieldClick = (index: number) => {
		if (editing) return;
		setCrossed((prev) => {
			const updated = [...prev];
			updated[index] = !updated[index];
			return updated;
		});
	};

	const hasBingo = () => {
		const size = 5;
		const grid = Array(size)
			.fill(0)
			.map((_, i) =>
				Array(size)
					.fill(0)
					.map((_, j) => crossed[i * size + j])
			);
		for (let i = 0; i < size; i++) {
			if (grid[i].every(Boolean)) return true;
			if (grid.map((row) => row[i]).every(Boolean)) return true;
		}
		if (grid.map((row, i) => row[i]).every(Boolean)) return true;
		if (grid.map((row, i) => row[size - 1 - i]).every(Boolean)) return true;
		return false;
	};

	const handleBingo = () => {
		setBingoStatus("You won Bingo!");
	};

	return (
		<div className="flex flex-col items-center w-full min-h-screen bg-white pt-24 px-2 box-border">
			<div className="flex justify-between items-center mb-4">
				<div className="flex gap-2 items-center m-auto">
					<label htmlFor="mode-select" className="font-semibold">
						Type:
					</label>
					<select
						id="mode-select"
						value={mode}
						onChange={handleModeChange}
						className="border rounded px-2 py-1"
						disabled={loading}
					>
						<option value="meeting">Meeting</option>
						<option value="lecture">Lecture</option>
					</select>
					<button
						className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow transition disabled:opacity-50"
						onClick={handleNewGame}
						disabled={loading}
					>
						{loading ? "Loading..." : "New Game"}
					</button>
					{editing ? (
						<button
							className="cursor-pointer bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow transition"
							onClick={() => setEditing(false)}
							disabled={fields.length === 0}
						>
							Start Game
						</button>
					) : (
						<button
							className="cursor-pointer bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg shadow transition"
							onClick={() => setEditing(true)}
						>
							Edit Fields
						</button>
					)}
				</div>
			</div>
			<BingoGrid
				fields={fields}
				editing={editing}
				crossed={crossed}
				onFieldChange={handleFieldChange}
				onFieldClick={handleFieldClick}
			/>
			{!editing && hasBingo() && (
				<div className="mt-4 flex flex-col items-center">
					{!bingoStatus ? (
						<button
							className="px-4 py-2 bg-blue-500 text-white rounded"
							onClick={handleBingo}
						>
							Bingo!
						</button>
					) : (
						<div className="text-green-600 font-semibold">{bingoStatus}</div>
					)}
				</div>
			)}
		</div>
	);
};

export const About: React.FC = () => {
	const [cookies, setCookies] = useState(0);
	const [cps, setCps] = useState(0); // cookies per second
	const [abilities, setAbilities] = useState([
		{ name: "Erster Ruf", cost: 10, cps: 1, owned: 0 },
		{ name: "Glückszahl", cost: 50, cps: 5, owned: 0 },
		{ name: "Muster-Booster", cost: 200, cps: 20, owned: 0 },
		{ name: "Linien-Meister", cost: 1000, cps: 100, owned: 0 },
		{ name: "Volle Karte", cost: 5000, cps: 500, owned: 0 },
		{ name: "Stempel-Sprint", cost: 20000, cps: 2000, owned: 0 },
		{ name: "Eck-Eroberer", cost: 100000, cps: 10000, owned: 0 },
		{ name: "Jackpot-Schub", cost: 500000, cps: 50000, owned: 0 },
		{ name: "Blackout-Blitz", cost: 2000000, cps: 200000, owned: 0 },
		{ name: "Hauptgewinn-Fest", cost: 10000000, cps: 1000000, owned: 0 },
	]);

	// Increase cookies per second
	React.useEffect(() => {
		if (cps > 0) {
			const interval = setInterval(() => setCookies((c) => c + cps), 1000);
			return () => clearInterval(interval);
		}
	}, [cps]);

	const handleCookieClick = () => setCookies((c) => c + 1);

	const buyAbility = (index: number) => {
		const ability = abilities[index];
		if (cookies >= ability.cost) {
			setCookies((c) => c - ability.cost);
			setAbilities((prev) =>
				prev.map((a, i) =>
					i === index
						? { ...a, owned: a.owned + 1, cost: Math.round(a.cost * 1.2) }
						: a
				)
			);
			setCps((prev) => prev + ability.cps);
		}
	};

	const videos = [
		"https://www.youtube.com/embed/kDtcgKbz9Tg",
		"https://www.youtube.com/embed/OEJxpWzao0I",
		"https://www.youtube.com/embed/OqPxaKs8xrk",
		"https://www.youtube.com/embed/xYczF9JoyoE",
		"https://www.youtube.com/embed/L_LUpnjgPso",
		"https://www.youtube.com/embed/dQgtUByOGYA",
		"https://www.youtube.com/embed/zZ7AimPACzc",
		"https://www.youtube.com/embed/J9dvPQuHz-I",
		"https://www.youtube.com/embed/3JZ_D3ELwOQ",
		"https://www.youtube.com/embed/ScMzIvxBSi4",
	];

	return (
		<div
			style={{
				position: "relative",
				width: "100vw",
				height: "100vh",
				overflow: "hidden",
			}}
		>
			<div
				style={{
					position: "absolute",
					inset: 0,
					width: "100vw",
					height: "100vh",
					display: "grid",
					gridTemplateColumns: "repeat(5, 1fr)",
					gridTemplateRows: "repeat(2, 1fr)",
					zIndex: 1,
				}}
			>
				{videos.map((src, idx) => (
					<div
						key={src}
						style={{
							width: "100%",
							height: "100%",
							overflow: "hidden",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							background: "#000",
						}}
					>
						<iframe
							width="120%"
							height="120%"
							style={{
								width: "120%",
								height: "120%",
								aspectRatio: "16/9",
								objectFit: "cover",
								border: "none",
								marginLeft: "-10%",
							}}
							src={`${src}?autoplay=1&controls=0&modestbranding=1&rel=0`}
							title={`YouTube video ${idx + 1}`}
							frameBorder="0"
							allow="autoplay"
						></iframe>
					</div>
				))}
			</div>
			{/* Center content over the grid */}
			<div
				style={{
					position: "absolute",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					zIndex: 2,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					background: "rgba(255,255,255,0.7)",
					borderRadius: "1rem",
					padding: "2rem",
					boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
					minWidth: 350,
					maxWidth: 500,
				}}
			>
				<button
					onClick={handleCookieClick}
					style={{
						background: "none",
						border: "none",
						cursor: "pointer",
						fontSize: "4rem",
						marginBottom: "0.5rem",
						userSelect: "none",
					}}
					aria-label="Cookie"
				>
					🍪
				</button>
				<div style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
					Cookies: {cookies} <br />
					Cookies/Sekunde: {cps}
				</div>
				<p className="mt-4">
					Dies ist ein Schulprojekt von Noah, Felix und Julius im Modul Web
					Engineering.
					<br />
					Im Rahmen dieses Projekts haben wir nicht nur unser Wissen über
					moderne Webtechnologien erweitert, sondern auch gelernt, wie man Bingo
					auf ein völlig neues Level hebt. Unsere Mission war es, das klassische
					Bingo-Spiel mit einer Prise Innovation und einer ordentlichen Portion
					Spaß zu versehen.
					<br />
					Wir bedanken uns bei allen imaginären Einhörnern, die uns auf dieser
					Reise inspiriert haben, und hoffen, dass unser Bullshit-Bingo
					mindestens ebenso viel Freude bereitet wie ein spontaner Regenbogen
					auf dem Pausenhof.
					<br />
					Viel Spaß beim Spielen – und denkt daran: Wer zuerst Bingo ruft,
					bekommt einen virtuellen Keks!
				</p>
				<div className="mt-6 w-full flex flex-col items-center">
					<h3 className="font-semibold mb-2">Abilities</h3>
					<div className="grid grid-cols-2 gap-2">
						{" "}
						{/* Added grid container */}
						{abilities.map((a, i) => (
							<button
								key={a.name}
								onClick={() => buyAbility(i)}
								disabled={cookies < a.cost}
								className="text-xs px-4 py-2 rounded bg-blue-500 text-white disabled:bg-gray-400 flex justify-between items-center w-full" /* w-full for grid item */
							>
								<span>
									{a.name} (x{a.owned})
								</span>
								<span>
									+{a.cps} CPS – {a.cost} 🍪
								</span>
							</button>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export const Contact: React.FC = () => (
	<div>
		<h1>Contact</h1>
		<p>Get in touch with us here.</p>
	</div>
);

export const Pricing: React.FC = () => (
	<div>
		<h1>Pricing</h1>
		<p>See our pricing options.</p>
	</div>
);

export const Login: React.FC = () => <LoginDialog></LoginDialog>;
