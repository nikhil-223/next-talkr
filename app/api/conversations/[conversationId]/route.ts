import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

interface IParams {
	conversationId?: string;
}

export async function DELETE(
	request: Request,
	{ params }: { params: IParams }
) {
	const currentUser = await getCurrentUser();
	const { conversationId } = params;

	if (!currentUser?.id) {
		return new NextResponse("Invalid user", { status: 401 });
	}

	try {
		const existingConversation = await prisma.conversation.findUnique({
			where: {
				id: conversationId,
			},
			include: {
				users: true,
			},
		});

		if (!existingConversation) {
			return new NextResponse("No conversation found", { status: 404 });
		}
		const deletedConversation = await prisma.conversation.deleteMany({
			where: {
				id: conversationId,
				userIds: {
					hasSome: [currentUser.id],
				},
			},
		});

		return NextResponse.json(deletedConversation);
	} catch (error) {
		return new NextResponse("Server error", { status: 500 });
	}
}
