import { useStore } from "@/context/store";
import {
	LuNotebookPen,
	LuListChecks,
	LuCalendarDays,
	LuCodeXml,
	LuBrain,
	LuCalendarSearch,
	LuFileCode,
	LuFileText,
} from "react-icons/lu";
export interface BgIconsProps {
	className?: string;
	iconOpacity?: number;
}
const BgIcons = ({ className = "", iconOpacity }: BgIconsProps) => {
	const theme = useStore((state) => state.theme);
	return (
		<div
			className={`absolute h-screen w-screen top-0 left-0 p-5 flex gap-10 flex-wrap justify-center -z-50 ${className}`}>
			{Array.from({ length: 100 }, (_, i) => i)
				// .sort(() => Math.random() - 0.5)
				.map((idx) => {
					const type = (idx % 8) + 1;
					const randomNumber = (Math.random() + Number.EPSILON) % 1;
					const rotation = randomNumber * 30 - 15;
					const size = randomNumber * 70 + 30;
					const marginTop = randomNumber * 100 - 50;

					const commonProps = {
						style: {
							opacity: iconOpacity
								? iconOpacity
								: theme === "dark"
									? 0.15
									: 0.2,
							marginTop: `${marginTop}px`,
							rotate: `${rotation}deg`,
							width: `${size}px`,
							height: `${size}px`,
						} as React.CSSProperties,
					};
					switch (type) {
						case 1:
							return <LuNotebookPen key={idx} {...commonProps} />;
						case 2:
							return <LuCalendarDays key={idx} {...commonProps} />;
						case 3:
							return <LuListChecks key={idx} {...commonProps} />;
						case 4:
							return <LuCodeXml key={idx} {...commonProps} />;
						case 5:
							return <LuBrain key={idx} {...commonProps} />;
						case 6:
							return <LuCalendarSearch key={idx} {...commonProps} />;
						case 7:
							return <LuFileCode key={idx} {...commonProps} />;
						case 8:
							return <LuFileText key={idx} {...commonProps} />;
						default:
							return <div key={idx}></div>;
					}
				})}
		</div>
	);
};

export default BgIcons;
