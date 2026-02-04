import { type FC } from "react";
import { useLocation } from "react-router-dom";
import ThemeSwitch from "./ThemeSwitch";

const Header: FC = () => {
	const location = useLocation();

	return (
		<div className="h-12 w-full border-2 border-black dark:border-white flex flex-row items-center px-4 gap-4">
			{/* left */}
			<div className="flex grow justify-start items-center gap-4">
        
      </div>
			{/* center */}
			<div className="flex grow justify-center items-center gap-4">
        Header - {location.pathname}
      </div>
			{/* right */}
			<div className="flex grow justify-end items-center gap-4">
				<ThemeSwitch />
			</div>
		</div>
	);
};

export default Header;
