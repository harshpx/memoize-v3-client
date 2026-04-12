import BgIcons from "@/components/custom/BgIcons";
import CustomizableButton from "@/components/custom/CustomizableButton";
import Loader from "@/components/custom/Loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useStore } from "@/context/store";
import useMediaQuery from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { logoutUser } from "@/services/services";
import { useState, type RefObject } from "react";
import {
	LuNotebookPen,
	LuCalendar,
	LuTrash,
	LuHouse,
	LuCalendarPlus,
} from "react-icons/lu";
import { RiStickyNoteAddLine } from "react-icons/ri";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import {
	usePanelRef,
	type PanelImperativeHandle,
} from "react-resizable-panels";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Logo from "@/components/custom/Logo";

const HomeLayout = () => {
	const isDesktop = useMediaQuery("(min-width: 768px)");
	const sidebarRef = usePanelRef();
	const { pathname } = useLocation();
	const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

	const loading = useStore((state) => state.loading);

	if (loading) {
		return <Loader />;
	}

	return (
		<div className="h-dvh w-full overflow-hidden">
			<ResizablePanelGroup orientation={isDesktop ? "horizontal" : "vertical"}>
				<ResizablePanel
					className={cn("flex", isDesktop ? "p-2" : "p-2 pb-0")}
					collapsible={isDesktop}
					defaultSize={isDesktop ? "200px" : undefined}
					minSize={isDesktop ? "180px" : undefined}
					maxSize={isDesktop ? "240px" : undefined}
					collapsedSize={isDesktop ? "80px" : undefined}
					panelRef={sidebarRef}
					onResize={() => {
						if (sidebarRef.current?.isCollapsed()) {
							setSidebarCollapsed(true);
						} else {
							setSidebarCollapsed(false);
						}
					}}>
					{isDesktop ? (
						<SidebarComponents ref={sidebarRef} collapsed={sidebarCollapsed} />
					) : (
						<div className="relative h-full w-full overflow-hidden">
							<Outlet />
							<BgIcons className="text-accent-dark" iconOpacity={0.1} />
						</div>
					)}
				</ResizablePanel>
				{(isDesktop || pathname !== "/home/notes/editor") && (
					<>
						<ResizableHandle className=" invisible w-0" />
						<ResizablePanel
							className={cn("flex shrink", isDesktop ? "p-2 pl-0" : "p-2")}
							defaultSize={isDesktop ? undefined : "70px"}
							minSize={isDesktop ? undefined : "70px"}
							maxSize={isDesktop ? undefined : "70px"}>
							{isDesktop ? (
								<div className="relative h-full w-full overflow-hidden">
									<Outlet />
									<BgIcons className="text-accent-dark" iconOpacity={0.1} />
								</div>
							) : (
								<DockComponents />
							)}
						</ResizablePanel>
					</>
				)}
			</ResizablePanelGroup>
		</div>
	);
};

const SidebarComponents = ({
	ref,
	collapsed,
}: {
	ref: RefObject<PanelImperativeHandle | null>;
	collapsed: boolean;
}) => {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	return (
		<div
			className="
			w-full flex flex-col grow gap-1 px-2 py-2 rounded-xl 
			border bg-neutral-100 dark:bg-neutral-900 shadow-sm
		">
			{/* Nav group 1 */}
			<div className="flex flex-col gap-2 mb-4">
				<div className={cn("flex gap-2", collapsed ? "flex-col" : "flex-row")}>
					<Logo
						className="grow text-black dark:text-white"
						iconOnly={collapsed}
					/>
					<CustomizableButton
						onClick={() => {
							if (ref.current?.isCollapsed()) {
								ref.current?.expand();
							} else {
								ref.current?.collapse();
							}
						}}
						className={`p-2 border ${collapsed ? "order-1 w-full" : "order-2 w-[40px]"}`}>
						{collapsed ? <IoChevronForward /> : <IoChevronBack />}
					</CustomizableButton>
				</div>
				<div className={cn("flex gap-1", collapsed ? "flex-col" : "flex-row")}>
					<CustomizableButton
						onClick={() =>
							navigate("/home/notes/editor", { state: { note: null } })
						}
						className={`grow flex-nowrap bg-accent-light/80 dark:bg-accent-dark/70 gap-1 truncate ${collapsed ? "order-2" : "order-1"}`}>
						<RiStickyNoteAddLine size={16} className="shrink-0" />
						{!collapsed && (
							<span className="text-[12px] truncate text-nowrap">Add Note</span>
						)}
					</CustomizableButton>
					<CustomizableButton
						onClick={() =>
							navigate("/home/events/editor", { state: { event: undefined } })
						}
						className={`grow flex-nowrap bg-accent-light/80 dark:bg-accent-dark/70 gap-1 truncate ${collapsed ? "order-2" : "order-1"}`}>
						<LuCalendarPlus size={16} className="shrink-0" />
						{!collapsed && (
							<span className="text-[12px] truncate text-nowrap">
								Add Event
							</span>
						)}
					</CustomizableButton>
				</div>
			</div>
			{/* Nav group 2 */}
			<div className="flex flex-col gap-1 grow">
				<CustomizableButton
					onClick={() => navigate("/home")}
					className={cn(
						"w-full hover:bg-accent-light/40 dark:hover:bg-accent-light/30",
						pathname === "/home"
							? "bg-accent-light/40 dark:bg-accent-light/30"
							: "",
						collapsed ? "justify-center" : "justify-start",
					)}>
					<div
						className={cn(
							"flex items-center gap-1",
							collapsed && "flex-col gap-0.5",
						)}>
						<LuHouse />
						<span className={cn(collapsed ? "text-[10px]" : "text-[14px]")}>
							Home
						</span>
					</div>
				</CustomizableButton>
				<CustomizableButton
					onClick={() => navigate("/home/notes")}
					className={cn(
						"w-full hover:bg-accent-light/40 dark:hover:bg-accent-light/30",
						pathname.split("/").includes("notes")
							? "bg-accent-light/40 dark:bg-accent-light/30"
							: "",
						collapsed ? "justify-center" : "justify-start",
					)}>
					<div
						className={cn(
							"flex items-center gap-1",
							collapsed && "flex-col gap-0.5",
						)}>
						<LuNotebookPen />
						<span className={cn(collapsed ? "text-[10px]" : "text-[14px]")}>
							Notes
						</span>
					</div>
				</CustomizableButton>
				<CustomizableButton
					onClick={() => navigate("/home/events")}
					className={cn(
						"w-full hover:bg-accent-light/40 dark:hover:bg-accent-light/30",
						pathname.split("/").includes("events")
							? "bg-accent-light/40 dark:bg-accent-light/30"
							: "",
						collapsed ? "justify-center" : "justify-start",
					)}>
					<div
						className={cn(
							"flex items-center gap-1",
							collapsed && "flex-col gap-0.5",
						)}>
						<LuCalendar />
						<span className={cn(collapsed ? "text-[10px]" : "text-[14px]")}>
							Events
						</span>
					</div>
				</CustomizableButton>
				<CustomizableButton
					onClick={() => navigate("/home/trash")}
					className={cn(
						"w-full hover:bg-accent-light/40 dark:hover:bg-accent-light/30",
						pathname.split("/").includes("trash")
							? "bg-accent-light/40 dark:bg-accent-light/30"
							: "",
						collapsed ? "justify-center" : "justify-start",
					)}>
					<div
						className={cn(
							"flex items-center gap-1",
							collapsed && "flex-col gap-0.5",
						)}>
						<LuTrash />
						<span className={cn(collapsed ? "text-[10px]" : "text-[14px]")}>
							Trash
						</span>
					</div>
				</CustomizableButton>
			</div>
			{/* Nav group 3 */}
			<div>
				<UserPopover collapsed={collapsed} />
			</div>
		</div>
	);
};

const DockComponents = () => {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	if (pathname === "/home/notes/editor" || pathname === "/home/events/editor") {
		return null;
	}
	return (
		<div
			className="
			w-full flex grow gap-1 px-2 py-1 rounded-xl items-center
			border bg-neutral-100 dark:bg-neutral-900 shadow-sm
		">
			{/* Nav group 1 */}
			<div className="flex gap-1 grow">
				<CustomizableButton
					onClick={() => navigate("/home")}
					className={cn(
						"hover:bg-accent-light/40 dark:hover:bg-accent-light/30",
						pathname.split("/").reverse()?.[0] === "home"
							? "bg-accent-light/40 dark:bg-accent-light/30"
							: "",
					)}>
					<div className="flex flex-col items-center justify-center">
						<LuHouse className="size-4" />
						<span className="text-[10px]">Home</span>
					</div>
				</CustomizableButton>
				<CustomizableButton
					onClick={() => navigate("/home/notes")}
					className={cn(
						"hover:bg-accent-light/40 dark:hover:bg-accent-light/30",
						pathname.split("/").reverse()?.[0] === "notes"
							? "bg-accent-light/40 dark:bg-accent-light/30"
							: "",
					)}>
					<div className="flex flex-col items-center justify-center">
						<LuNotebookPen className="size-4" />
						<span className="text-[10px]">Notes</span>
					</div>
				</CustomizableButton>
				<CustomizableButton
					onClick={() => navigate("/home/events")}
					className={cn(
						"hover:bg-accent-light/40 dark:hover:bg-accent-light/30",
						pathname.split("/").reverse()?.[0] === "events"
							? "bg-accent-light/40 dark:bg-accent-light/30"
							: "",
					)}>
					<div className="flex flex-col items-center justify-center">
						<LuCalendar className="size-4" />
						<span className="text-[10px]">Events</span>
					</div>
				</CustomizableButton>
				<CustomizableButton
					onClick={() => navigate("/home/trash")}
					className={cn(
						"hover:bg-accent-light/40 dark:hover:bg-accent-light/30",
						pathname.split("/").reverse()?.[0] === "trash"
							? "bg-accent-light/40 dark:bg-accent-light/30"
							: "",
					)}>
					<div className="flex flex-col items-center justify-center">
						<LuTrash className="size-4" />
						<span className="text-[10px]">Trash</span>
					</div>
				</CustomizableButton>
			</div>
			<div>
				<UserPopover />
			</div>
		</div>
	);
};

const UserPopover = ({ collapsed = true }: { collapsed?: boolean }) => {
	const { user, logout } = useStore();
	const isDesktop = useMediaQuery("(min-width: 768px)");
	const [popoverOpen, setPopoverOpen] = useState(false);
	const logoutHandler = async () => {
		try {
			await logoutUser();
		} catch (error) {
			if (error instanceof Error) {
				console.error("Logout failed:", error.message.substring(0, 30));
			} else {
				console.error("DB hit failed for logout, doing client side cleanup");
			}
		} finally {
			logout();
		}
	};

	return (
		<Popover onOpenChange={(open) => setPopoverOpen(open)}>
			<PopoverTrigger asChild>
				<Button
					variant="ghost"
					className={cn(
						`w-full p-0 rounded-xl 
						flex justify-start items-center gap-2 overflow-hidden cursor-pointer
						`,
						collapsed ? "justify-center" : "justify-start",
						popoverOpen
							? "bg-accent text-accent-foreground hover:bg-accent/50"
							: "",
					)}>
					<Avatar className="">
						<AvatarImage src={user?.avatarUrl || ""} />
						<AvatarFallback>
							{user?.name?.[0] || user?.username?.[0] || "U"}
						</AvatarFallback>
					</Avatar>
					{!collapsed && (
						<span className="text-sm font-normal">
							{user?.name || user?.username}
						</span>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent
				side={isDesktop ? "right" : "top"}
				align="end"
				className={cn("border rounded-xl", isDesktop ? "ml-3" : "mb-3 -mr-2")}>
				<div className="flex flex-col gap-4">
					{/* avatar & user info */}
					<div className="flex gap-4 items-center">
						<Avatar className="size-14">
							<AvatarImage src={user?.avatarUrl || ""} />
							<AvatarFallback>
								{user?.name?.[0] || user?.username?.[0] || "U"}
							</AvatarFallback>
						</Avatar>
						<div className="flex flex-col">
							<span className="text-xl">{user?.name || user?.username}</span>
							<span className="text-sm font-light italic">{user?.email}</span>
						</div>
					</div>
					{/* actions */}
					<div className="flex flex-col gap-1">
						<CustomizableButton
							className="w-full bg-neutral-200 dark:bg-neutral-800"
							onClick={logoutHandler}>
							<span className="text-sm">Logout</span>
						</CustomizableButton>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
};

export default HomeLayout;
