import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const NotesLoadingSkeletonItem = () => {
	return (
		<Card className="w-full bg-transparent shadow-none border-none flex flex-col justify-between gap-2 break-inside-avoid min-h-56 max-h-96">
			<CardContent className="grow flex flex-col gap-2">
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-4 w-full" />
				<Skeleton className="grow w-full" />
				<Skeleton className="h-4 w-4/5" />
			</CardContent>
		</Card>
	);
};

const NotesLoadingSkeleton = () => {
	return (
		<ResponsiveMasonry
			className="w-full h-full"
			columnsCountBreakPoints={{ 640: 2, 1024: 3, 1280: 4, 1536: 5 }}>
			<Masonry className="w-full">
				{Array.from({ length: 3 }, (_, i) => i).map((idx) => (
					<NotesLoadingSkeletonItem key={idx} />
				))}
			</Masonry>
		</ResponsiveMasonry>
	);
};

const EventsLoadingSkeletonItem = () => {
	return (
		<Card className="w-full bg-transparent shadow-none border-none flex flex-col justify-between gap-2 break-inside-avoid">
			<CardContent className="flex items-center gap-2 w-full">
				<Skeleton className="size-12 rounded-full" />
				<div className="flex flex-col gap-2 w-full">
					<Skeleton className="h-8 w-full" />
					<Skeleton className="h-4 w-full" />
				</div>
			</CardContent>
		</Card>
	);
};

export {
	NotesLoadingSkeleton,
	NotesLoadingSkeletonItem,
	EventsLoadingSkeletonItem,
};
