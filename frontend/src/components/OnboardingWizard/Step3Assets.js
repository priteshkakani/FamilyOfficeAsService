import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { supabase } from "../../supabaseClient";

const assetSchema = z.object({
  type: z.string().min(1, "Type required"),
  details: z.string().min(1, "Details required"),
});
const schema = z.object({
  assets: z.array(assetSchema).min(1, "At least one asset required"),
});

export default function Step3Assets({ householdId, onNext }) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      assets: [{ type: "", details: "" }],
    },
  });
  const { fields, append } = useFieldArray({ control, name: "assets" });

  const onSubmit = async (data) => {
    const session =
      supabase.auth.getSession &&
      (await supabase.auth.getSession()).data.session;
    for (const asset of data.assets) {
      await axios.post(
        `http://localhost:8000/api/v1/assets/?household_id=${householdId}`,
        {
          type: asset.type,
          details: { info: asset.details },
        },
        session && session.access_token
          ? { headers: { Authorization: `Bearer ${session.access_token}` } }
          : undefined
      );
    }
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {fields.map((field, idx) => (
        <div key={field.id} className="border p-3 rounded mb-2">
          <input
            {...register(`assets.${idx}.type`)}
            className="input input-bordered w-full mb-1"
            placeholder="Asset Type"
          />
          {errors.assets?.[idx]?.type && (
            <span className="text-red-500 text-xs">
              {errors.assets[idx].type.message}
            </span>
          )}
          <input
            {...register(`assets.${idx}.details`)}
            className="input input-bordered w-full mb-1"
            placeholder="Details"
          />
          {errors.assets?.[idx]?.details && (
            <span className="text-red-500 text-xs">
              {errors.assets[idx].details.message}
            </span>
          )}
        </div>
      ))}
      <button
        type="button"
        className="btn btn-outline w-full"
        onClick={() => append({ type: "", details: "" })}
      >
        Add Asset
      </button>
      <button type="submit" className="btn btn-primary w-full">
        Finish
      </button>
    </form>
  );
}
