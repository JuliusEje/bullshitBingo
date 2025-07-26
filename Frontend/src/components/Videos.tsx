import React from "react";

interface VideosProps {
	videos: string[];
}

const Videos: React.FC<VideosProps> = ({ videos }) => (
	<div className="inset-0 w-screen h-screen grid grid-cols-5 grid-rows-2 z-[1]">
		{videos.map((src, idx) => (
			<div
				key={src}
				className="w-full h-full flex items-center justify-center bg-black overflow-hidden"
			>
				<iframe
					className="w-[120%] h-[120%] object-cover border-none -ml-[10%]"
					src={`${src}&autoplay=1&controls=0&modestbranding=1&rel=0`}
					title={`YouTube video ${idx + 1}`}
					frameBorder="0"
					allow="autoplay"
				></iframe>
			</div>
		))}
	</div>
);

export default Videos;
