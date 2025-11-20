import { useState } from "react";
import { useForm } from "react-hook-form";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Beaker, Sparkles, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { predictFertilizer } from "@/lib/api";

interface FertilizerFormData {
  temperature: number;
  humidity: number;
  moisture: number;
  soilType: string;
  cropType: string;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
}

// Function to generate buy link based on fertilizer name
const getFertilizerBuyLink = (fertilizerName: string): string => {
  // Encode the fertilizer name for URL
  const searchQuery = encodeURIComponent(fertilizerName + " fertilizer buy online");
  
  // You can customize this to direct to specific stores:
  // Option 1: Amazon India
  return `https://www.amazon.in/s?k=${searchQuery}`;
  
  // Option 2: Flipkart
  // return `https://www.flipkart.com/search?q=${searchQuery}`;
  
  // Option 3: Agri-specific marketplace
  // return `https://www.bighaat.com/search?q=${searchQuery}`;
  
  // Option 4: Google Shopping
  // return `https://www.google.com/search?tbm=shop&q=${searchQuery}`;
};

const FertilizerPrediction = () => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FertilizerFormData>({
    defaultValues: {
      temperature: 25,
      humidity: 60,
      moisture: 50,
      nitrogen: 50,
      phosphorus: 50,
      potassium: 50,
    }
  });
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const humidity = watch("humidity");
  const moisture = watch("moisture");

  const onSubmit = async (data: FertilizerFormData) => {
    setIsLoading(true);
    
    try {
      // Map form data to API payload structure
      const apiPayload = {
        Temparature: data.temperature,
        Humidity: data.humidity,
        Moisture: data.moisture,
        soilType: data.soilType,
        croptype: data.cropType,
        nitrogen: data.nitrogen,
        phosphorous: data.phosphorus, // Note: API uses 'phosphorous'
        potassium: data.potassium
      };

      const response = await predictFertilizer(apiPayload);
      
      // Extract fertilizer from response
      const predictedFertilizer = response["Predicted fertilizer"];
      
      setResult(predictedFertilizer);
      toast({
        title: "Recommendation Ready!",
        description: `Best fertilizer: ${predictedFertilizer}`,
      });
    } catch (error) {
      console.error("Prediction error:", error);
      toast({
        title: "Error",
        description: "Failed to predict fertilizer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyNow = () => {
    if (result) {
      const buyLink = getFertilizerBuyLink(result);
      window.open(buyLink, '_blank', 'noopener,noreferrer');
    }
  };

  if (result) {
    return (
      <div className="pb-20 min-h-screen">
        <PageHeader title="Fertilizer Recommendation" subtitle="Optimized for your field" />
        
        <div className="max-w-lg mx-auto px-4 py-6">
          <Card className="p-6 text-center mb-6 gradient-fertilizer text-white">
            <Beaker className="h-16 w-16 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-2">{result}</h2>
            <p className="text-white/90">Recommended Fertilizer</p>
          </Card>

          <Card className="p-6 mb-4">
            <h3 className="font-semibold mb-3">NPK Ratio</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-primary/10 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {result.includes("-") ? result.split("-")[0] : "N"}
                </div>
                <div className="text-xs text-muted-foreground">Nitrogen</div>
              </div>
              <div className="text-center p-3 bg-accent/10 rounded-lg">
                <div className="text-2xl font-bold text-accent">
                  {result.includes("-") ? result.split("-")[1] : "P"}
                </div>
                <div className="text-xs text-muted-foreground">Phosphorus</div>
              </div>
              <div className="text-center p-3 bg-warning/10 rounded-lg">
                <div className="text-2xl font-bold text-warning">
                  {result.includes("-") && result.split("-")[2] ? result.split("-")[2] : "K"}
                </div>
                <div className="text-xs text-muted-foreground">Potassium</div>
              </div>
            </div>
          </Card>

          <Card className="p-6 mb-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Application Guidelines
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between p-3 bg-muted rounded-lg">
                <span className="text-muted-foreground">Quantity per Acre</span>
                <span className="font-semibold">50 kg</span>
              </div>
              <div className="flex justify-between p-3 bg-muted rounded-lg">
                <span className="text-muted-foreground">Application Timing</span>
                <span className="font-semibold">Before Sowing</span>
              </div>
              <div className="flex justify-between p-3 bg-muted rounded-lg">
                <span className="text-muted-foreground">Method</span>
                <span className="font-semibold">Broadcasting</span>
              </div>
              <div className="flex justify-between p-3 bg-muted rounded-lg">
                <span className="text-muted-foreground">Estimated Cost</span>
                <span className="font-semibold">₹1,200</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 mb-4 border-l-4 border-l-warning">
            <h3 className="font-semibold mb-2 text-warning">Safety Precautions</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Wear gloves and mask during application</li>
              <li>• Keep away from water sources</li>
              <li>• Store in cool, dry place</li>
              <li>• Follow recommended dosage</li>
            </ul>
          </Card>

          <div className="flex gap-3">
            <Button onClick={() => setResult(null)} className="flex-1" variant="outline">
              New Prediction
            </Button>
            <Button 
              onClick={handleBuyNow}
              className="flex-1 bg-accent hover:bg-accent/90"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20 min-h-screen">
      <PageHeader
        title="Fertilizer Prediction"
        subtitle="Get precise fertilizer suggestions"
      />
      
      <div className="max-w-lg mx-auto px-4 py-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4 text-primary">Environmental Conditions</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="temperature">Temperature (°C)</Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  {...register("temperature", { required: "Temperature is required" })}
                />
                {errors.temperature && (
                  <p className="text-sm text-destructive mt-1">{errors.temperature.message}</p>
                )}
              </div>

              <div>
                <Label>Humidity: {humidity}%</Label>
                <Slider
                  value={[humidity]}
                  onValueChange={(value) => setValue("humidity", value[0])}
                  max={100}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Soil Moisture: {moisture}%</Label>
                <Slider
                  value={[moisture]}
                  onValueChange={(value) => setValue("moisture", value[0])}
                  max={100}
                  step={1}
                  className="mt-2"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4 text-primary">Soil & Crop Details</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="soilType">Soil Type</Label>
                <Select 
                  onValueChange={(value) => setValue("soilType", value)}
                  {...register("soilType", { required: "Soil type is required" })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select soil type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Red soil">Red Soil</SelectItem>
                    <SelectItem value="Black soil">Black Soil</SelectItem>
                    <SelectItem value="Alluvial soil">Alluvial Soil</SelectItem>
                    <SelectItem value="Clay soil">Clay Soil</SelectItem>
                    <SelectItem value="Sandy soil">Sandy Soil</SelectItem>
                    <SelectItem value="Loamy soil">Loamy Soil</SelectItem>
                  </SelectContent>
                </Select>
                {errors.soilType && (
                  <p className="text-sm text-destructive mt-1">{errors.soilType.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="cropType">Crop Type</Label>
                <Select 
                  onValueChange={(value) => setValue("cropType", value)}
                  {...register("cropType", { required: "Crop type is required" })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select crop" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Rice">Rice</SelectItem>
                    <SelectItem value="Wheat">Wheat</SelectItem>
                    <SelectItem value="Cotton">Cotton</SelectItem>
                    <SelectItem value="Sugarcane">Sugarcane</SelectItem>
                    <SelectItem value="Maize">Maize</SelectItem>
                    <SelectItem value="Groundnut">Groundnut</SelectItem>
                    <SelectItem value="Tobacco">Tobacco</SelectItem>
                    <SelectItem value="Paddy">Paddy</SelectItem>
                     <SelectItem value="Barley">Barley</SelectItem>
                     <SelectItem value="Millets">Millets</SelectItem>
                     <SelectItem value="Pulses">Pulses</SelectItem>
                     <SelectItem value="Ground Nuts">Ground Nuts</SelectItem>
                  </SelectContent>
                </Select>
                {errors.cropType && (
                  <p className="text-sm text-destructive mt-1">{errors.cropType.message}</p>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4 text-primary">Current Soil Nutrients (kg/ha)</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="nitrogen">Nitrogen (N)</Label>
                <Input
                  id="nitrogen"
                  type="number"
                  {...register("nitrogen", { 
                    required: "Nitrogen value is required",
                    min: { value: 0, message: "Must be at least 0" }
                  })}
                />
                {errors.nitrogen && (
                  <p className="text-sm text-destructive mt-1">{errors.nitrogen.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phosphorus">Phosphorus (P)</Label>
                <Input
                  id="phosphorus"
                  type="number"
                  {...register("phosphorus", { 
                    required: "Phosphorus value is required",
                    min: { value: 0, message: "Must be at least 0" }
                  })}
                />
                {errors.phosphorus && (
                  <p className="text-sm text-destructive mt-1">{errors.phosphorus.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="potassium">Potassium (K)</Label>
                <Input
                  id="potassium"
                  type="number"
                  {...register("potassium", { 
                    required: "Potassium value is required",
                    min: { value: 0, message: "Must be at least 0" }
                  })}
                />
                {errors.potassium && (
                  <p className="text-sm text-destructive mt-1">{errors.potassium.message}</p>
                )}
              </div>
            </div>
          </Card>

          <Button
            type="submit"
            className="w-full h-12 text-lg gradient-fertilizer border-0"
            disabled={isLoading}
          >
            {isLoading ? "Analyzing..." : "Get Recommendation"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default FertilizerPrediction;