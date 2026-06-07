
'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { api } from '@/lib/api';

type FormData = {
  email: string;
  password: string;
};

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const router = useRouter();
const onSubmit = async (data: FormData) => {
  try {
    console.log('STEP 1');

    const res = await api.post(
      '/auth/login',
      data
    );

    console.log(
      'STEP 2 RESPONSE:',
      res
    );

    if (!res?.token) {
      console.log('TOKEN MISSING');
      return;
    }

    // SAVE TOKEN + USER
    localStorage.setItem(
      'token',
      res.token
    );

    localStorage.setItem(
      'user',
      JSON.stringify(res.user)
    );

    toast.success(
      'Login successful!'
    );

    // ================= ADMIN CHECK =================

    if (res.user.role === 'admin') {

      console.log(
        'ADMIN LOGIN'
      );

      router.replace('/admin');

    } else {

      console.log(
        'USER LOGIN'
      );

      router.replace('/dashboard');
    }

  } catch (error) {

    console.error(
      'LOGIN ERROR:',
      error
    );

    toast.error(
      'Invalid email or password'
    );
  }
};
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      {/* EMAIL */}
      <div>
        <Label className="mb-2 block">
          Email
        </Label>

        <Input
          type="email"
          placeholder="Enter your email"
          {...register('email', {
            required: 'Email is required',
          })}
        />

        {errors.email && (
          <p className="mt-1 text-sm text-red-400">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* PASSWORD */}
      <div>
        <Label className="mb-2 block">
          Password
        </Label>

        <Input
          type="password"
          placeholder="Enter your password"
          {...register('password', {
            required: 'Password is required',
          })}
        />

        {errors.password && (
          <p className="mt-1 text-sm text-red-400">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* BUTTON */}
      <Button
        type="submit"
        className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 py-3 text-white hover:from-cyan-400 hover:to-purple-600"
      >
        Login
      </Button>
    </form>
  );
}

