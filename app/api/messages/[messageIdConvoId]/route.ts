import getCurrentUser from "@/app/actions/getCurrentUser";
import useConversation from "@/app/hooks/useConversation";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { NextResponse } from "next/server";

interface IParams {
	messageIdConvoId?: string;
}

export async function DELETE(
	request: Request,
	{ params }: { params: IParams }
) {
	const currentUser = await getCurrentUser();
	const { messageIdConvoId } = params;

	
    const messageId = messageIdConvoId &&  messageIdConvoId.split(':')[0];
    const conversationId = messageIdConvoId &&  messageIdConvoId.split(':')[1];

	if (!currentUser?.id) {
		return new NextResponse("Invalid user", { status: 401 });
	}

	try {
		const existingMessage = await prisma.message.findUnique({
			where: {
				id: messageId,
			}
		});

		if (!existingMessage) {
			return new NextResponse("No Message found", { status: 404 });
		}
		const deletedMessage = await prisma.message.delete({
			where: {
				id: messageId,
			},
		});

        
		await pusherServer.trigger(
			conversationId!,
			"messages:delete",
			deletedMessage
		);

		return NextResponse.json(deletedMessage);
	} catch (error) {
        console.log(error);
		return new NextResponse("Server error", { status: 500 });
	}
}
