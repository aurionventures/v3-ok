import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts/AuthContext'
import {
  Home,
  Building2,
  Users,
  BarChart3,
  FileText,
  Settings,
  Phone,
  Calendar,
  TrendingUp,
  LogOut,
} from 'lucide-react'
import logoImage from "@/assets/legacy-logo-new.png"

const menuItems = [
  {
    title: 'Dashboard',
    icon: Home,
    href: '/parceiro',
    description: 'Visão geral da carteira'
  },
  {
    title: 'Clientes',
    icon: Building2,
    href: '/parceiro/clientes',
    description: 'Gerenciar empresas'
  },
  {
    title: 'Relatórios',
    icon: BarChart3,
    href: '/parceiro/relatorios',
    description: 'Análises e insights'
  },
  {
    title: 'Assessments',
    icon: FileText,
    href: '/parceiro/assessments',
    description: 'Diagnósticos realizados'
  },
]

const bottomMenuItems = [
  {
    title: 'Suporte',
    icon: Phone,
    href: '/parceiro/suporte',
  },
]

export function BancaSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  return (
    <div className="flex h-full w-64 flex-col bg-sidebar border-r border-sidebar-border">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <Link to="/parceiro" className="flex items-center">
          <img 
            src={logoImage} 
            alt="Legacy" 
            className="h-10 w-auto"
          />
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href
            
            return (
              <Link key={item.href} to={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    'w-full justify-start h-auto p-3 text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent',
                    isActive && 'bg-[#C0A062] text-white hover:bg-[#C0A062] hover:text-white'
                  )}
                >
                  <Icon className="mr-3 h-4 w-4" />
                  <div className="text-left">
                    <div className="font-medium text-sm">{item.title}</div>
                    <div className={cn(
                      "text-xs",
                      isActive ? "text-white/80" : "text-sidebar-foreground/60"
                    )}>
                      {item.description}
                    </div>
                  </div>
                </Button>
              </Link>
            )
          })}
        </div>
        
        <Separator className="my-4 bg-sidebar-border" />
        
        <div className="space-y-1">
          {bottomMenuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href
            
            return (
              <Link key={item.href} to={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent",
                    isActive && "bg-[#C0A062] text-white hover:bg-[#C0A062] hover:text-white"
                  )}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Button>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Footer - User Profile */}
      <div className="border-t border-sidebar-border p-3">
        <div className="space-y-3">
          {/* User Info */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5 min-w-0">
              <p className="text-sm font-semibold text-sidebar-foreground truncate">
                {user?.name || 'Parceiro'}
              </p>
              <p className="text-xs text-sidebar-foreground/70">
                Parceiro
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent shrink-0"
              onClick={() => navigate('/parceiro/settings')}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Logout */}
          <Button 
            variant="outline" 
            size="sm"
            onClick={logout}
            className="w-full h-9 bg-[#C0A062] hover:bg-[#B8944D] text-white border-[#C0A062] hover:border-[#B8944D]"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>
    </div>
  )
}