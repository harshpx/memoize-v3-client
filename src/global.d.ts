export {};
declare global {
	interface Window {
		__ENV__?: {
			APP_ENV?: string;
		};
	}
}
