"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";

// 1. Створюємо схему валідації за допомогою Zod
const signUpSchema = z.object({
  email: z.string().email({ message: "Введіть правильну адресу пошти" }),
  password: z
    .string()
    .min(6, { message: "Пароль має бути мінімум 6 символів" }),
});

// 2. Створюємо тип TypeScript на основі схеми Zod
type SignUpSchema = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const [message, setMessage] = useState("");

  // 3. Ініціалізуємо React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema), // Підключаємо наш валідатор Zod
  });

  // 4. Функція відправки тепер приймає валідовані дані
  const onSubmit = async (data: SignUpSchema) => {
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (error) {
      setMessage("Помилка реєстрації: " + error.message);
    } else {
      setMessage(
        "Реєстрація успішна! Ми відправили вам лист на пошту для підтвердження."
      );
    }
  };

  return (
    <div className="w-full max-w-sm">
      <h1 className="text-2xl font-bold mb-6 text-center">Створити акаунт</h1>
      {/* 5. Використовуємо handleSubmit для обробки */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            {...register("email")} // 6. Реєструємо поле
            className="px-4 py-2 border rounded-md"
          />
          {/* 7. Показуємо помилку валідації */}
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
          disabled={isSubmitting} // Блокуємо кнопку під час відправки
          className="bg-orange-300 hover:bg-orange-400 text-white font-bold py-2 px-4 rounded-md transition-colors disabled:bg-gray-400"
        >
          {isSubmitting ? "Реєстрація..." : "Зареєструватися"}
        </button>
        {message && <p className="text-center mt-4">{message}</p>}
      </form>
    </div>
  );
}
