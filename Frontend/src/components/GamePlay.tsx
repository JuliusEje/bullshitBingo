import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
  const [selected, setSelected] = useState<number[]>([]);
  const [saveStatus, setSaveStatus] = useState<null | string>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/api/auth/me", { credentials: "include" })
      .then(res => res.json())
      .then(data => setMyId(data._id));
  }, []);

  useEffect(() => {
    if (!myId) return;
    const fetchGame = () => {
      fetch(`http://localhost:3000/api/game/${gameId}`, { credentials: "include" })
        .then(res => res.json())
        .then(data => {
          setGame(data);
          if (data.playerFields && data.playerFields[myId]) {
            setFields(data.playerFields[myId]);
          } else {
            setFields(data.fields);
          }
          setReady(data.readyPlayers.includes(myId));
        });
    };
    fetchGame();
    const interval = setInterval(fetchGame, 2000);
    return () => clearInterval(interval);
  }, [gameId, myId]);

  if (!game || !myId) return <div>Loading game...</div>;

  const allReady = game.readyPlayers.length === game.players.length;

  const handleStart = async () => {
    await fetch(`http://localhost:3000/api/game/start/${gameId}`, {
      method: "POST",
      credentials: "include",
    });
  };

  const saveFields = async () => {
    setSaveStatus(null);
    const res = await fetch(`http://localhost:3000/api/game/${gameId}/fields`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fields }),
    });
    if (res.ok) setSaveStatus("Saved!");
    else setSaveStatus("Error saving fields.");
  };

  const handleReady = async () => {
    await saveFields();
    await fetch(`http://localhost:3000/api/game/ready/${gameId}`, {
      method: "POST",
      credentials: "include",
    });
    setReady(true);
  };

  const handleSelect = (idx: number) => {
    if (!selected.includes(idx)) setSelected([...selected, idx]);
  };
  const hasBingo = () => {
    const size = 5;
    const grid = Array(size).fill(0).map((_, i) =>
      Array(size).fill(0).map((_, j) => selected.includes(i * size + j))
    );
    for (let i = 0; i < size; i++) {
      if (grid[i].every(Boolean)) return true;
      if (grid.map(row => row[i]).every(Boolean)) return true;
    }
    if (grid.map((row, i) => row[i]).every(Boolean)) return true;
    if (grid.map((row, i) => row[size - 1 - i]).every(Boolean)) return true;
    return false;
  };
  const reportBingo = async () => {
    await fetch(`http://localhost:3000/api/game/bingo/${gameId}`, {
      method: "POST",
      credentials: "include",
    });
  };

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-2">Game {game._id.slice(-5)}</h1>
      <div className="mb-2">Players: {game.players.map(p => p.username).join(", ")}</div>
      <div className="mb-2">Creator: {game.creator.username}</div>
      {game.finished && game.winner ? (
        <div className="text-green-600 font-bold mb-4">Winner: {game.winner.username}</div>
      ) : !game.started ? (
        game.creator && game.creator._id === myId ? (
          <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={handleStart}>
            Start Game (fields become editable)
          </button>
        ) : (
          <div>Waiting for creator to start the game...</div>
        )
      ) : !allReady ? (
        <>
          <div className="grid grid-cols-5 gap-2 mb-4">
            {fields.map((field, idx) => (
              <input
                key={idx}
                className="p-2 border rounded text-center w-28"
                value={field}
                onChange={e => {
                  const updated = [...fields];
                  updated[idx] = e.target.value;
                  setFields(updated);
                }}
                disabled={ready}
              />
            ))}
          </div>
          <button
            className="mb-4 px-4 py-2 bg-yellow-500 text-white rounded"
            onClick={saveFields}
            disabled={ready}
          >
            Save Fields
          </button>
          <button
            className="mb-4 px-4 py-2 bg-green-500 text-white rounded"
            onClick={handleReady}
            disabled={ready}
          >
            {ready ? "Waiting for others..." : "Ready"}
          </button>
          {saveStatus && <div className="mb-2 text-sm">{saveStatus}</div>}
          <div>
            Ready: {game.readyPlayers.length} / {game.players.length}
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-5 gap-2 mb-4">
            {fields.map((field, idx) => (
              <button
                key={idx}
                className={`p-2 border rounded w-28 ${selected.includes(idx) ? "bg-green-300" : "bg-white"}`}
                onClick={() => handleSelect(idx)}
                disabled={selected.includes(idx) || game.finished}
              >
                {field}
              </button>
            ))}
          </div>
          {hasBingo() && !game.finished && (
            <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={reportBingo}>
              Report Bingo!
            </button>
          )}
        </>
      )}
    </div>
  );
};