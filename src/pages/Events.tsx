import Calendar from "@/components/custom/calendar/Calendar";
import CustomizableButton from "@/components/custom/CustomizableButton";
import { FaPlus } from "react-icons/fa6";

const Events = () => {
	return (
		<div className="h-full w-full flex flex-col items-center justify-center gap-2 p-2 overflow-hidden relative">
			<Calendar />
			<CustomizableButton className="absolute bottom-2 right-2 aspect-square bg-accent-light dark:bg-accent-dark">
				<FaPlus className="" />
			</CustomizableButton>
		</div>
	);
};

export default Events;
