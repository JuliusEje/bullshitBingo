import React, { useState } from "react";
import BingoGrid from "./BingoGrid";
import LoginDialog from "./LoginDialog";
import Videos from "./Videos";

export const Home: React.FC = () => {
	const [fields, setFields] = useState<string[]>([]);
	const [crossed, setCrossed] = useState<boolean[]>(Array(25).fill(false));
	const [loading, setLoading] = useState(false);
	const [mode, setMode] = useState<"meeting" | "lecture">("meeting");
	const [editing, setEditing] = useState(true);
	const [bingoStatus, setBingoStatus] = useState<string | null>(null);

	const apiUrl = import.meta.env.VITE_API_URL;

	const handleModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setMode(event.target.value as "meeting" | "lecture");
	};

	const handleNewGame = async () => {
		setLoading(true);
		try {
			const response = await fetch(`${apiUrl}/api/bingo/${mode}`);
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
						Bingo Mode:
					</label>
					<select
						id="mode-select"
						value={mode}
						onChange={handleModeChange}
						className="border rounded px-2 py-1"
						disabled={loading}
					>
						<option value="meeting">Meeting</option>
						<option value="lecture">Vorlesung</option>
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
	const [cps, setCps] = useState(0);
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
		<div className="relative w-screen h-screen overflow-hidden">
			<Videos videos={videos} />
			{/* Center content over the grid */}
			<div className="absolute top-1/2 left-1/2 z-10 flex flex-col items-center justify-center bg-white/70 rounded-xl p-8 shadow-lg min-w-[350px] max-w-[500px] -translate-x-1/2 -translate-y-1/2">
				<button
					onClick={handleCookieClick}
					className="bg-none border-none cursor-pointer text-6xl mb-2 select-none"
					aria-label="Cookie"
				>
					🍪
				</button>
				<div className="font-bold text-lg mb-2">
					Cookies: {cookies} <br />
					Cookies/Sekunde: {cps}
				</div>
				<p className="mt-4 text-center">
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
					<div className="grid grid-cols-2 gap-2 w-full">
						{abilities.map((a, i) => (
							<button
								key={a.name}
								onClick={() => buyAbility(i)}
								disabled={cookies < a.cost}
								className="text-xs px-4 py-2 rounded bg-blue-500 text-white disabled:bg-gray-400 flex justify-between items-center w-full"
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

export const Impressum: React.FC = () => (
	<div>
		<h1 className="font-extrabold text-5xl">Impressum</h1>
		<br />
		<p className="font-bold">Angaben gemäß § 5 TMG:</p>
		<p>
			Felix Karg
			<br />
			Franziska-Zellner-Weg 35
			<br />
			85567 Grafing b. München
			<br />
			Deutschland
		</p>
		<br />
		<p className="font-bold">Kontakt:</p>
		<p>
			E-Mail: <a href="mailto:felix.karg@gmx.net">felix.karg@gmx.net</a>
		</p>
		<br />

		<p className="font-bold">
			Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:
		</p>
		<p>
			Felix Karg
			<br />
			Franziska-Zellner-Weg 35
			<br />
			85567 Grafing b. München
			<br />
			Deutschland
		</p>
		<br />
	</div>
);

export const Pricing: React.FC = () => (
	<div>
		<h1>Pricing</h1>
		<p>See our pricing options.</p>
	</div>
);

export const Login: React.FC = () => <LoginDialog></LoginDialog>;
