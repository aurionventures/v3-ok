import { useLocation } from "react-router-dom";
import GuiaLegacyButton from "./GuiaLegacyButton";
import NotificationBell from "./NotificationBell";

interface HeaderProps {
  title?: string;
  rightExtra?: React.ReactNode;
}

const Header = ({ title = "Dashboard", rightExtra }: HeaderProps) => {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        {!isAdmin && <GuiaLegacyButton />}
        <NotificationBell />
        {rightExtra}
      </div>
    </header>
  );
};

export default Header;
