"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import Link from "next/link";
import { Button } from "@/components/ui";

const signUpSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
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
      toast.error("Sign-up error: " + error.message);
    } else {
      toast.success(
        "Sign-up successful! Please check your email for a confirmation link.",
        { duration: 6000 } // Show longer for the user to read
      );
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-6 text-center">Create an Account</h1>
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
          <label htmlFor="password">Password</label>
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
          {isSubmitting ? "Creating account..." : "Sign Up"}
        </Button>
      </form>

      {/* Sign-in link */}
      <p className="text-center text-sm text-gray-600 mt-8">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="font-medium text-orange-500 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
