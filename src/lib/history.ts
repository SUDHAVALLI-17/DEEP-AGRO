// src/lib/history.ts
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY ?? ""
);

export type PredictionModule = "crop" | "fertilizer" | "disease" | "other";

export type PredictionHistory = {
  id: string;
  user_id: string;
  module: PredictionModule;
  input: Record<string, any>;
  output: Record<string, any>;
  created_at: string;
};

// ---------- SAVE ONE PREDICTION ----------
export async function savePredictionHistory(params: {
  userId: string;
  module: PredictionModule;
  input: Record<string, any>;
  output: Record<string, any>;
}) {
  const { userId, module, input, output } = params;

  const { error } = await supabase.from("prediction_history").insert({
    user_id: userId,
    module,
    input,
    output,
  });

  if (error) {
    console.error("Error saving prediction history:", error);
    throw error;
  }
}

// ---------- FETCH HISTORY FOR CURRENT USER ----------
export async function fetchPredictionHistory(
  userId: string
): Promise<PredictionHistory[]> {
  const { data, error } = await supabase
    .from("prediction_history")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching prediction history:", error);
    throw error;
  }

  return (data as PredictionHistory[]) ?? [];
}
