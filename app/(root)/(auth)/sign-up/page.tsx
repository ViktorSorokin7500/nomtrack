"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import Link from "next/link";
import { Button } from "@/components/ui";
import { AUTH_TEXTS } from "@/components/shared/(texts)/auth-texts";

const signUpSchema = z.object({
  email: z.string().email({ message: AUTH_TEXTS.Z_EMAIL }),
  password: z.string().min(6, { message: AUTH_TEXTS.SIGN_UP.Z_PASSWORD }),
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
      toast.error(AUTH_TEXTS.SIGN_UP.TOAST_ERROR + error.message);
    } else {
      toast.success(
        AUTH_TEXTS.SIGN_UP.TOAST_SUCCESS,
        { duration: 6000 } // Show longer for the user to read
      );
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-6 text-center">
        {AUTH_TEXTS.SIGN_UP.TITLE}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label htmlFor="email">{AUTH_TEXTS.EMAIL}</label>
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
          <label htmlFor="password">{AUTH_TEXTS.PASSWORD}</label>
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
          {isSubmitting
            ? AUTH_TEXTS.SIGN_UP.SUBMIT_LOADING
            : AUTH_TEXTS.SIGN_UP.SUBMIT_BUTTON}
        </Button>
      </form>

      {/* Sign-in link */}
      <p className="text-center text-sm text-gray-600 mt-8">
        {AUTH_TEXTS.SIGN_UP.LOGIN_TEXT}{" "}
        <Link
          href="/sign-in"
          className="font-medium text-orange-500 hover:underline"
        >
          {AUTH_TEXTS.SIGN_UP.LOGIN_LINK}
        </Link>
      </p>
    </div>
  );
}
