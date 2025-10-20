'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  BarChart3, 
  Users, 
  FileText, 
  Briefcase, 
  MessageSquare, 
  Settings,
  Menu,
  X
} from 'lucide-react'

interface SidebarItem {
  id: string;
  name: string;
  icon: any;
  href: string;
}

export function AdminSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const sidebarItems: SidebarItem[] = [
    { id: 'overview', name: 'Overview', icon: BarChart3, href: '/admin' },
    { id: 'portfolio', name: 'Portfolio', icon: Briefcase, href: '/admin/portfolio' },
    { id: 'blog', name: 'Blog', icon: FileText, href: '/admin/blog' },
    { id: 'career', name: 'Career', icon: Briefcase, href: '/admin/career' },
    { id: 'contact', name: 'Contact', icon: MessageSquare, href: '/admin/contact' },
    { id: 'users', name: 'Users', icon: Users, href: '/admin/users' },
  ]

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        className="lg:hidden fixed top-4 left-4 z-50"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu className="w-5 h-5" />
      </Button>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-80 lg:w-72 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full bg-white border-r border-gray-200 shadow-lg lg:shadow-none">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">
              Navigation
            </h2>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <nav className="p-4 space-y-2">
            {sidebarItems.map((item) => {
              const IconComponent = item.icon
              const active = isActive(item.href)
              
              return (
                <Link key={item.id} href={item.href}>
                  <Button
                    variant={active ? "default" : "ghost"}
                    className={`w-full justify-start px-3 ${
                      active
                        ? 'bg-gradient-to-r from-[#6812F7] to-[#9253F0] text-white hover:from-[#5a0fd4] hover:to-[#7d42e6]'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    onClick={() => setSidebarOpen(false)} // Close mobile sidebar when item is selected
                  >
                    <IconComponent className="w-4 h-4 mr-3" />
                    <span>{item.name}</span>
                  </Button>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </>
  )
}
