import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../API";

const Register = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { username: "", email: "", password: "", confirm: "" },
  });

  const onSubmit = async (values) => {
    try {
      const { data } = await api.post("/auth/register", values);
      const email = data?.user?.email ?? data?.newUser?.email ?? values.email;
      toast.success(`Account created for ${email}`);
      navigate("/");
    } catch (err) {
      const msg =
        err?.response?.data?.message ?? err?.message ?? "Registration failed";
      toast.error(msg);
    }
  };

  const password = watch("password");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 dark:text-slate-100 flex items-center justify-center p-4 transition-colors">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-8 select-none">
          <div className="h-3 w-3 rounded-sm bg-sky-500 shadow-[0_0_20px] shadow-sky-500/40" />
          <span className="font-semibold tracking-wide text-slate-700 dark:text-slate-300">
            ChatAI
          </span>
        </div>

        <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl p-8 shadow-xl shadow-slate-900/5 dark:shadow-black/40">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              Create account
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Get started in seconds.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="sr-only" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                type="text"
                className="w-full rounded-xl bg-white border border-slate-300 px-4 py-3 outline-none text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-sky-500 focus:border-transparent transition dark:bg-slate-800/70 dark:border-white/10 dark:text-slate-100 dark:placeholder:text-slate-400"
                placeholder="Username"
                {...register("username", { required: "Username is required" })}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-rose-400">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div>
              <label className="sr-only" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="w-full rounded-xl bg-white border border-slate-300 px-4 py-3 outline-none text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-sky-500 focus:border-transparent transition dark:bg-slate-800/70 dark:border-white/10 dark:text-slate-100 dark:placeholder:text-slate-400"
                placeholder="Email address"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-rose-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="sr-only" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                className="w-full rounded-xl bg-white border border-slate-300 px-4 py-3 outline-none text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-sky-500 focus:border-transparent transition dark:bg-slate-800/70 dark:border-white/10 dark:text-slate-100 dark:placeholder:text-slate-400"
                placeholder="Password"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 4, message: "Min 4 characters" },
                })}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-rose-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label className="sr-only" htmlFor="confirm">
                Confirm Password
              </label>
              <input
                id="confirm"
                type="password"
                autoComplete="new-password"
                className="w-full rounded-xl bg-white border border-slate-300 px-4 py-3 outline-none text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-sky-500 focus:border-transparent transition dark:bg-slate-800/70 dark:border-white/10 dark:text-slate-100 dark:placeholder:text-slate-400"
                placeholder="Confirm password"
                {...register("confirm", {
                  required: "Please confirm your password",
                  validate: (v) => v === password || "Passwords do not match",
                })}
              />
              {errors.confirm && (
                <p className="mt-1 text-sm text-rose-400">
                  {errors.confirm.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-sky-600 hover:bg-sky-500 disabled:opacity-70 disabled:cursor-not-allowed text-white font-medium rounded-xl py-3 transition-colors shadow-md shadow-sky-600/30"
            >
              {isSubmitting ? "Creating…" : "Create account"}
            </button>
          </form>

          <p className="text-center text-slate-600 dark:text-slate-400 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-sky-600 hover:text-sky-500 dark:text-sky-400 dark:hover:text-sky-300"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
