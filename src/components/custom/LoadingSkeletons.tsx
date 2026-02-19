import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const NotesLoadingSkeletonItem = () => {
	return (
		<Card className="w-full min-h-48 bg-transparent shadow-none border-none">
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
			columnsCountBreakPoints={{ 480: 2, 640: 3, 1024: 4, 1280: 5, 1536: 6 }}>
			<Masonry className="w-full">
				{Array.from({ length: 2 }, (_, i) => i).map((idx) => (
					<NotesLoadingSkeletonItem key={idx} />
				))}
			</Masonry>
		</ResponsiveMasonry>
	);
};

export { NotesLoadingSkeleton };
