import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Game = {
	_id: string;
	players: { username: string }[];
	started: boolean;
	finished: boolean;
	winner?: { username: string };
};

type User = {
	_id: string;
	username: string;
	points?: number;
};

export const GameLobby: React.FC = () => {
	const [games, setGames] = useState<Game[]>([]);
	const [loading, setLoading] = useState(true);
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const navigate = useNavigate();

	const apiUrl = import.meta.env.VITE_API_URL;

	useEffect(() => {
		fetch(`${apiUrl}/api/auth/me`, { credentials: "include" })
			.then((res) => {
				if (!res.ok) throw new Error();
				return res.json();
			})
			.then((user) => setCurrentUser(user))
			.catch(() => setCurrentUser(null));
	}, []);

	useEffect(() => {
		fetch(`${apiUrl}/api/game/list`, { credentials: "include" })
			.then((res) => res.json())
			.then((data) => {
				setGames(Array.isArray(data) ? data : []);
				setLoading(false);
			})
			.catch(() => {
				setGames([]);
				setLoading(false);
			});
	}, []);

	const createGame = async () => {
		const res = await fetch(`${apiUrl}/api/game/create`, {
			method: "POST",
			credentials: "include",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ mode: "meeting" }),
		});
		const data = await res.json();
		navigate(`/game/${data.gameId}`);
	};

	const joinGame = async (gameId: string) => {
		await fetch(`${apiUrl}/api/game/join/${gameId}`, {
			method: "POST",
			credentials: "include",
		});
		navigate(`/game/${gameId}`);
	};

	if (loading || !currentUser) return <div>Loading games...</div>;

	return (
		<div className="p-8">
			<h1 className="text-2xl font-bold mb-4">Game Lobby</h1>
			<button
				className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
				onClick={createGame}
			>
				Create New Game
			</button>
			{games.length === 0 ? (
				<div>No games available. Create a new game to get started!</div>
			) : (
				<ul>
					{games.map((game) => {
						const isPlayer = game.players.some(
							(p) => p.username === currentUser.username
						);
						return (
							<li key={game._id} className="mb-2">
								Game {game._id.slice(-5)} | Players:{" "}
								{game.players.map((p) => p.username).join(", ")}{" "}
								{game.finished && game.winner
									? `(Winner: ${game.winner.username})`
									: ""}
								{!game.started && !game.finished && !isPlayer && (
									<button
										className="ml-2 px-2 py-1 bg-green-500 text-white rounded"
										onClick={() => joinGame(game._id)}
									>
										Join
									</button>
								)}
								{game.started && !game.finished && isPlayer && (
									<button
										className="ml-2 px-2 py-1 bg-blue-500 text-white rounded"
										onClick={() => navigate(`/game/${game._id}`)}
									>
										Rejoin
									</button>
								)}
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);
};
