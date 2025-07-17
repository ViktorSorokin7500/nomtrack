"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { Button } from "@/components/ui";

// Схема для Magic Link (тільки email)
const magicLinkSchema = z.object({
  email: z.string().email({ message: "Введіть правильну адресу пошти" }),
});

// Схема для входу з паролем
const passwordSchema = z.object({
  email: z.string().email({ message: "Введіть правильну адресу пошти" }),
  password: z.string().min(1, { message: "Пароль не може бути порожнім" }),
});

type MagicLinkSchema = z.infer<typeof magicLinkSchema>;
type PasswordSchema = z.infer<typeof passwordSchema>;

// Компонент форми для Magic Link
const MagicLinkForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MagicLinkSchema>({
    resolver: zodResolver(magicLinkSchema),
  });

  const onSubmit = async (data: MagicLinkSchema) => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: data.email,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) {
      toast.error(`Помилка: ${error.message}`);
    } else {
      toast.success("Перевірте вашу пошту для посилання на вхід!", {
        duration: 6000,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <p className="text-center text-sm text-gray-500">
        Введіть вашу пошту, щоб миттєво отримати посилання для входу.
      </p>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          {...register("email")}
          className="w-full mt-1 px-4 py-2 border rounded-md"
          placeholder="your.email@example.com"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Відправка..." : "Отримати посилання"}
      </Button>
    </form>
  );
};

// Компонент форми для входу з паролем
const PasswordForm = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PasswordSchema>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (data: PasswordSchema) => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      toast.error(`Помилка входу: ${error.message}`);
    } else {
      toast.success("Вхід успішний! Перенаправляємо...");
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        <label htmlFor="email_pass">Email</label>
        <input
          id="email_pass"
          type="email"
          {...register("email")}
          className="w-full mt-1 px-4 py-2 border rounded-md"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>
      <div>
        <label htmlFor="password">Пароль</label>
        <input
          id="password"
          type="password"
          {...register("password")}
          className="w-full mt-1 px-4 py-2 border rounded-md"
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Вхід..." : "Увійти"}
      </Button>
    </form>
  );
};

// Головний компонент сторінки
export default function SignInPage() {
  const [view, setView] = useState<"magic_link" | "password">("magic_link");

  const handleSignInWithGoogle = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) {
      toast.error(`Помилка входу через Google: ${error.message}`);
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-4 text-center">Вхід в акаунт</h1>

      {view === "magic_link" ? <MagicLinkForm /> : <PasswordForm />}

      {/* Перемикач режимів */}
      <div className="text-center mt-4">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setView(view === "magic_link" ? "password" : "magic_link");
          }}
          className="text-sm font-medium text-orange-500 hover:underline"
        >
          {view === "magic_link"
            ? "Увійти за допомогою пароля"
            : "Увійти за магічним посиланням"}
        </a>
      </div>

      {/* Розділювач */}
      <div className="relative flex py-5 items-center">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="flex-shrink mx-4 text-gray-400 text-sm">АБО</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      {/* Вхід через Google */}
      <Button
        variant="outline"
        onClick={handleSignInWithGoogle}
        className="mx-auto flex items-center justify-center gap-2"
      >
        <svg className="size-5" viewBox="0 0 48 48">
          <path
            fill="#FFC107"
            d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
          ></path>
          <path
            fill="#FF3D00"
            d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
          ></path>
          <path
            fill="#4CAF50"
            d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
          ></path>
          <path
            fill="#1976D2"
            d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C42.022,35.244,44,30.036,44,24C44,22.659,43.862,21.35,43.611,20.083z"
          ></path>
        </svg>
        Продовжити з Google
      </Button>

      {/* Посилання на реєстрацію */}
      <p className="text-center text-sm text-gray-600 mt-8">
        Не маєте акаунту?{" "}
        <Link
          href="/sign-up"
          className="font-medium text-orange-500 hover:underline"
        >
          Зареєструватися
        </Link>
      </p>
    </div>
  );
}
