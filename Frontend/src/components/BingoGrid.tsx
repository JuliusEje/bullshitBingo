import React, { useState, useEffect } from "react";

interface BingoGridProps {
  fields: string[];
  onNewGame: (mode: "meeting" | "lecture") => void;
  loading?: boolean;
  mode: "meeting" | "lecture";
  onModeChange: (mode: "meeting" | "lecture") => void;
}

const BingoGrid: React.FC<BingoGridProps> = ({
  fields,
  onNewGame,
  loading,
  mode,
  onModeChange,
}) => {
  const [editing, setEditing] = useState(true);
  const [customFields, setCustomFields] = useState<string[]>([]);
  const [crossed, setCrossed] = useState<boolean[]>([]);

  useEffect(() => {
    setCustomFields(fields);
    setCrossed(Array(fields.length).fill(false));
  }, [fields]);

  const handleFieldChange = (index: number, value: string) => {
    setCustomFields((prev) => {
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

  const startGame = () => {
    setEditing(false);
    setCrossed(Array(customFields.length).fill(false));
  };

  const editGame = () => {
    setEditing(true);
    setCrossed(Array(customFields.length).fill(false));
  };

  const handleModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onModeChange(event.target.value as "meeting" | "lecture");
  };

  return (
    <div className="max-w-6xl mx-auto p-4 w-72 sm:w-96 md:w-128 lg:w-160 xl:w-192">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2 items-center m-auto">
          <label htmlFor="mode-select" className="font-semibold">Type:</label>
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
            onClick={() => onNewGame(mode)}
            disabled={loading}
          >
            {loading ? "Loading..." : "New Game"}
          </button>
          {editing ? (
            <button
              className="cursor-pointer bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow transition"
              onClick={startGame}
              disabled={customFields.length === 0}
            >
              Start Game
            </button>
          ) : (
            <button
              className="cursor-pointer bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg shadow transition"
              onClick={editGame}
            >
              Edit Fields
            </button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-5 gap-4">
        {customFields.length === 0 && (
          <div className="col-span-5 text-center text-gray-400 py-8">
            No bingo fields yet. Click "New Game" to fetch fields.
          </div>
        )}
        {customFields.map((field, index) => (
          <div key={index} className="relative">
            {editing ? (
              <textarea
                value={field}
                onChange={(e) => handleFieldChange(index, e.target.value)}
                className="h-32 w-32 border border-gray-300 rounded-lg text-center p-2 text-sm font-semibold bg-white focus:outline-blue-400 resize-none"
                maxLength={50}
                style={{
                  wordBreak: "break-word",
                  whiteSpace: "pre-wrap",
                  overflowWrap: "break-word",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center"
                }}
              />
            ) : (
              <button
                className={`relative flex items-center justify-center h-32 w-32 border border-gray-300 rounded-lg cursor-pointer transition-colors text-center p-2 text-sm font-semibold
                  ${crossed[index] ? "bg-green-100" : "bg-gray-100 hover:bg-blue-100"}
                `}
                onClick={() => handleFieldClick(index)}
                aria-label={`Bingo field: ${field}`}
                title={`Bingo field: ${field}`}
                data-testid={`bingo-field-${index}`}
                style={{ wordBreak: "break-word", whiteSpace: "pre-wrap", overflowWrap: "break-word" }}
                data-field={field}
                data-index={index}
              >
                {field}
                {crossed[index] && (
                  <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <svg width="80%" height="80%" viewBox="0 0 100 100">
                      <line x1="10" y1="10" x2="90" y2="90" stroke="green" strokeWidth="8" strokeLinecap="round" />
                      <line x1="90" y1="10" x2="10" y2="90" stroke="green" strokeWidth="8" strokeLinecap="round" />
                    </svg>
                  </span>
                )}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BingoGrid;