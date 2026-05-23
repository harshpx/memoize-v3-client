import { useState } from "react";
import { Button } from "../ui/button";
import {
	Popover,
	PopoverContent,
	PopoverHeader,
	PopoverTrigger,
} from "../ui/popover";
import { cn } from "@/lib/utils";
import { LuMenu, LuPlus } from "react-icons/lu";
import { useStore } from "@/context/store";
import { conversationCreateHandler } from "@/services/services";

const ConversationDrawer = () => {
	const [open, setOpen] = useState(true);
	const { conversations, selectedConversation, conversationsLoading } =
		useStore();

	const selectConversation = (conversationId: string) => {
		useStore.setState({ selectedConversation: conversationId });
	};
	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					className={cn(
						"rounded-full py-2 px-3 cursor-pointer box-border z-50",
						"bg-accent-light/60 hover:bg-accent-light/80 dark:bg-accent-dark/60 dark:hover:bg-accent-dark/80 text-black dark:text-white",
					)}>
					<LuMenu className="text-xl" />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				align="start"
				className={cn(
					"w-64 rounded-2xl",
					"bg-white/5 dark:bg-black/5 backdrop-blur-md",
					"border border-neutral-100 dark:border-neutral-900",
				)}>
				<PopoverHeader>
					<PopoverHeader>Conversations</PopoverHeader>
					<div className="flex flex-col gap-1 mt-2">
						{conversationsLoading ? (
							<div>Loading...</div>
						) : (
							<>
								{!conversations.find((c) => c.isNew) && (
									<div
										onClick={() => conversationCreateHandler()}
										className={cn(
											"flex gap-1 items-center py-2 px-3 cursor-pointer rounded-xl",
											"bg-black/5 dark:bg-white/10",
										)}>
										<LuPlus className="size-4" />
										<span>New Chat</span>
									</div>
								)}
								{conversations.map((conversation) => (
									<div
										key={conversation.id}
										onClick={() => selectConversation(conversation.id)}
										className={cn(
											"py-2 px-3 cursor-pointer rounded-xl",
											selectedConversation === conversation.id &&
												"bg-accent-light/40 dark:bg-accent-dark/20",
										)}>
										{conversation.name}
									</div>
								))}
							</>
						)}
					</div>
				</PopoverHeader>
			</PopoverContent>
		</Popover>
	);
};

export default ConversationDrawer;
