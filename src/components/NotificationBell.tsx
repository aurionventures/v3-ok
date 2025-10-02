
import React, { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";

const NotificationBell = () => {
  const [notificationCount] = useState(3);
  const [notifications] = useState([
    {
      id: 1,
      title: "Reunião do Conselho de Administração",
      description: "Reunião agendada para daqui 5 dias",
      date: "10 minutos atrás",
      unread: true,
    },
    {
      id: 2,
      title: "Documentos pendentes",
      description: "3 documentos aguardam sua aprovação",
      date: "2 horas atrás",
      unread: true,
    },
    {
      id: 3,
      title: "Planejamento de sucessão",
      description: "Prazo para atualização está próximo",
      date: "1 dia atrás",
      unread: true,
    },
  ]);

  const handleNotificationClick = (notification: any) => {
    toast({
      title: notification.title,
      description: notification.description,
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {notificationCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 p-0" 
        align="end"
        sideOffset={8}
      >
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold">Notificações</h3>
          <p className="text-xs text-gray-500">Você tem {notificationCount} notificações não lidas</p>
        </div>
        <div className="overflow-y-auto max-h-[300px]">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                notification.unread ? "bg-blue-50" : ""
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex justify-between">
                <h4 className="text-sm font-medium">{notification.title}</h4>
                {notification.unread && (
                  <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">{notification.description}</p>
              <span className="text-xs text-gray-400 mt-2 block">{notification.date}</span>
            </div>
          ))}
        </div>
        <div className="p-2 text-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-blue-600 text-xs w-full"
            onClick={() => {
              toast({
                title: "Ver todas as notificações",
                description: "Esta funcionalidade estará disponível em breve",
              });
            }}
          >
            Ver todas as notificações
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
