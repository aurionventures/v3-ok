import React from 'react'
import { Link, useLocation } from 'react-router-dom'
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
  const { user, logout } = useAuth()

  return (
    <div className="flex h-full w-64 flex-col bg-background border-r">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Building2 className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-sm">Legacy Governance</h2>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">Parceiro</div>
          <div className="font-medium text-sm">{user?.name}</div>
          <Badge variant="secondary" className="text-xs">
            Painel do Parceiro
          </Badge>
        </div>
      </div>

      <Separator />

      {/* Main Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href
            
            return (
              <Link key={item.href} to={item.href}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start h-auto p-3',
                    isActive && 'bg-secondary'
                  )}
                >
                  <Icon className="mr-3 h-4 w-4" />
                  <div className="text-left">
                    <div className="font-medium text-sm">{item.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.description}
                    </div>
                  </div>
                </Button>
              </Link>
            )
          })}
        </div>
      </nav>

      <Separator />

      {/* Bottom Navigation */}
      <div className="p-4">
        <div className="space-y-1">
          {bottomMenuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href
            
            return (
              <Link key={item.href} to={item.href}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Button>
              </Link>
            )
          })}
          
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>
    </div>
  )
}