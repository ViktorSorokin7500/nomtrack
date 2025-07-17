// app/[lang]/(root)/(auth)/sign-up/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import Link from "next/link";
import { Button } from "@/components/ui";

const signUpSchema = z.object({
  email: z.string().email({ message: "Введіть правильну адресу пошти" }),
  password: z
    .string()
    .min(6, { message: "Пароль має бути мінімум 6 символів" }),
});

type SignUpSchema = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpSchema) => {
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (error) {
      toast.error("Помилка реєстрації: " + error.message);
    } else {
      toast.success(
        "Реєстрація успішна! Ми відправили вам лист на пошту для підтвердження.",
        { duration: 6000 } // Показуємо довше, щоб користувач встиг прочитати
      );
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-6 text-center">Створити акаунт</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
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
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Реєстрація..." : "Зареєструватися"}
        </Button>
      </form>

      {/* Посилання на вхід */}
      <p className="text-center text-sm text-gray-600 mt-8">
        Вже маєте акаунт?{" "}
        <Link
          href="/sign-in"
          className="font-medium text-orange-500 hover:underline"
        >
          Увійти
        </Link>
      </p>
    </div>
  );
}
