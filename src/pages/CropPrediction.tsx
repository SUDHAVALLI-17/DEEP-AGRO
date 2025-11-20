import { useState } from "react";
import { useForm } from "react-hook-form";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Sprout, Droplets, ThermometerSun, Wind, FlaskConical, CloudRain, Leaf } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { predictCrop } from "@/lib/api";

interface CropFormData {
  N: number;
  P: number;
  K: number;
  temperature: number;
  humidity: number;
  ph: number;
  rainfall: number;
}

// Utility function to format crop names
const formatCropName = (cropName: string): string => {
  if (!cropName) return "";
  return cropName
    .toString()
    .replace(/[_-]/g, " ")
    .split(/(?=[A-Z])|[\s]+/) // split on capitals or spaces
    .filter(Boolean)
    .join(" ")
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
};

// Crop information database
const cropInfo: Record<string, { icon: string; season: string; duration: string }> = {
  rice: { icon: "🌾", season: "Kharif", duration: "120-150 days" },
  wheat: { icon: "🌾", season: "Rabi", duration: "120-130 days" },
  maize: { icon: "🌽", season: "Kharif/Rabi", duration: "80-110 days" },
  cotton: { icon: "🌱", season: "Kharif", duration: "150-180 days" },
  sugarcane: { icon: "🎋", season: "Year-round", duration: "10-12 months" },
  kidneybeans: { icon: "🫘", season: "Kharif/Rabi", duration: "90-120 days" },
  chickpea: { icon: "🫘", season: "Rabi", duration: "100-120 days" },
  blackgram: { icon: "🫘", season: "Kharif/Rabi", duration: "60-90 days" },
  mungbean: { icon: "🫘", season: "Kharif/Summer", duration: "60-75 days" },
  mothbeans: { icon: "🫘", season: "Kharif", duration: "75-90 days" },
  pigeonpeas: { icon: "🫘", season: "Kharif", duration: "150-180 days" },
  lentil: { icon: "🫘", season: "Rabi", duration: "110-130 days" },
  jute: { icon: "🌿", season: "Kharif", duration: "120-150 days" },
  coffee: { icon: "☕", season: "Year-round", duration: "Perennial" },
  coconut: { icon: "🥥", season: "Year-round", duration: "Perennial" },
  papaya: { icon: "🍈", season: "Year-round", duration: "9-12 months" },
  orange: { icon: "🍊", season: "Year-round", duration: "Perennial" },
  apple: { icon: "🍎", season: "Year-round", duration: "Perennial" },
  muskmelon: { icon: "🍈", season: "Summer", duration: "70-90 days" },
  watermelon: { icon: "🍉", season: "Summer", duration: "70-100 days" },
  grapes: { icon: "🍇", season: "Year-round", duration: "Perennial" },
  mango: { icon: "🥭", season: "Year-round", duration: "Perennial" },
  banana: { icon: "🍌", season: "Year-round", duration: "9-12 months" },
  pomegranate: { icon: "🍎", season: "Year-round", duration: "Perennial" },
};

const MARKET_LINK = "https://www.commodityonline.com/mandiprices";

// Function to get market link for specific crop
const getCropMarketLink = (cropName: string): string => {
  const formattedCrop = cropName.toLowerCase().replace(/\s+/g, "-");
  return `${MARKET_LINK}/${formattedCrop}`;
};

const CropPrediction = () => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<CropFormData>({
    defaultValues: {
      N: 50,
      P: 50,
      K: 50,
      temperature: 25,
      humidity: 60,
      ph: 6.5,
      rainfall: 100,
    }
  });
  const [predictions, setPredictions] = useState<Array<{ crop: string; confidence: number }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const humidity = watch("humidity");
  const ph = watch("ph");

  const parsePredictionsFromResponse = (response: any) => {
    if (!response) return [];

    const possibleArrays = [
      response.predictions,
      response.prediction,
      response.top_k,
      response.top3,
      response.topK,
      response.top_predictions,
      response.results,
      response.predictions_list,
    ];
    for (const arr of possibleArrays) {
      if (Array.isArray(arr) && arr.length) {
        return arr
          .map((item: any) => {
            if (typeof item === "string") return { crop: item, confidence: 1 };
            if (item.crop || item.label || item.class) {
              return {
                crop: item.crop ?? item.label ?? item.class,
                confidence: Number(item.confidence ?? item.score ?? item.probability ?? 1),
              };
            }
            if (Array.isArray(item) && item.length >= 2) {
              return { crop: item[0], confidence: Number(item[1]) };
            }
            return null;
          })
          .filter(Boolean)
          .slice(0, 3);
      }
    }

    if (response["Predicted crop"] || response.predictedCrop || response.prediction) {
      const crop = response["Predicted crop"] ?? response.predictedCrop ?? response.prediction;
      return [{ crop: crop.toString(), confidence: 1 }];
    }

    if (typeof response === "object") {
      const entries = Object.entries(response)
        .filter(([k, v]) => typeof v === "number")
        .map(([k, v]) => ({ crop: k, confidence: Number(v) }));
      if (entries.length) {
        return entries.sort((a, b) => b.confidence - a.confidence).slice(0, 3);
      }
    }

    return [];
  };

  const onSubmit = async (data: CropFormData) => {
    setIsLoading(true);

    try {
      const response = await predictCrop(data);
      const parsed = parsePredictionsFromResponse(response);

      const normalized = parsed.map((p) => {
        let conf = Number(p.confidence ?? 1);
        if (conf > 1) conf = conf / 100;
        conf = Math.max(0, Math.min(1, conf));
        return { crop: p.crop, confidence: conf };
      });

      if (!normalized.length && response && (response["Predicted crop"] || response.predictedCrop || response.prediction)) {
        normalized.push({ crop: (response["Predicted crop"] ?? response.predictedCrop ?? response.prediction).toString(), confidence: 1 });
      }

      if (!normalized.length) {
        throw new Error("Unable to parse predictions from API response.");
      }

      setPredictions(normalized.slice(0, 3));
      toast({
        title: "Recommendation Ready!",
        description: `Top ${Math.min(3, normalized.length)} suggestions returned.`,
      });
    } catch (error: any) {
      console.error("Crop prediction error:", error);
      toast({
        title: "Error",
        description: error?.message ?? "Failed to predict crop. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Result view when predictions exist
  if (predictions.length > 0) {
    const primary = predictions[0];
    const primaryKey = primary.crop.toLowerCase().replace(/\s+/g, "");
    const cropData = cropInfo[primaryKey] || { icon: "🌱", season: "Variable", duration: "Variable" };

    return (
      <div className="pb-20 min-h-screen">
        <PageHeader title="Crop Recommendation" subtitle="Top crop suggestions for your field" />

        <div className="max-w-lg mx-auto px-4 py-6">
          <Card className="p-6 text-center mb-6 gradient-crop text-white">
            <div className="text-6xl mb-4">{cropData.icon}</div>
            <h2 className="text-3xl font-bold mb-2">{formatCropName(primary.crop)}</h2>
            <p className="text-white/90">Top recommendation</p>
          </Card>

          <Card className="p-6 mb-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2 justify-center">
              <Sprout className="h-5 w-5 text-primary" />
              Crop Information
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between p-3 bg-muted rounded-lg">
                <span className="text-muted-foreground">Growing Season</span>
                <span className="font-semibold">{cropData.season}</span>
              </div>
              <div className="flex justify-between p-3 bg-muted rounded-lg">
                <span className="text-muted-foreground">Growth Duration</span>
                <span className="font-semibold">{cropData.duration}</span>
              </div>
              <div className="flex justify-between p-3 bg-muted rounded-lg">
                <span className="text-muted-foreground">Soil pH</span>
                <span className="font-semibold">{ph.toFixed(1)}</span>
              </div>
              <div className="flex justify-between p-3 bg-muted rounded-lg">
                <span className="text-muted-foreground">Climate</span>
                <span className="font-semibold">
                  {humidity >= 70 ? "Humid" : humidity >= 50 ? "Moderate" : "Dry"}
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-6 mb-4">
            <h3 className="font-semibold mb-3 text-center">Best Crop Suggestion</h3>
            <div className="space-y-3">
              {predictions.map((p, idx) => {
                const key = p.crop.toLowerCase().replace(/\s+/g, "");
                const info = cropInfo[key] || { icon: "🌱", season: "Variable", duration: "Variable" };
                return (
                  <div key={idx} className="flex flex-col items-center text-center p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{info.icon}</div>
                      <div>
                        <div className="font-semibold">{formatCropName(p.crop)}</div>
                        <div className="text-xs text-muted-foreground">{info.season} • {info.duration}</div>
                      </div>
                    </div>
                    <div className="mt-2">
                      {/* <div className="font-semibold">{Math.round(p.confidence * 100)}%</div> */}
                      {/* <div className="text-xs text-muted-foreground">confidence</div> */}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="p-6 mb-4">
            <h3 className="font-semibold mb-2 text-accent text-center">Market Information</h3>
            <p className="text-sm text-muted-foreground mb-3 text-center">
              Check current market prices and demand for {formatCropName(primary.crop)} in your region before planting.
            </p>
            <a
              href={getCropMarketLink(primary.crop)}
              target="_blank"
              rel="noopener noreferrer"
              // Styled to match "New Prediction" look and hover behavior
              className="block w-full text-center border rounded-md px-4 py-2 transition-colors font-semibold text-primary border-primary hover:bg-primary hover:text-white"
            >
              View {formatCropName(primary.crop)} Market Prices
            </a>
          </Card>

          <div className="flex gap-3">
            <Button onClick={() => setPredictions([])} className="flex-1" variant="outline">
              New Prediction
            </Button>
            {/* Save Recommendation removed as requested */}
          </div>
        </div>
      </div>
    );
  }

  // Form view
  return (
    <div className="pb-20 min-h-screen">
      <PageHeader
        title="Crop Recommendation"
        subtitle="Find the best crop for your soil"
      />

      <div className="max-w-lg mx-auto px-4 py-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4 text-primary flex items-center gap-2">
              <FlaskConical className="h-5 w-5" />
              Soil Nutrients (kg/ha)
            </h3>

            <div className="space-y-4">
              <div>
                <Label htmlFor="N" className="flex items-center gap-2">
                  <span className="text-blue-600">●</span>
                  Nitrogen (N)
                </Label>
                <Input
                  id="N"
                  type="number"
                  min="0"
                  {...register("N", {
                    required: "Nitrogen value is required",
                    min: { value: 0, message: "Must be at least 0" }
                  })}
                />
                {errors.N && (
                  <p className="text-sm text-destructive mt-1">{errors.N.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="P" className="flex items-center gap-2">
                  <span className="text-orange-600">●</span>
                  Phosphorus (P)
                </Label>
                <Input
                  id="P"
                  type="number"
                  min="0"
                  {...register("P", {
                    required: "Phosphorus value is required",
                    min: { value: 0, message: "Must be at least 0" }
                  })}
                />
                {errors.P && (
                  <p className="text-sm text-destructive mt-1">{errors.P.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="K" className="flex items-center gap-2">
                  <span className="text-purple-600">●</span>
                  Potassium (K)
                </Label>
                <Input
                  id="K"
                  type="number"
                  min="0"
                  {...register("K", {
                    required: "Potassium value is required",
                    min: { value: 0, message: "Must be at least 0" }
                  })}
                />
                {errors.K && (
                  <p className="text-sm text-destructive mt-1">{errors.K.message}</p>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4 text-primary flex items-center gap-2">
              <ThermometerSun className="h-5 w-5" />
              Environmental Conditions
            </h3>

            <div className="space-y-4">
              <div>
                <Label htmlFor="temperature" className="flex items-center gap-2">
                  <ThermometerSun className="h-4 w-4 text-red-500" />
                  Temperature (°C)
                </Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  {...register("temperature", {
                    required: "Temperature is required"
                  })}
                />
                {errors.temperature && (
                  <p className="text-sm text-destructive mt-1">{errors.temperature.message}</p>
                )}
              </div>

              <div>
                <Label className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  Humidity: {humidity}%
                </Label>
                <Slider
                  value={[humidity]}
                  onValueChange={(value) => setValue("humidity", value[0])}
                  max={100}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="rainfall" className="flex items-center gap-2">
                  <CloudRain className="h-4 w-4 text-blue-600" />
                  Rainfall (mm)
                </Label>
                <Input
                  id="rainfall"
                  type="number"
                  step="0.1"
                  min="1"
                  {...register("rainfall", {
                    required: "Rainfall is required",
                    min: { value: 1, message: "Must be at least 1" }
                  })}
                />
                {errors.rainfall && (
                  <p className="text-sm text-destructive mt-1">{errors.rainfall.message}</p>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4 text-primary flex items-center gap-2">
              <FlaskConical className="h-5 w-5" />
              Soil Properties
            </h3>

            <div>
              <Label className="flex items-center gap-2 mb-2">
                <FlaskConical className="h-4 w-4 text-green-600" />
                pH Level: {ph.toFixed(1)}
              </Label>
              <Slider
                value={[ph]}
                onValueChange={(value) => setValue("ph", value[0])}
                min={0}
                max={14}
                step={0.1}
                className="mt-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>Acidic (0-6)</span>
                <span>Neutral (7)</span>
                <span>Alkaline (8-14)</span>
              </div>
            </div>
          </Card>

          <Button
            type="submit"
            className="w-full h-12 text-lg gradient-crop border-0"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                Analyzing...
              </>
            ) : (
              <>
                <Sprout className="h-5 w-5 mr-2" />
                Get Recommendation
              </>
            )}
          </Button>
        </form>

        <Card className="p-6 mt-6 border-l-4 border-l-primary">
          <h3 className="font-semibold mb-2 text-primary">How it works</h3>
          <p className="text-sm text-muted-foreground">
            Our AI analyzes your soil nutrients, climate conditions, and environmental factors to recommend the most suitable crop for your field. This helps maximize yield and optimize resource usage.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default CropPrediction;
