import React, { useState, useEffect } from "react";
import BingoGrid from "./BingoGrid";
import LoginDialog from "./LoginDialog";

export const Home: React.FC = () => {
  const [fields, setFields] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"meeting" | "lecture">("meeting");
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/auth/me", {
      credentials: "include",
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setUsername(data.username);
        } else {
          setUsername(null);
        }
      })
      .catch(() => setUsername(null));
  }, []);

  const handleModeChange = (newMode: "meeting" | "lecture") => {
    setMode(newMode);
  };

  const handleNewGame = async (selectedMode: "meeting" | "lecture") => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/${selectedMode}`);
      if (!response.ok) throw new Error("Failed to fetch new bingo fields");
      const data = await response.json();
      setFields(data);
    } catch (error) {
      alert("Could not fetch new bingo fields.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      {username && (
        <div className="text-xl font-bold mb-4 text-blue-700">
          Hello {username}
        </div>
      )}
      <BingoGrid
        fields={fields}
        onNewGame={handleNewGame}
        loading={loading}
        mode={mode}
        onModeChange={handleModeChange}
      />
    </div>
  );
};

export const About: React.FC = () => (
  <div>
    <h1>About</h1>
    <p>Learn more about us on this page.</p>
  </div>
);

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