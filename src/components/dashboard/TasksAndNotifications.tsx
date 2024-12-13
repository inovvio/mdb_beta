import { useState } from 'react';
import { Bell, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';

// Mock data types
interface Task {
  id: string;
  title: string;
  type: 'APPROVAL' | 'REVIEW' | 'UPDATE' | 'ACTION';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  dueDate: Date;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
}

interface Notification {
  id: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR';
  timestamp: Date;
  isRead: boolean;
}

// Mock data
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Review Framework ABC123 for approval',
    type: 'APPROVAL',
    priority: 'HIGH',
    dueDate: new Date('2024-03-25'),
    status: 'PENDING'
  },
  {
    id: '2',
    title: 'Update Party XYZ KYC documents',
    type: 'UPDATE',
    priority: 'MEDIUM',
    dueDate: new Date('2024-03-28'),
    status: 'IN_PROGRESS'
  },
  {
    id: '3',
    title: 'Validate Engagement DEF456 financials',
    type: 'REVIEW',
    priority: 'HIGH',
    dueDate: new Date('2024-03-26'),
    status: 'PENDING'
  }
];

const mockNotifications: Notification[] = [
  {
    id: '1',
    message: 'Framework "Green Energy Fund" has been approved',
    type: 'SUCCESS',
    timestamp: new Date('2024-03-19T10:30:00'),
    isRead: false
  },
  {
    id: '2',
    message: 'Party "ABC Bank" KYC status requires attention',
    type: 'WARNING',
    timestamp: new Date('2024-03-19T09:15:00'),
    isRead: false
  },
  {
    id: '3',
    message: 'New engagement request from XYZ Corporation',
    type: 'INFO',
    timestamp: new Date('2024-03-19T08:45:00'),
    isRead: true
  }
];

export function TasksAndNotifications() {
  const [activeTab, setActiveTab] = useState<'tasks' | 'notifications'>('tasks');
  const [tasks] = useState<Task[]>(mockTasks);
  const [notifications] = useState<Notification[]>(mockNotifications);

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'HIGH':
        return 'text-red-600';
      case 'MEDIUM':
        return 'text-amber-600';
      case 'LOW':
        return 'text-green-600';
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'SUCCESS':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'WARNING':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case 'ERROR':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              activeTab === 'tasks'
                ? 'bg-primary-50 text-primary-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('tasks')}
          >
            Tasks ({tasks.filter(t => t.status !== 'COMPLETED').length})
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              activeTab === 'notifications'
                ? 'bg-primary-50 text-primary-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('notifications')}
          >
            Notifications ({notifications.filter(n => !n.isRead).length})
          </button>
        </div>
        <Button variant="outline" size="sm">
          Mark all as read
        </Button>
      </div>

      <div className="space-y-4">
        {activeTab === 'tasks' ? (
          tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-start p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Clock className="h-5 w-5 text-gray-400 mt-1 mr-4" />
              <div className="flex-1">
                <div className="flex justify-between">
                  <h4 className="text-sm font-medium text-gray-900">{task.title}</h4>
                  <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
                <div className="mt-1 flex items-center text-xs text-gray-500">
                  <span className="mr-2">Due: {task.dueDate.toLocaleDateString()}</span>
                  <span className="px-2 py-1 rounded-full bg-gray-100">
                    {task.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
              <Button size="sm" variant="outline" className="ml-4">
                View
              </Button>
            </div>
          ))
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-start p-4 rounded-lg transition-colors ${
                notification.isRead ? 'bg-gray-50' : 'bg-primary-50'
              }`}
            >
              {getNotificationIcon(notification.type)}
              <div className="ml-4 flex-1">
                <p className="text-sm text-gray-900">{notification.message}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {notification.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}