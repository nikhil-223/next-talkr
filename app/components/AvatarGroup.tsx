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
		</div>
	);
};

export default AvatarGroup;
