import { LuCalendar } from "react-icons/lu";
import dayjs from "dayjs";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useState } from "react";

const DateTimePicker = () => {
	const [date, setDate] = useState<Date>();
	const [isOpen, setIsOpen] = useState(false);

	const hours = Array.from({ length: 24 }, (_, i) => i);
	const handleDateSelect = (selectedDate: Date | undefined) => {
		if (selectedDate) {
			setDate(selectedDate);
		}
	};

	const handleTimeChange = (type: "hour" | "minute", value: string) => {
		if (date) {
			const newDate = new Date(date);
			if (type === "hour") {
				newDate.setHours(parseInt(value));
			} else if (type === "minute") {
				newDate.setMinutes(parseInt(value));
			}
			setDate(newDate);
		}
	};

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					className={cn(
						"flex gap-0 items-center",
						"w-fit justify-start text-left font-normal",
						!date && "text-muted-foreground",
					)}>
					<LuCalendar className="mr-2 h-4 w-4" />
					{date ? (
						dayjs(date).format("DD MMM YYYY   HH:mm")
					) : (
						<span>DD MMM YYYY&nbsp;&nbsp;&nbsp;HH:mm</span>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0">
				<div className="sm:flex">
					<Calendar
						mode="single"
						selected={date}
						onSelect={handleDateSelect}
						autoFocus
					/>
					<div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
						<ScrollArea className="w-64 sm:w-auto h-full flex-1">
							<div className="flex sm:flex-col p-2">
								{hours.map((hour) => (
									<Button
										key={hour}
										size="icon"
										variant={
											date && date.getHours() === hour ? "default" : "ghost"
										}
										className="sm:w-full shrink-0 aspect-square"
										onClick={() => handleTimeChange("hour", hour.toString())}>
										{hour}
									</Button>
								))}
							</div>
							<ScrollBar orientation="horizontal" className="sm:hidden" />
						</ScrollArea>
						<ScrollArea className="w-64 sm:w-auto">
							<div className="flex sm:flex-col p-2 h-full flex-1">
								{Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
									<Button
										key={minute}
										size="icon"
										variant={
											date && date.getMinutes() === minute ? "default" : "ghost"
										}
										className="sm:w-full shrink-0 aspect-square"
										onClick={() =>
											handleTimeChange("minute", minute.toString())
										}>
										{minute.toString().padStart(2, "0")}
									</Button>
								))}
							</div>
							<ScrollBar orientation="horizontal" className="sm:hidden" />
						</ScrollArea>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
};

export default DateTimePicker;
