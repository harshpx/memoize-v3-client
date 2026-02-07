import { Spinner } from "../ui/spinner";

// full screen loader with a spinner in the center
const Loader = () => {
	return (
		<div className="absolute h-screen w-full top-0 left-0 flex items-center justify-center bg-black/70 z-50">
			<Spinner className="text-accent-dark dark:text-accent-light size-16" />
		</div>
	);
};

export default Loader;
