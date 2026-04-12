import { LuCalendar } from "react-icons/lu";
import dayjs, { Dayjs } from "dayjs";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useState, type Ref } from "react";
import useMediaQuery from "@/hooks/useMediaQuery";

interface DateTimePickerProps {
	date: Dayjs;
	setDate: (date: Dayjs) => void;
	ref?: Ref<HTMLDivElement>;
}

const DateTimePicker = ({ date, setDate, ref }: DateTimePickerProps) => {
	const isSmallScreen = useMediaQuery("(max-width: 768px)");
	const [isOpen, setIsOpen] = useState(false);

	const handleDateSelect = (selectedDate: Date | undefined) => {
		if (selectedDate) {
			const year = selectedDate.getFullYear();
			const month = selectedDate.getMonth();
			const day = selectedDate.getDate();
			setDate(dayjs.utc().year(year).month(month).date(day).startOf("day"));
		}
	};

	const handleTimeChange = (type: "hour" | "minute", value: number) => {
		if (date) {
			let newDate = date.clone();
			if (type === "hour") {
				newDate = newDate.hour(value);
			} else if (type === "minute") {
				newDate = newDate.minute(value);
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
						"cursor-pointer flex gap-0 items-center",
						"w-52 h-9 justify-start text-left font-normal",
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
			<PopoverContent
				ref={ref}
				className="w-auto p-0"
				side={isSmallScreen ? "top" : "right"}
				align="center">
				<div className="sm:flex">
					<Calendar
						mode="single"
						selected={date?.toDate()}
						onSelect={handleDateSelect}
						autoFocus
					/>
					<div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
						<div className="w-64 sm:w-12 flex-1 overflow-auto">
							<div className="flex sm:flex-col p-2">
								{Array.from({ length: 24 }, (_, i) => i).map((hour) => (
									<Button
										key={hour}
										size="icon"
										variant={date && date.hour() === hour ? "default" : "ghost"}
										className="sm:w-full shrink-0 aspect-square"
										onClick={() => handleTimeChange("hour", hour)}>
										{hour}
									</Button>
								))}
							</div>
						</div>
						<div className="w-64 sm:w-12 h-full flex-1 overflow-auto">
							<div className="flex sm:flex-col p-2">
								{Array.from({ length: 60 }, (_, i) => i).map((minute) => (
									<Button
										key={minute}
										size="icon"
										variant={
											date && date.minute() === minute ? "default" : "ghost"
										}
										className="sm:w-full shrink-0 aspect-square"
										onClick={() => handleTimeChange("minute", minute)}>
										{minute.toString().padStart(2, "0")}
									</Button>
								))}
							</div>
						</div>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
};

export default DateTimePicker;
