"use client";

import Avatar from "@/app/components/Avatar";
import { FullMessageType } from "@/app/types";
import clsx from "clsx";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import Image from "next/image";
import ImageModal from "./ImageModal";
import { useCallback, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import useConversation from "@/app/hooks/useConversation";

interface MessageBoxProps {
	isLast: boolean;
	data: FullMessageType;
}

const MessageBox: React.FC<MessageBoxProps> = ({ isLast, data }) => {
	const { conversationId } = useConversation();

	const session = useSession();
	const router = useRouter();

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isOptionsOpen, setIsOptionsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const isOwn = session?.data?.user?.email === data?.sender?.email;
	const seenList = (data.seen || [])
		.filter((user) => user.email !== data?.sender?.email)
		.map((user) => user.name)
		.join(", ");

	const container = clsx(`flex gap-3 p-4`, isOwn && "justify-end");

	const avatar = clsx(isOwn && "order-2");

	const body = clsx("flex flex-col gap-2", isOwn && "items-end");

	const message = clsx(
		"text-sm w-fit overflow-hidden",
		isOwn
			? data.image
				? "text-white"
				: "text-white bg-sky-500"
			: "bg-gray-100 ",
		data.image ? "rounded-md p-0" : "rounded-full py-2 px-3"
	);

	const handleCopy = () => {
		data.body && navigator.clipboard.writeText(data.body);

		toast.success("Copied");
	};

	const handleDelete = useCallback(() => {
		setIsLoading(true);
		axios
			.delete(`/api/messages/${data.id}:${conversationId}`)
			.then(() => {
				router.refresh();
			})
			.catch(() => {
				toast.error("Something went wrong");
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, [data.id]);

	return (
		<div className={container}>
			<div className={avatar}>
				<Avatar user={data.sender} />
			</div>
			<div className={body}>
				<div className="flex items-center gap-1">
					<div className="text-sm text-gray-500">{data.sender.name}</div>
					<div className="text-xs text-gray-400">
						{data.createdAt ? format(new Date(data.createdAt), "p") : ""}
					</div>
					<div
						onClick={() => {
							setIsOptionsOpen((current) => {
								return !current;
							});
						}}
						className={clsx(
							`absolute w-screen h-screen top-0 left-0 bg-red-100 opacity-5`,
							isOptionsOpen ? "flex" : "hidden",
						)}
					/>
					<div
						className="relative cursor-pointer"
						onClick={() => {
							setIsOptionsOpen((current) => {
								return !current;
							});
						}}>
						<ul
							className={clsx(
								`absolute gap-1 flex-col bg-purple-100 p-2 py-1 rounded-sm z-50`,
								isOptionsOpen ? "flex" : "hidden",
								isOwn
									? "right-1 top-full translate-y-2"
									: "right-0 translate-x-full"
							)}>
							{!data.image && <li onClick={handleCopy}>Copy</li>}
							{isOwn && <li onClick={handleDelete}>Delete</li>}
						</ul>
						<BsThreeDotsVertical size={15} />
					</div>
				</div>
				<div className={message}>
					{data.image ? (
						<>
							<ImageModal
								isOpen={isModalOpen}
								onClose={() => {
									setIsModalOpen(false);
								}}
								image={data.image}
							/>
							<div
								onClick={() => setIsModalOpen(true)}
								className="relative h-40 w-40 md:h-72 md:w-72 ">
								<Image
									alt="sentimage"
									className="object-contain"
									src={data.image}
									fill
								/>
							</div>
						</>
					) : (
						<div>{data.body}</div>
					)}
				</div>
				{isLast && isOwn && seenList.length > 0 && (
					<div className="text-xs text-gray-400">{`Seen by ${seenList}`}</div>
				)}
			</div>
		</div>
	);
};

export default MessageBox;
