import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { supabase } from "../../supabaseClient";

const schema = z.object({
  mobile: z.string().min(10, "Mobile is required"),
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
});

export default function Step1Signup({ onNext }) {
  const [otpSent, setOtpSent] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    const session =
      supabase.auth.getSession &&
      (await supabase.auth.getSession()).data.session;
    const res = await axios.post(
      "http://localhost:8000/api/v1/users/signup",
      data,
      session && session.access_token
        ? { headers: { Authorization: `Bearer ${session.access_token}` } }
        : undefined
    );
    setOtpSent(true);
    onNext(res.data.user_id);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="mobile" className="block text-sm font-medium">
          Mobile Number
        </label>
        <input
          id="mobile"
          {...register("mobile")}
          className="input input-bordered w-full"
          placeholder="Mobile Number"
        />
        {errors.mobile && (
          <span className="text-red-500 text-xs">{errors.mobile.message}</span>
        )}
      </div>
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          {...register("name")}
          className="input input-bordered w-full"
          placeholder="Name"
        />
        {errors.name && (
          <span className="text-red-500 text-xs">{errors.name.message}</span>
        )}
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          {...register("email")}
          className="input input-bordered w-full"
          placeholder="Email"
        />
        {errors.email && (
          <span className="text-red-500 text-xs">{errors.email.message}</span>
        )}
      </div>
      <button type="submit" className="btn btn-primary w-full">
        {otpSent ? "OTP Sent" : "Sign Up"}
      </button>
    </form>
  );
}
