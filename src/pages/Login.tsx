import { CircleDollarSign } from 'lucide-react';
import { LoginForm } from '../components/auth/LoginForm';

export function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <div className="flex justify-center">
            <CircleDollarSign className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Welcome to Inovvio
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access your financial services dashboard
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}