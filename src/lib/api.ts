const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

// ---------- TYPES ----------
export type ChatMessageDTO = {
  role: "user" | "assistant";
  content: string;
};

export interface CropInput {
  N: number;
  P: number;
  K: number;
  temperature: number;
  humidity: number;
  ph: number;
  rainfall: number;
}

export interface FertilizerInput {
  Temparature: number;
  Humidity: number;
  Moisture: number;
  soilType: string;
  croptype: string;
  nitrogen: number;
  phosphorous: number;
  potassium: number;
}
export interface DiseaseResult{
  predicted_class: string;
  confidence: number;
}

// ---------- API CALLS ----------
export async function predictCrop(input: CropInput) {
  const res = await fetch(`${API_BASE_URL}/predict/crop`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    throw new Error("Crop prediction failed");
  }

  // Return type matches actual API response
  return res.json() as Promise<{ "Predicted crop": string }>;
}

export async function predictFertilizer(input: FertilizerInput) {
  const res = await fetch(`${API_BASE_URL}/predict/fertilizer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    throw new Error("Fertilizer prediction failed");
  }

  return res.json() as Promise<{ "Predicted fertilizer": string }>;
}

export async function detectDisease(file: File) {
  const formData = new FormData();
  formData.append("file", file); // or "image" depending on your API

  const res = await fetch(`${API_BASE_URL}/predict/disease`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Disease detection failed");
  }

  return res.json() as Promise<DiseaseResult>;
}


// export async function chatWithAssistant(
//   message: string,
//   history: ChatMessageDTO[]
// ) {
//   const res = await fetch(`${API_BASE_URL}/api/chat`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ message, history }),
//   });

//   if (!res.ok) {
//     throw new Error("Chat request failed");
//   }

//   return res.json() as Promise<{ reply: string }>;
// }
