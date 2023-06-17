"use client";

import useConversation from "@/app/hooks/useConversation";
import useRoutes from "@/app/hooks/useRoutes";
import MobileItem from "./MobileItem";
import SettingsModal from "../modals/SettingsModal";
import { useState } from "react";
import Avatar from "../Avatar";
import { User } from "@prisma/client";
import clsx from "clsx";
import { signOut } from "next-auth/react";

interface MobileFooterProps {
	currentUser: User;
}

const MobileFooter: React.FC<MobileFooterProps> = ({ currentUser }) => {
	const routes = useRoutes();
	const { isOpen } = useConversation();

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isSettingOpen, setIsSettingOpen] = useState(false);

	if (isOpen) {
		return null;
	}
	return (
		<>
			<SettingsModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				user={currentUser}
			/>
			<div className="fixed justify-between w-full bottom-0 z-40 flex items-center bg-white border-t-[1px] lg:hidden">
				{routes.map(
					(item) =>
						item.label !== "logout" && (
							<MobileItem
								key={item.label}
								label={item.label}
								icon={item.icon}
								href={item.href}
								onClick={item.onClick}
								active={item.active}
							/>
						)
				)}
				<div
					className={clsx(
						`group relative flex gap-x-3 text-sm leading-6 font-semibold w-full justify-center p-4 text-gray-500 hover:text-black`
					)}>
					<div
						className={clsx(
							`absolute -top-2 -translate-y-full bg-slate-100 rounded-t-md text-lg px-3 py-2 text-black `,
							isSettingOpen ? "flex" : "hidden"
						)}>
						<ul className=" flex flex-col">
							<li
								onClick={() => setIsModalOpen(true)}
								className="p-2 hover:opacity-50">
								Profile
							</li>
							<li className="p-2 hover:opacity-50" onClick={() => signOut()}>
								LogOut
							</li>
						</ul>
					</div>
					<div
						onClick={() =>
							setIsSettingOpen((current) => {
								return !current;
							})
						}
						className="cursor-pointer hover:opacity-75 transition">
						<Avatar user={currentUser} />
					</div>
				</div>
			</div>
		</>
	);
};

export default MobileFooter;
