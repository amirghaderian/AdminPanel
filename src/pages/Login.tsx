// src/pages/Login.tsx
import { Eye, EyeOff, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

type FormData = {
  email: string;
  password: string;
  rememberMe: boolean;
};

const Login = () => {
  const {
    register,
    formState: { errors },
  } = useForm<FormData>();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex h-screen bg-gradient-to-r from-blue-50 to-white">
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-700 to-blue-900 items-center justify-center">
        <h1 className="text-white text-4xl font-bold">سامانه بانک ملت</h1>
      </div>
      <div className="flex w-full md:w-1/2 justify-center items-center p-6">
        <form className="w-full max-w-md bg-white p-10 shadow-2xl rounded-2xl border border-gray-200">
          <h2 className="text-3xl font-bold text-center text-blue-900 mb-8">
            ورود به حساب
          </h2>

          <div className="mb-5">
            <label className="block text-gray-700 font-medium text-right mb-2">
              نام کاربری (ایمیل)
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 text-gray-400  z-50 cursor-pointer">
                <Mail />
              </div>
              <input
                type="text"
                {...register("email", { required: "ایمیل الزامی است" })}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-right"
                placeholder="ایمیل خود را وارد کنید"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1 text-right">
                {errors.email?.message}
              </p>
            )}
          </div>

          <div className="mb-5">
            <label className="block text-gray-700 font-medium text-right mb-2">
              رمز عبور
            </label>
            <div className="relative">
              {showPassword ? (
                <div
                  className="absolute top-3 left-3 text-gray-400  z-50 cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  <EyeOff />
                </div>
              ) : (
                <div
                  className="absolute top-3 left-3 text-gray-400  z-50 cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  <Eye />
                </div>
              )}
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", { required: "رمز عبور الزامی است" })}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-right"
                placeholder="رمز عبور خود را وارد کنید"
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1 text-right">
                {errors.password?.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center text-gray-700 text-sm text-right">
              <input
                type="checkbox"
                {...register("rememberMe")}
                className="ml-2"
              />
              مرا به خاطر بسپار
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg font-semibold transition duration-300 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ورود
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
