import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { CircleDollarSign, AlertCircle, TrendingUp, Users, Activity } from 'lucide-react';
import { Framework } from '../types';
import { frameworksApi } from '../services/api';
import { toast } from 'react-hot-toast';
import { TasksAndNotifications } from '../components/dashboard/TasksAndNotifications';

const COLORS = {
  primary: ['#0090ff', '#36a9ff', '#7cc4ff', '#b9dfff'],
  success: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0'],
  warning: ['#f59e0b', '#fbbf24', '#fcd34d', '#fde68a'],
  danger: ['#ef4444', '#f87171', '#fca5a5', '#fecaca'],
};

export function Dashboard() {
  const [frameworks, setFrameworks] = useState<Framework[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFrameworks();
  }, []);

  const loadFrameworks = async () => {
    try {
      const data = await frameworksApi.list();
      setFrameworks(data);
    } catch (error) {
      console.error('Error loading frameworks:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate statistics
  const stats = [
    {
      name: 'Total Portfolio Value',
      value: frameworks.reduce((sum, f) => sum + (f.initialAllocatedAmount || 0), 0),
      icon: CircleDollarSign,
      change: '+12.5%',
      changeType: 'increase',
      format: (value: number) => new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: 'compact',
        maximumFractionDigits: 1
      }).format(value)
    },
    {
      name: 'Active Frameworks',
      value: frameworks.filter(f => f.status === 'ACTIVE').length,
      icon: Activity,
      change: '+3',
      changeType: 'increase',
      format: (value: number) => value.toString()
    },
    {
      name: 'Framework Types',
      value: new Set(frameworks.map(f => f.type)).size,
      icon: TrendingUp,
      change: '+2',
      changeType: 'increase',
      format: (value: number) => value.toString()
    },
    {
      name: 'Pending Approvals',
      value: frameworks.filter(f => f.status === 'PENDING_APPROVAL').length,
      icon: AlertCircle,
      change: '-2',
      changeType: 'decrease',
      format: (value: number) => value.toString()
    }
  ];

  // Prepare chart data
  const typeDistribution = Object.entries(
    frameworks.reduce((acc, framework) => {
      acc[framework.type] = (acc[framework.type] || 0) + framework.initialAllocatedAmount;
      return acc;
    }, {} as Record<string, number>)
  ).map(([type, value]) => ({ type, value }));

  const statusDistribution = Object.entries(
    frameworks.reduce((acc, framework) => {
      acc[framework.status] = (acc[framework.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="py-6 px-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {stat.format(stat.value)}
                        </div>
                        <div className={`ml-2 flex items-baseline text-sm font-semibold
                          ${stat.changeType === 'increase' ? 'text-green-600' :
                            stat.changeType === 'decrease' ? 'text-red-600' :
                            'text-gray-600'}`}>
                          {stat.change}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-6">
        {/* Portfolio Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Portfolio Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={typeDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => 
                    new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      notation: 'compact',
                      maximumFractionDigits: 1
                    }).format(value)
                  }
                />
                <Legend />
                <Bar dataKey="value" fill="#0090ff" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Framework Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Framework Status</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS.primary[index % COLORS.primary.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tasks and Notifications */}
      <TasksAndNotifications />
    </div>
  );
}
