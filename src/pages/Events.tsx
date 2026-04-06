import Calendar from "@/components/custom/calendar/Calendar";
import EventCard from "@/components/custom/calendar/EventCard";
import Loader from "@/components/custom/Loader";
import { useStore } from "@/context/store";
import { eventsFetchHandler } from "@/services/services";
import { useEffect } from "react";

const Events = () => {
	const events = useStore((state) => state.events);
	const eventsLoading = useStore((state) => state.eventsLoading);

	useEffect(() => {
		if (events.length === 0) {
			eventsFetchHandler();
		}
	}, []);

	if (eventsLoading) {
		return <Loader />;
	}

	return (
		<div className="h-full w-full flex flex-col items-center justify-center gap-2 p-2 overflow-hidden relative">
			<Calendar />
			<div className="absolute bottom-2 right-2">
				<EventCard />
			</div>
		</div>
	);
};

export default Events;
