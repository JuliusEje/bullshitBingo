import React, { useState } from "react";

const CookieClicker = () => {
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

	return (
		<div className="absolute left-0 right-0 top-16 bottom-0 flex items-center justify-center z-10">
			<div className="flex flex-col items-center justify-center bg-white/90 rounded-xl p-4 sm:p-8 shadow-lg w-[95vw] max-w-md">
				<button
					onClick={handleCookieClick}
					className="bg-none border-none cursor-pointer text-5xl sm:text-6xl mb-2 select-none"
					aria-label="Cookie"
				>
					🍪
				</button>
				<div className="font-bold text-base sm:text-lg mb-2 text-center">
					Cookies: {cookies} <br />
					Cookies/Sekunde: {cps}
				</div>
				<p className="mt-4 text-center text-xs sm:text-sm">
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
					<h3 className="font-semibold mb-2 text-sm sm:text-base">Abilities</h3>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
						{abilities.map((a, i) => (
							<button
								key={a.name}
								onClick={() => buyAbility(i)}
								disabled={cookies < a.cost}
								className="text-xs sm:text-sm px-2 sm:px-4 py-2 rounded bg-blue-500 text-white disabled:bg-gray-400 flex justify-between items-center w-full"
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

export default CookieClicker;
