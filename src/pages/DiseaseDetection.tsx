import { useState, useRef } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Upload, AlertCircle, CheckCircle, Leaf, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { detectDisease } from "@/lib/api";

// Utility function to format disease names
const formatDiseaseName = (rawName: string): { plant: string; disease: string } => {
  // Split by triple underscore (e.g., "Peach___Bacterial_spot")
  const parts = rawName.split("___");
  
  if (parts.length === 2) {
    const plant = parts[0].replace(/_/g, " ");
    const disease = parts[1].replace(/_/g, " ");
    return { plant, disease };
  }
  
  // Fallback if format is different
  return { plant: "Unknown", disease: rawName.replace(/_/g, " ") };
};

const DiseasePrediction = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<{ predicted_class: string; confidence: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid File",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select an image smaller than 10MB",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      // Reset previous result
      setResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      toast({
        title: "No Image Selected",
        description: "Please select an image first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await detectDisease(selectedFile);
      
      setResult(response);
      toast({
        title: "Analysis Complete!",
        description: `Disease detected with ${response.confidence.toFixed(1)}% confidence`,
      });
    } catch (error) {
      console.error("Disease detection error:", error);
      toast({
        title: "Analysis Failed",
        description: "Could not analyze the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setSelectedFile(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-green-600";
    if (confidence >= 60) return "text-yellow-600";
    return "text-orange-600";
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 80) return "High Confidence";
    if (confidence >= 60) return "Moderate Confidence";
    return "Low Confidence";
  };

  return (
    <div className="pb-20 min-h-screen">
      <PageHeader
        title="Disease Detection"
        subtitle="AI-powered plant disease identification"
      />

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Upload Section */}
        <Card className="p-6 mb-6">
          <div className="text-center">
            {!selectedImage ? (
              <div
                className="border-2 border-dashed border-muted rounded-lg p-12 cursor-pointer hover:border-primary transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Upload Plant Image</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Click to select or drag and drop an image of the affected plant
                </p>
                <Button variant="outline" className="mx-auto">
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Image
                </Button>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={selectedImage}
                  alt="Selected plant"
                  className="w-full h-auto max-h-96 object-contain rounded-lg"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={handleReset}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {selectedImage && !result && (
            <Button
              onClick={handleAnalyze}
              disabled={isLoading}
              className="w-full mt-4 h-12 text-lg gradient-disease border-0"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Leaf className="h-5 w-5 mr-2" />
                  Analyze Image
                </>
              )}
            </Button>
          )}
        </Card>

        {/* Results Section */}
        {result && (
          <div className="space-y-4">
            <Card className="p-6 gradient-disease text-white">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {result.confidence >= 60 ? (
                    <CheckCircle className="h-8 w-8" />
                  ) : (
                    <AlertCircle className="h-8 w-8" />
                  )}
                  <div>
                    <h3 className="text-sm font-medium text-white/80">Detection Result</h3>
                    <p className="text-2xl font-bold">
                      {formatDiseaseName(result.predicted_class).disease}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/20">
                <span className="text-white/80">Plant Type</span>
                <span className="font-semibold text-lg">
                  {formatDiseaseName(result.predicted_class).plant}
                </span>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                Confidence Level
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">
                      {getConfidenceLabel(result.confidence)}
                    </span>
                    <span className={`text-lg font-bold ${getConfidenceColor(result.confidence)}`}>
                      {result.confidence.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        result.confidence >= 80
                          ? "bg-green-500"
                          : result.confidence >= 60
                          ? "bg-yellow-500"
                          : "bg-orange-500"
                      }`}
                      style={{ width: `${result.confidence}%` }}
                    />
                  </div>
                </div>

                {result.confidence < 60 && (
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-sm text-orange-800">
                      ⚠️ Low confidence detection. Consider uploading a clearer image or consult with an expert for accurate diagnosis.
                    </p>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-3">Recommended Actions</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Isolate affected plants to prevent spread</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Remove and dispose of infected plant parts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Apply appropriate fungicide or treatment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Improve air circulation and reduce moisture</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Consult with local agricultural extension for specific treatment</span>
                </li>
              </ul>
            </Card>

            <div className="flex gap-3">
              <Button onClick={handleReset} className="flex-1" variant="outline">
                <Camera className="h-4 w-4 mr-2" />
                Analyze Another
              </Button>
            </div>
          </div>
        )}

        {/* Info Card */}
        {!selectedImage && (
          <Card className="p-6 border-l-4 border-l-primary">
            <h3 className="font-semibold mb-2 text-primary">Tips for Best Results</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Take photos in good lighting conditions</li>
              <li>• Focus on the affected area of the plant</li>
              <li>• Avoid blurry or low-resolution images</li>
              <li>• Include clear view of symptoms</li>
              <li>• Use multiple angles if unsure</li>
            </ul>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DiseasePrediction;