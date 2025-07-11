import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BingoGrid from "./BingoGrid";

type Player = { _id: string; username: string };
type Game = {
	_id: string;
	fields: string[];
	playerFields: Record<string, string[]>;
	players: Player[];
	creator: Player;
	readyPlayers: string[];
	started: boolean;
	finished: boolean;
	winner?: { username: string };
};

export const GamePlay: React.FC = () => {
	const { gameId } = useParams();
	const [myId, setMyId] = useState<string | null>(null);
	const [game, setGame] = useState<Game | null>(null);
	const [fields, setFields] = useState<string[]>([]);
	const [suggestionFields, setSuggestionFields] = useState<string[]>([]);
	const [saveButtonStatus, setSaveButtonStatus] = useState<
		"idle" | "saving" | "saved" | "error"
	>("idle");
	const [ready, setReady] = useState(false);
	const [crossed, setCrossed] = useState<boolean[]>(Array(25).fill(false));

	const apiUrl = import.meta.env.VITE_API_URL;

	useEffect(() => {
		fetch(`${apiUrl}/api/auth/me`, { credentials: "include" })
			.then((res) => res.json())
			.then((data) => setMyId(data._id));
	}, []);

	// Fetch suggestion fields ONCE
	useEffect(() => {
		const fetchSuggestions = async () => {
			const response = await fetch(`${apiUrl}/api/bingo/presentation`);
			if (response.ok) {
				const lectureFields = await response.json();
				setSuggestionFields(lectureFields);
			} else {
				setSuggestionFields(Array(25).fill(""));
			}
		};
		fetchSuggestions();
	}, []);

	useEffect(() => {
		if (!myId) return;
		const fetchGame = async () => {
			const res = await fetch(`${apiUrl}/api/game/${gameId}`, {
				credentials: "include",
			});
			const data = await res.json();
			setGame(data);
			if (data.playerFields && data.playerFields[myId]) {
				setFields(data.playerFields[myId]);
			} else if (fields.length === 0 && suggestionFields.length === 25) {
				setFields([...suggestionFields]);
			}
			setReady(data.readyPlayers.includes(myId));
		};
		fetchGame();
		const interval = setInterval(fetchGame, 2000);
		return () => clearInterval(interval);
	}, [gameId, myId, suggestionFields, fields]);

	if (!game || !myId) return <div>Loading game...</div>;

	const allReady = game.readyPlayers.length === game.players.length;

	const handleStart = async () => {
		await fetch(`${apiUrl}/api/game/start/${gameId}`, {
			method: "POST",
			credentials: "include",
		});
	};

	const saveFields = async () => {
		setSaveButtonStatus("saving");
		const res = await fetch(`${apiUrl}/api/game/${gameId}/fields`, {
			method: "PUT",
			credentials: "include",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ fields }),
		});
		if (res.ok) {
			setSaveButtonStatus("saved");
			setTimeout(() => setSaveButtonStatus("idle"), 2000);
		} else {
			setSaveButtonStatus("error");
			setTimeout(() => setSaveButtonStatus("idle"), 2000);
		}
	};

	const handleReady = async () => {
		await saveFields();
		await fetch(`${apiUrl}/api/game/ready/${gameId}`, {
			method: "POST",
			credentials: "include",
		});
		setReady(true);
	};

	const handleFieldChange = (index: number, value: string) => {
		setFields((prev) => {
			const updated = [...prev];
			updated[index] = value;
			return updated;
		});
	};

	const handleFieldClick = (index: number) => {
		if (!ready && !game?.finished) return;
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

	const reportBingo = async () => {
		await fetch(`${apiUrl}/api/game/bingo/${gameId}`, {
			method: "POST",
			credentials: "include",
		});
	};

	return (
		<div className="flex flex-col items-center w-full bg-white pt-8 px-2 box-border mt-10">
			{game.finished && game.winner ? (
				<div className="flex flex-col items-center justify-center h-full text-center">
					<h1 className="text-3xl font-bold mb-2">Game {game._id.slice(-5)}</h1>
					<div className="text-xl mb-1">
						Players: {game.players.map((p) => p.username).join(", ")}
					</div>
					<div className="text-xl mb-1">Creator: {game.creator.username}</div>
					<div className="text-green-600 text-2xl font-bold">
						Winner: {game.winner.username}
					</div>
				</div>
			) : (
				<>
					<div className="flex flex-row justify-between items-start w-full max-w-3xl mb-2">
						<div className="flex flex-col">
							<h1 className="text-xl font-bold mb-0.5">
								Game {game._id.slice(-5)}
							</h1>
							<div className="mb-0.5">
								Players: {game.players.map((p) => p.username).join(", ")}
							</div>
							<div className="mb-0.5">Creator: {game.creator.username}</div>
						</div>
						<div className="flex flex-col items-end gap-1">
							{game.started && !allReady && (
								<>
									<div className="flex flex-row gap-2 items-center">
										<button
											className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow transition"
											onClick={async () => {
												try {
													const response = await fetch(
														`${apiUrl}/api/bingo/presentation`
													);
													if (response.ok) {
														const newFields = await response.json();
														setFields([...newFields]);
														setCrossed(Array(25).fill(false));
													} else {
														alert("Could not fetch new bingo fields.");
													}
												} catch {
													alert("Could not fetch new bingo fields.");
												}
											}}
											disabled={ready}
										>
											New Words
										</button>
										<button
											className={`px-4 py-2 rounded text-white ${
												saveButtonStatus === "saved"
													? "bg-green-600"
													: saveButtonStatus === "error"
													? "bg-red-500"
													: "bg-yellow-500"
											}`}
											onClick={saveFields}
											disabled={ready || saveButtonStatus === "saving"}
										>
											{saveButtonStatus === "saved"
												? "Saved!"
												: saveButtonStatus === "error"
												? "Error"
												: saveButtonStatus === "saving"
												? "Saving..."
												: "Save Fields"}
										</button>
										<button
											className="px-4 py-2 bg-green-500 text-white rounded"
											onClick={handleReady}
											disabled={ready}
										>
											{ready ? "Waiting for others..." : "Ready"}
										</button>
									</div>
									<div className="text-sm">
										Ready: {game.readyPlayers.length} / {game.players.length}
									</div>
								</>
							)}
							{game.started && allReady && hasBingo() && !game.finished && (
								<button
									className="px-4 py-2 bg-blue-500 text-white rounded"
									onClick={reportBingo}
								>
									Report Bingo!
								</button>
							)}
							{!game.started && (
								<>
									{game.creator && game.creator._id === myId ? (
										<button
											className="px-4 py-2 bg-blue-500 text-white rounded"
											onClick={handleStart}
										>
											Start Game (fields become editable)
										</button>
									) : (
										<div>Waiting for creator to start the game...</div>
									)}
								</>
							)}
						</div>
					</div>
					<div className="w-full max-w-3xl flex flex-col items-center">
						{game.started && !allReady ? (
							<BingoGrid
								fields={fields}
								editing={!ready}
								crossed={crossed}
								onFieldChange={handleFieldChange}
								onFieldClick={handleFieldClick}
							/>
						) : game.started && allReady ? (
							<BingoGrid
								fields={fields}
								editing={false}
								crossed={crossed}
								onFieldClick={handleFieldClick}
							/>
						) : null}
					</div>
				</>
			)}
		</div>
	);
};
