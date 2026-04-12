import { cn } from "@/lib/utils";
import { matchPath, useLocation } from "react-router-dom";
import Events from "./EventPage";
import EventEdit from "./EventEdit";

const EventLayout = () => {
	const location = useLocation();
	const editPage = matchPath("/home/events/editor", location.pathname);
	return (
		<div className="relative h-full w-full z-0">
			<div
				className={cn("h-full w-full", editPage ? "pointer-events-none" : "")}>
				<Events />
			</div>
			{editPage && (
				<div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 pointer-events-auto">
					<EventEdit />
				</div>
			)}
		</div>
	);
};

export default EventLayout;
