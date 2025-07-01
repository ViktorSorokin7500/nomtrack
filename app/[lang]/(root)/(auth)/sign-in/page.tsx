// app/[lang]/(root)/(auth)/sign-in/page.tsx

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation"; // Імпортуємо роутер для перенаправлення

// Схема валідації ідентична тій, що для реєстрації
const signInSchema = z.object({
  email: z.string().email({ message: "Введіть правильну адресу пошти" }),
  password: z.string().min(1, { message: "Пароль не може бути порожнім" }),
});

type SignInSchema = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const router = useRouter(); // Ініціалізуємо роутер
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInSchema) => {
    const supabase = createClient();

    // Використовуємо іншу функцію: signInWithPassword
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      setMessage("Помилка входу: " + error.message);
    } else {
      // Якщо помилки немає, вхід успішний!
      // Перенаправляємо користувача на дашборд
      router.push("/dashboard");
      // Важливо: після перенаправлення можна оновити сторінку для чистоти
      router.refresh();
    }
  };

  return (
    <div className="w-full max-w-sm">
      <h1 className="text-2xl font-bold mb-6 text-center">Увійти в акаунт</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className="px-4 py-2 border rounded-md"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        <div className="flex flex-col">
          <label htmlFor="password">Пароль</label>
          <input
            id="password"
            type="password"
            {...register("password")}
            className="px-4 py-2 border rounded-md"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-orange-300 hover:bg-orange-400 text-white font-bold py-2 px-4 rounded-md transition-colors disabled:bg-gray-400"
        >
          {isSubmitting ? "Вхід..." : "Увійти"}
        </button>
        {message && <p className="text-red-500 text-center mt-4">{message}</p>}
      </form>
    </div>
  );
}
