import { Card, CardContent } from "@/components/ui/card";
import NotificationBell from "@/components/NotificationBell";

const MemberSettings = () => {
  return (
    <>
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Configurações</h1>
          <NotificationBell />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">Configurações do portal do membro (em breve).</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default MemberSettings;
