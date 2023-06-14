
import getConversations from "../actions/getConversations";
import getCurrentUser from "../actions/getCurrentUser";
import getUsers from "../actions/getUsers";
import Sidebar from "../components/sidebar/Sidebar";
import ConversationList from "./components/ConversationList";

export default async function UsersLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const conversations = await getConversations();
	const users= await getUsers()
	const currentUser= await getCurrentUser()

	return (
		<Sidebar>
			<div className="h-full">
				<ConversationList users={users} currentUser={currentUser} initialItems={conversations} />
				{children}
			</div>
		</Sidebar>
	);
}
