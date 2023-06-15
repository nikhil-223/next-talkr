"use client";

import { FullConversationType } from "@/app/types";
import ConversationBox from "./ConversationBox";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useConversation from "@/app/hooks/useConversation";
import clsx from "clsx";
import { useMemo } from "react";

import { MdOutlineGroupAdd } from "react-icons/md";
import GroupModal from "./GroupModal";
import { User } from "@prisma/client";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";
import { useSession } from "next-auth/react";

interface ConversationListProps {
	initialItems: FullConversationType[] | [];
	users: User[] | [];
	currentUser: User | null;
}

const ConversationList: React.FC<ConversationListProps> = ({
	initialItems,
	users,
	currentUser,
}) => {
	const [items, setItems] = useState(initialItems);

	const router = useRouter();
	const session = useSession();

	const { isOpen, conversationId } = useConversation();

	const [isModalOpen, setIsModalOpen] = useState(false);

	const pusherKey = useMemo(() => {
		return session.data?.user?.email;
	}, [session.data?.user?.email]);

	useEffect(() => {
		if (!pusherKey) {
			return;
		}

		pusherClient.subscribe(pusherKey);

		const newHandler = (conversation: FullConversationType) => {
			setItems((current) => {
				if (find(current, { id: conversation.id })) {
					return current;
				}

				return [conversation, ...current];
			});
		};

		const updateHandler = (conversation: FullConversationType) => {
			setItems((current) => {
				return current.map((currentConversation) => {
					if (currentConversation.id === conversation.id) {
						return { ...currentConversation, messages: conversation.messages };
					}
					return currentConversation;
				});
			});
		};

		const deleteHandler = (conversation: FullConversationType) => {
			setItems((current) => {
				return [...current.filter(currentConversation=>  currentConversation.id !== conversation.id)]
			});

			if(conversation.id === conversationId){
				router.push('/conversations');
			}
		};

		pusherClient.bind("conversation:new", newHandler);
		pusherClient.bind("conversation:update", updateHandler);
		pusherClient.bind("conversation:delete", deleteHandler);

		return () => {
			pusherClient.unsubscribe(pusherKey);
			pusherClient.unbind("conversation:new", newHandler);
			pusherClient.unbind("conversation:update", updateHandler);
			pusherClient.unbind("conversation:delete", deleteHandler);
		};
	}, [pusherKey,router,conversationId]);

	return (
		<>
			<GroupModal
				users={users}
				currentUser={currentUser}
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			/>
			<aside
				className={clsx(
					"fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200 ",
					isOpen ? "hidden" : "block w-full left-0"
				)}>
				<div className="px-5">
					<div className="flex justify-between items-center mb-4 pt-4 ">
						<div className="text-2xl font-bold text-neutral-800 ">Messages</div>
						<div
							onClick={() => setIsModalOpen(true)}
							className="rounded-full p-2 bg-gray-200 cursor-pointer hover:opacity-75 transition ">
							<MdOutlineGroupAdd size={20} />
						</div>
					</div>
					{items?.map((item, index) => (
						<ConversationBox
							key={index}
							data={item}
							selected={conversationId === item.id}
						/>
					))}
				</div>
			</aside>
		</>
	);
};

export default ConversationList;
