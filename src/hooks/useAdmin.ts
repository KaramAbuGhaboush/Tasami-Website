import { useState } from 'react'
import { 
  BarChart3, 
  Users, 
  FileText, 
  Briefcase, 
  MessageSquare, 
  Settings
} from 'lucide-react'

export interface DashboardSection {
  id: string;
  name: string;
  icon: any;
}

export interface Stat {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: string;
  description: string;
  color: string;
}

export interface Activity {
  action: string;
  time: string;
  type: string;
  user: string;
  status: string;
  value?: string;
  views?: string;
  role?: string;
  improvement?: string;
}

export interface UseAdminReturn {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  dashboardSections: DashboardSection[];
  stats: Stat[];
  recentActivities: Activity[];
}

export function useAdmin(): UseAdminReturn {
  const [activeTab, setActiveTab] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const dashboardSections: DashboardSection[] = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'portfolio', name: 'Portfolio', icon: Briefcase },
    { id: 'about', name: 'About Us', icon: Users },
    { id: 'blog', name: 'Blog', icon: FileText },
    { id: 'career', name: 'Career', icon: Briefcase },
    { id: 'contact', name: 'Contact', icon: MessageSquare },
    { id: 'users', name: 'Users', icon: Users },
  ]

  const stats: Stat[] = [
    { 
      label: 'Total Revenue', 
      value: '$124,500', 
      change: '+18.2%', 
      trend: 'up',
      icon: '💰',
      description: 'Monthly recurring revenue',
      color: 'from-green-500 to-emerald-600'
    },
    { 
      label: 'Active Projects', 
      value: '24', 
      change: '+12%', 
      trend: 'up',
      icon: '🚀',
      description: 'Currently in progress',
      color: 'from-blue-500 to-cyan-600'
    },
    { 
      label: 'Client Satisfaction', 
      value: '4.9/5', 
      change: '+0.3', 
      trend: 'up',
      icon: '⭐',
      description: 'Average rating',
      color: 'from-yellow-500 to-orange-600'
    },
    { 
      label: 'Team Members', 
      value: '12', 
      change: '+2', 
      trend: 'up',
      icon: '👥',
      description: 'Active team members',
      color: 'from-purple-500 to-pink-600'
    },
    { 
      label: 'Website Traffic', 
      value: '45.2K', 
      change: '+23%', 
      trend: 'up',
      icon: '📊',
      description: 'Monthly visitors',
      color: 'from-indigo-500 to-blue-600'
    },
    { 
      label: 'Conversion Rate', 
      value: '3.2%', 
      change: '+0.8%', 
      trend: 'up',
      icon: '🎯',
      description: 'Lead to client conversion',
      color: 'from-teal-500 to-green-600'
    },
  ]

  const recentActivities: Activity[] = [
    { 
      action: 'New client project "E-commerce Platform" started', 
      time: '2 hours ago', 
      type: 'portfolio',
      user: 'Sarah Johnson',
      status: 'active',
      value: '$15,000'
    },
    { 
      action: 'Blog post "AI Trends 2024" published', 
      time: '4 hours ago', 
      type: 'blog',
      user: 'Mike Chen',
      status: 'published',
      views: '1,234'
    },
    { 
      action: 'High-priority contact from TechCorp', 
      time: '6 hours ago', 
      type: 'contact',
      user: 'John Smith',
      status: 'urgent',
      value: 'Potential $50K project'
    },
    { 
      action: 'New team member "Alex Rodriguez" onboarded', 
      time: '8 hours ago', 
      type: 'users',
      user: 'HR Team',
      status: 'completed',
      role: 'Senior Developer'
    },
    { 
      action: 'Project "Mobile App" completed and delivered', 
      time: '1 day ago', 
      type: 'portfolio',
      user: 'Development Team',
      status: 'completed',
      value: '$25,000'
    },
    { 
      action: 'Website performance optimization completed', 
      time: '2 days ago', 
      type: 'maintenance',
      user: 'DevOps Team',
      status: 'completed',
      improvement: '+40% faster load times'
    },
  ]

  return {
    activeTab,
    setActiveTab,
    sidebarOpen,
    setSidebarOpen,
    dashboardSections,
    stats,
    recentActivities
  }
}
