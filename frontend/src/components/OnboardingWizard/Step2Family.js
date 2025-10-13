import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { supabase } from "../../supabaseClient";

const memberSchema = z.object({
  name: z.string().min(2, "Name required"),
  dob: z.string().min(1, "DOB required"),
  relationship: z.string().min(1, "Relationship required"),
  role: z.string().min(1, "Role required"),
});
const schema = z.object({
  name: z.string().min(2, "Household name required"),
  members: z.array(memberSchema).min(1, "At least one member required"),
});

export default function Step2Family({ userId, onNext }) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      members: [{ name: "", dob: "", relationship: "", role: "" }],
    },
  });
  const { fields, append } = useFieldArray({ control, name: "members" });

  const onSubmit = async (data) => {
    const session =
      supabase.auth.getSession &&
      (await supabase.auth.getSession()).data.session;
    const res = await axios.post(
      `http://localhost:8000/api/v1/households/?owner_id=${userId}`,
      data,
      session && session.access_token
        ? { headers: { Authorization: `Bearer ${session.access_token}` } }
        : undefined
    );
    onNext(res.data.household_id);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Household Name</label>
        <input
          {...register("name")}
          className="input input-bordered w-full"
          placeholder="Household Name"
        />
        {errors.name && (
          <span className="text-red-500 text-xs">{errors.name.message}</span>
        )}
      </div>
      {fields.map((field, idx) => (
        <div key={field.id} className="border p-3 rounded mb-2">
          <input
            {...register(`members.${idx}.name`)}
            className="input input-bordered w-full mb-1"
            placeholder="Name"
          />
          {errors.members?.[idx]?.name && (
            <span className="text-red-500 text-xs">
              {errors.members[idx].name.message}
            </span>
          )}
          <input
            {...register(`members.${idx}.dob`)}
            type="date"
            className="input input-bordered w-full mb-1"
            placeholder="DOB"
          />
          {errors.members?.[idx]?.dob && (
            <span className="text-red-500 text-xs">
              {errors.members[idx].dob.message}
            </span>
          )}
          <input
            {...register(`members.${idx}.relationship`)}
            className="input input-bordered w-full mb-1"
            placeholder="Relationship"
          />
          {errors.members?.[idx]?.relationship && (
            <span className="text-red-500 text-xs">
              {errors.members[idx].relationship.message}
            </span>
          )}
          <input
            {...register(`members.${idx}.role`)}
            className="input input-bordered w-full mb-1"
            placeholder="Role"
          />
          {errors.members?.[idx]?.role && (
            <span className="text-red-500 text-xs">
              {errors.members[idx].role.message}
            </span>
          )}
        </div>
      ))}
      <button
        type="button"
        className="btn btn-outline w-full"
        onClick={() =>
          append({ name: "", dob: "", relationship: "", role: "" })
        }
      >
        Add Member
      </button>
      <button type="submit" className="btn btn-primary w-full">
        Next
      </button>
    </form>
  );
}
