import React, { useState } from "react";
import BingoGrid from "./BingoGrid";
import LoginDialog from "./LoginDialog";
import Videos from "./Videos";
import CookieClicker from "./CookieClicker";

export const Home: React.FC = () => {
	const [fields, setFields] = useState<string[]>([]);
	const [crossed, setCrossed] = useState<boolean[]>(Array(25).fill(false));
	const [loading, setLoading] = useState(false);
	const [mode, setMode] = useState<"meeting" | "lecture" | "presentation">(
		"meeting"
	);
	const [editing, setEditing] = useState(true);
	const [bingoStatus, setBingoStatus] = useState<string | null>(null);

	const apiUrl = import.meta.env.VITE_API_URL;

	// Fetch initial bingo grid on mount
	React.useEffect(() => {
		const fetchInitialFields = async () => {
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
		fetchInitialFields();
		// Only run on mount, not when mode changes
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setMode(event.target.value as "meeting" | "lecture" | "presentation");
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
						<option value="presentation">Präsentation</option>
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
	const videoIds = [
		"kDtcgKbz9Tg",
		"OEJxpWzao0I",
		"OqPxaKs8xrk",
		"xYczF9JoyoE",
		"L_LUpnjgPso",
		"dQgtUByOGYA",
		"zZ7AimPACzc",
		"J9dvPQuHz-I",
		"3JZ_D3ELwOQ",
		"ScMzIvxBSi4",
	];
	const videos = videoIds.map(
		(id) => `https://www.youtube.com/embed/${id}?loop=1`
	);

	return (
		<div className="relative w-screen h-screen overflow-hidden">
			<Videos videos={videos} />
			<CookieClicker />
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
