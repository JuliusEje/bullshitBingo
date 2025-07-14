import React, { useEffect, useState } from "react";

export const Profile: React.FC = () => {
	const [profile, setProfile] = useState<{
		username: string;
		points?: number;
	} | null>(null);

	useEffect(() => {
		fetch(`/api/auth/me`, { credentials: "include" })
			.then((res) => (res.ok ? res.json() : null))
			.then((data) => setProfile(data));
	}, []);

	if (!profile) return <div>Loading...</div>;

//	console.log("Profile data:", profile);

	return (
		<div className="p-8">
			<h1 className="text-2xl font-bold mb-4">Profile</h1>
			<div className="mb-2">Username: {profile.username}</div>
			<div className="mb-2">Points: {profile.points ?? 0}</div>
		</div>
	);
};
