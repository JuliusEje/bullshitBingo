import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginDialog: React.FC = () => {
	const [showSignup, setShowSignup] = useState(false);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [passwordRepeat, setPasswordRepeat] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const navigate = useNavigate();

	const isStrongPassword = (pw: string) =>
		/[A-Z]/.test(pw) &&
		/[a-z]/.test(pw) &&
		/[0-9]/.test(pw) &&
		/[^A-Za-z0-9]/.test(pw) &&
		pw.length >= 8;

	const passwordStrengthError =
		showSignup && password.length > 0 && !isStrongPassword(password)
			? "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
			: "";

	const passwordsMatch =
		!showSignup || passwordRepeat.length === 0 || password === passwordRepeat;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setSuccess("");
		if (showSignup) {
			if (password !== passwordRepeat) {
				setError("Passwords do not match.");
				return;
			}
			if (!isStrongPassword(password)) {
				setError(
					"Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
				);
				return;
			}
			try {
				const response = await fetch(
					"http://localhost:3000/api/auth/register",
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						credentials: "include",
						body: JSON.stringify({ username, password }),
					}
				);
				if (response.ok) {
					setSuccess("Signup successful! Redirecting to login...");
					setTimeout(() => {
						setShowSignup(false);
						setSuccess("");
						setUsername("");
						setPassword("");
						setPasswordRepeat("");
					}, 1500);
				} else {
					const data = await response.json();
					setError(data?.error || "Signup failed.");
				}
			} catch (err) {
				setError("Signup failed. Server not reachable.");
			}
		} else {
			try {
				const response = await fetch("http://localhost:3000/api/auth/login", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
					body: JSON.stringify({ username, password }),
				});
				if (response.ok) {
					const data = await response.json();
					if (data.sessionId) {
						document.cookie = `sessionId=${data.sessionId}; path=/; max-age=${
							60 * 60 * 24 * 7
						}`;
					}
					setSuccess("Login successful! Redirecting...");
					setTimeout(() => {
						navigate("/");
					}, 1000);
				} else {
					const data = await response.json();
					setError(data?.error || "Login failed.");
				}
			} catch (err) {
				setError("Login failed. Server not reachable.");
			}
		}
	};

	return (
		<div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md max-w-xs mx-auto">
			<h2 className="text-2xl font-bold mb-4">
				{showSignup ? "Sign Up" : "Login"}
			</h2>
			<form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
				<input
					type="text"
					placeholder="Username"
					className="border rounded px-3 py-2"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					required
				/>
				<input
					type="password"
					placeholder="Password"
					className="border rounded px-3 py-2"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>
				{showSignup && (
					<>
						<input
							type="password"
							placeholder="Repeat Password"
							className="border rounded px-3 py-2"
							value={passwordRepeat}
							onChange={(e) => setPasswordRepeat(e.target.value)}
							required
						/>
						{passwordStrengthError && (
							<div className="text-red-500 text-xs text-center">
								{passwordStrengthError}
							</div>
						)}
						{!passwordsMatch && (
							<div className="text-red-500 text-xs text-center">
								Passwords do not match.
							</div>
						)}
					</>
				)}
				{error && (
					<div className="text-red-500 text-sm text-center">{error}</div>
				)}
				{success && (
					<div className="text-green-600 text-sm text-center">{success}</div>
				)}
				<button
					type="submit"
					className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
				>
					{showSignup ? "Sign Up" : "Login"}
				</button>
			</form>
			<div className="mt-4">
				{showSignup ? (
					<button
						className="text-blue-500 hover:underline text-sm"
						onClick={() => {
							setShowSignup(false);
							setError("");
							setSuccess("");
							setPassword("");
							setPasswordRepeat("");
						}}
						disabled={!!success}
					>
						Already have an account? Login
					</button>
				) : (
					<button
						className="text-blue-500 hover:underline text-sm"
						onClick={() => {
							setShowSignup(true);
							setError("");
							setSuccess("");
							setPassword("");
							setPasswordRepeat("");
						}}
					>
						Don't have an account? Sign up
					</button>
				)}
			</div>
		</div>
	);
};

export default LoginDialog;
