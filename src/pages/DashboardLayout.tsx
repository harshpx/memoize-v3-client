import CustomizableButton from "@/components/custom/CustomizableButton";
import Loader from "@/components/custom/Loader";
import ThemeSwitch from "@/components/custom/ThemeSwitch";
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
import type { Note } from "@/lib/commonTypes";
import { cn } from "@/lib/utils";
import { fetchNotes } from "@/services/apis";
import { logoutUser } from "@/services/services";
import { useEffect, useState } from "react";
import { FaTasks } from "react-icons/fa";
import { LuNotebookPen } from "react-icons/lu";
import { MdDashboardCustomize } from "react-icons/md";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { usePanelRef } from "react-resizable-panels";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const DashboardLayout = () => {
	const isDesktop = useMediaQuery("(min-width: 768px)");
	const sidebarRef = usePanelRef();
	const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
	const { setNotes, loading, setLoading } = useStore();

	// fetch notes on mount!
	useEffect(() => {
		(async () => {
			setLoading(true);
			try {
				const notes: Note[] = await fetchNotes();
				setNotes(notes);
			} catch (error) {
				const errorMessage: string =
					error instanceof Error ? error.message : "Failed to fetch notes";
				console.error(errorMessage);
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	if (loading) {
		return <Loader />;
	}

	return (
		<div className="h-screen w-full overflow-hidden">
			<div className="absolute right-2 top-2">
				<ThemeSwitch />
			</div>
			<ResizablePanelGroup orientation={isDesktop ? "horizontal" : "vertical"}>
				<ResizablePanel
					className={cn("flex", isDesktop ? "p-2" : "p-2 pb-0")}
					collapsible={isDesktop}
					defaultSize={isDesktop ? "250px" : undefined}
					minSize={isDesktop ? "180px" : undefined}
					maxSize={isDesktop ? "300px" : undefined}
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
						<SidebarComponents collapsed={sidebarCollapsed} />
					) : (
						<Outlet />
					)}
				</ResizablePanel>
				<ResizableHandle className=" invisible w-0" />
				<ResizablePanel
					className={cn("flex", isDesktop ? "p-2 pl-0" : "p-2")}
					defaultSize={isDesktop ? undefined : "70px"}
					minSize={isDesktop ? undefined : "70px"}
					maxSize={isDesktop ? undefined : "70px"}>
					{isDesktop ? <Outlet /> : <DockComponents />}
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
};

const SidebarComponents = ({ collapsed }: { collapsed: boolean }) => {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	return (
		<div
			className="
			w-full flex flex-col grow gap-1 px-2 py-2 rounded-xl 
			border bg-neutral-100 dark:bg-neutral-900 shadow-sm
		">
			{/* Nav group 1 */}
			<div className="flex flex-col gap-1 grow">
				<CustomizableButton
					onClick={() => navigate("/dashboard")}
					className={cn(
						"w-full hover:bg-accent-light/40 dark:hover:bg-accent-light/30",
						pathname === "/dashboard"
							? "bg-accent-light/40 dark:bg-accent-light/30"
							: "",
						collapsed ? "justify-center" : "justify-start",
					)}>
					<div className="flex items-center gap-1">
						<TbLayoutDashboardFilled />
						<span className="text-sm">{collapsed ? "" : "Dashboard"}</span>
					</div>
				</CustomizableButton>
				<CustomizableButton
					onClick={() => navigate("/dashboard/notes")}
					className={cn(
						"w-full hover:bg-accent-light/40 dark:hover:bg-accent-light/30",
						pathname === "/dashboard/notes"
							? "bg-accent-light/40 dark:bg-accent-light/30"
							: "",
						collapsed ? "justify-center" : "justify-start",
					)}>
					<div className="flex items-center gap-1">
						<LuNotebookPen />
						<span className="text-sm">{collapsed ? "" : "Notes"}</span>
					</div>
				</CustomizableButton>
				<CustomizableButton
					onClick={() => navigate("/dashboard/tasks")}
					className={cn(
						"w-full hover:bg-accent-light/40 dark:hover:bg-accent-light/30",
						pathname === "/dashboard/tasks"
							? "bg-accent-light/40 dark:bg-accent-light/30"
							: "",
						collapsed ? "justify-center" : "justify-start",
					)}>
					<div className="flex items-center gap-1">
						<FaTasks />
						<span className="text-sm">{collapsed ? "" : "Tasks"}</span>
					</div>
				</CustomizableButton>
			</div>
			<div>
				<UserPopover collapsed={collapsed} />
			</div>
		</div>
	);
};

const DockComponents = () => {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	return (
		<div
			className="
			w-full flex grow gap-1 px-2 py-2 rounded-xl 
			border bg-neutral-100 dark:bg-neutral-900 shadow-sm
		">
			{/* Nav group 1 */}
			<div className="flex gap-1 grow">
				<CustomizableButton
					onClick={() => navigate("/dashboard")}
					className={cn(
						"hover:bg-accent-light/40 dark:hover:bg-accent-light/30",
						pathname === "/dashboard"
							? "bg-accent-light/40 dark:bg-accent-light/30"
							: "",
					)}>
					<div className="flex flex-col items-center justify-center gap-1">
						<MdDashboardCustomize className="size-5" />
					</div>
				</CustomizableButton>
				<CustomizableButton
					onClick={() => navigate("/dashboard/notes")}
					className={cn(
						"hover:bg-accent-light/40 dark:hover:bg-accent-light/30",
						pathname === "/dashboard/notes"
							? "bg-accent-light/40 dark:bg-accent-light/30"
							: "",
					)}>
					<div className="flex flex-col items-center justify-center gap-1">
						<LuNotebookPen className="size-5" />
					</div>
				</CustomizableButton>
				<CustomizableButton
					onClick={() => navigate("/dashboard/tasks")}
					className={cn(
						"hover:bg-accent-light/40 dark:hover:bg-accent-light/30",
						pathname === "/dashboard/tasks"
							? "bg-accent-light/40 dark:bg-accent-light/30"
							: "",
					)}>
					<div className="flex flex-col items-center justify-center gap-1">
						<FaTasks className="size-5" />
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

export default DashboardLayout;
