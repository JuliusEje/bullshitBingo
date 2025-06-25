import React from "react";

interface BingoGridProps {
	fields: string[];
	editing: boolean;
	crossed: boolean[];
	onFieldChange?: (index: number, value: string) => void;
	onFieldClick?: (index: number) => void;
}

const BingoGrid: React.FC<BingoGridProps> = ({
	fields,
	editing,
	crossed,
	onFieldChange,
	onFieldClick,
}) => {
	return (
		<div
			className="grid grid-cols-5 gap-2 sm:gap-4 mx-auto"
			style={{
				maxWidth: "100vw",
				overflowX: "auto",
			}}
		>
			{fields.length === 0 && (
				<div className="col-span-5 text-center text-gray-400 py-8">
					No bingo fields yet.
				</div>
			)}
			{fields.map((field, index) => (
				<div key={index} className="relative">
					{editing ? (
						<textarea
							value={field}
							onChange={(e) => onFieldChange?.(index, e.target.value)}
							className="h-20 w-20 sm:h-32 sm:w-32 border border-gray-300 rounded-lg text-center p-2 text-sm font-semibold bg-white focus:outline-blue-400 resize-none"
							maxLength={50}
							style={{
								wordBreak: "break-word",
								whiteSpace: "pre-wrap",
								overflowWrap: "break-word",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								textAlign: "center",
							}}
						/>
					) : (
						<button
							className={`relative flex items-center justify-center h-20 w-20 sm:h-32 sm:w-32 border border-gray-300 rounded-lg cursor-pointer transition-colors text-center p-2 text-sm font-semibold
                                ${
																	crossed[index]
																		? "bg-green-100"
																		: "bg-gray-100 hover:bg-blue-100"
																}
                            `}
							onClick={() => onFieldClick?.(index)}
							aria-label={`Bingo field: ${field}`}
							title={`Bingo field: ${field}`}
							data-testid={`bingo-field-${index}`}
							style={{
								wordBreak: "break-word",
								whiteSpace: "pre-wrap",
								overflowWrap: "break-word",
							}}
							data-field={field}
							data-index={index}
						>
							{field}
							{crossed[index] && (
								<span className="absolute inset-0 flex items-center justify-center pointer-events-none">
									<svg width="80%" height="80%" viewBox="0 0 100 100">
										<line
											x1="10"
											y1="10"
											x2="90"
											y2="90"
											stroke="green"
											strokeWidth="8"
											strokeLinecap="round"
										/>
										<line
											x1="90"
											y1="10"
											x2="10"
											y2="90"
											stroke="green"
											strokeWidth="8"
											strokeLinecap="round"
										/>
									</svg>
								</span>
							)}
						</button>
					)}
				</div>
			))}
		</div>
	);
};

export default BingoGrid;
