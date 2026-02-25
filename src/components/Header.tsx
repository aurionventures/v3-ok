import { Link, useLocation } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
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
        {!isAdmin && (
          <Button
            variant="outline"
            size="sm"
            className="gap-2 bg-blue-900 text-white border-blue-900 hover:bg-blue-800 hover:text-white"
            asChild
          >
            <Link to="/legacy">
              <BookOpen className="h-4 w-4" />
              Guia Legacy
            </Link>
          </Button>
        )}
        <NotificationBell />
        {rightExtra}
      </div>
    </header>
  );
};

export default Header;
