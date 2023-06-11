"use client";

import { FullConversationType } from "@/app/types";
import ConversationBox from "./ConversationBox";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useConversation from "@/app/hooks/useConversation";
import clsx from "clsx";

import { MdOutlineGroupAdd } from "react-icons/md";

interface ConversationListProps {
	initialItems: FullConversationType[] | null;
}

const ConversationList: React.FC<ConversationListProps> = ({
	initialItems,
}) => {
	const [items, setItems] = useState(initialItems);

	const router = useRouter();

	const { isOpen, conversationId } = useConversation();
	return (
		<aside
			className={clsx(
				"fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200 ",
				isOpen ? "hidden" : "block w-full left-0"
			)}>
			<div className="px-5">
				<div className="flex justify-between items-center mb-4 pt-4 ">
					<div className="text-2xl font-bold text-neutral-800 ">Messages</div>
					<div className="rounded-full p-2 bg-gray-200 cursor-pointer hover:opacity-75 transition ">
						<MdOutlineGroupAdd size={20} />
					</div>
				</div>
				{items?.map((item, index) => (
					<ConversationBox key={index} data={item} selected={conversationId===item.id} />
				))}
			</div>
		</aside>
	);
};

export default ConversationList;
