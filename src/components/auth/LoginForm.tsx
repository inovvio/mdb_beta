import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { z } from 'zod';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Lock, Mail } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError('');
    
    try {
      await login(data.email, data.password);
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.message === 'Invalid login credentials') {
        setError('Invalid email or password');
      } else {
        setError('An error occurred during login. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}
      
      <div>
        <div className="relative">
          <Input
            label="Email"
            type="email"
            {...register('email')}
            error={errors.email?.message}
            className="pl-10"
          />
          <Mail className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div>
        <div className="relative">
          <Input
            label="Password"
            type="password"
            {...register('password')}
            error={errors.password?.message}
            className="pl-10"
          />
          <Lock className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? 'Signing in...' : 'Sign in'}
      </Button>

      <div className="text-sm text-center text-gray-600">
        <p>Demo credentials:</p>
        <p>Email: demo@example.com</p>
        <p>Password: demo123</p>
      </div>
    </form>
  );
}