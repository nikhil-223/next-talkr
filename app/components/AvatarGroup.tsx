"use client";

import { User } from "@prisma/client";
import Image from "next/image";

interface AvatarGroupProps {
	image: string | null;
}

const AvatarGroup: React.FC<AvatarGroupProps> = ({ image }) => {
	return (
		<div className="relative my-1 py-[2px]">
			<div className="relative inline-block rounded-full overflow-hidden h-9 w-9 md:h-11 md:w-11 ">
				<Image
					alt="AvatarGroup"
					width={50}
					height={50}
					src={image || "/images/placeholder.jpg"}
				/>
			</div>
			<span className="absolute block rounded-full bg-green-500 ring-2 ring-white w-2 h-2 md:w-3 md:h-3 top-0 right-0" />
		</div>
	);
};

export default AvatarGroup;
