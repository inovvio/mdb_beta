import { useMemo } from 'react';
import { Party, PartyStatus } from '../../types/party';
import { Users, Building2, Globe, AlertCircle } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PartyDashboardProps {
  parties: Party[];
}

const COLORS = {
  primary: ['#0090ff', '#36a9ff', '#7cc4ff', '#b9dfff'],
  success: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0'],
  warning: ['#f59e0b', '#fbbf24', '#fcd34d', '#fde68a'],
  danger: ['#ef4444', '#f87171', '#fca5a5', '#fecaca'],
};

export function PartyDashboard({ parties }: PartyDashboardProps) {
  const stats = useMemo(() => {
    const totalParties = parties.length;
    const activeParties = parties.filter(p => p.status === 'ACTIVE').length;
    const uniqueCountries = new Set(parties.map(p => p.country)).size;
    const pendingKyc = parties.filter(p => p.status === 'PENDING_KYC').length;

    return [
      {
        name: 'Total Parties',
        value: totalParties,
        icon: Users,
        change: '+12%',
        changeType: 'increase',
      },
      {
        name: 'Active Parties',
        value: activeParties,
        icon: Building2,
        change: `${((activeParties / totalParties) * 100).toFixed(0)}%`,
        changeType: 'neutral',
      },
      {
        name: 'Countries',
        value: uniqueCountries,
        icon: Globe,
        change: '+3',
        changeType: 'increase',
      },
      {
        name: 'Pending KYC',
        value: pendingKyc,
        icon: AlertCircle,
        change: '-2',
        changeType: 'decrease',
      },
    ];
  }, [parties]);

  const statusDistribution = useMemo(() => {
    const distribution = Object.values(PartyStatus).map(status => ({
      name: status.replace('_', ' '),
      value: parties.filter(p => p.status === status).length
    }));
    return distribution;
  }, [parties]);

  const roleDistribution = useMemo(() => {
    const roleCount: Record<string, number> = {};
    parties.forEach(party => {
      party.roles.forEach(role => {
        roleCount[role] = (roleCount[role] || 0) + 1;
      });
    });
    return Object.entries(roleCount).map(([role, count]) => ({
      name: role.replace('_', ' '),
      value: count
    }));
  }, [parties]);

  return (
    <div className="space-y-6 mb-8">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
                          {stat.value}
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

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Status Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Party Status Distribution</h3>
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
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS.primary[index % COLORS.primary.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Role Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Party Roles Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roleDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#0090ff" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}