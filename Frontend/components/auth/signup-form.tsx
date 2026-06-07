'use client';
import { api } from '@/lib/api';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

import { Eye, EyeOff } from 'lucide-react';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormType = z.infer<typeof signupSchema>;

export function SignupForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormType>({
    resolver: zodResolver(signupSchema),
  });

 const onSubmit = async (data: SignupFormType) => {
  setIsLoading(true);

  try {
    const response = await api.post('/auth/register', {
      name: data.name,
      email: data.email,
      password: data.password,
    });

    console.log('SIGNUP RESPONSE:', response);

    // SAVE TOKEN
    localStorage.setItem('token', response.token);

    // SAVE USER
    localStorage.setItem(
      'user',
      JSON.stringify(response.user)
    );

    toast.success('Account created successfully!');

    router.replace('/dashboard');

  } catch (error) {
    console.error(error);

    toast.error('Signup failed');

  } finally {
    setIsLoading(false);
  }
};

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">

      {/* NAME */}
      <div>
        <Label className="text-gray-300 text-sm">Full Name</Label>
        <Input
          placeholder="John Doe"
          {...register('name')}
          disabled={isLoading}
          className="mt-2 h-12 rounded-xl bg-white/5 border border-white/10 text-white 
          focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
        />
        {errors.name && (
          <p className="text-sm text-red-400 mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* EMAIL */}
      <div>
        <Label className="text-gray-300 text-sm">Email Address</Label>
        <Input
          type="email"
          placeholder="you@example.com"
          {...register('email')}
          disabled={isLoading}
          className="mt-2 h-12 rounded-xl bg-white/5 border border-white/10 text-white 
          focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
        />
        {errors.email && (
          <p className="text-sm text-red-400 mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* PASSWORD */}
      <div className="relative">
        <Label className="text-gray-300 text-sm">Password</Label>
        <Input
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          {...register('password')}
          disabled={isLoading}
          className="mt-2 h-12 rounded-xl bg-white/5 border border-white/10 text-white pr-12 
          focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-10 text-gray-400 hover:text-cyan-400"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>

        {errors.password && (
          <p className="text-sm text-red-400 mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* CONFIRM PASSWORD */}
      <div>
        <Label className="text-gray-300 text-sm">Confirm Password</Label>
        <Input
          type="password"
          placeholder="••••••••"
          {...register('confirmPassword')}
          disabled={isLoading}
          className="mt-2 h-12 rounded-xl bg-white/5 border border-white/10 text-white 
          focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-400 mt-1">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* BUTTON */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 text-lg rounded-xl font-semibold 
        bg-gradient-to-r from-cyan-500 to-blue-600 
        hover:from-cyan-400 hover:to-purple-500
        transition-all duration-300 hover:scale-105 active:scale-95
        shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40"
      >
        {isLoading ? 'Creating account...' : 'Create Account'}
      </Button>

    </form>
  );
}