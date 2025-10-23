import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square w-8 h-8 items-center justify-center rounded-md bg-white text-blue-600">
                <AppLogoIcon width={20} height={20} stroke="currentColor" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    TaskMinder
                </span>
            </div>
        </>
    );
}
