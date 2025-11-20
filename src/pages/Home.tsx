import { Card } from "@/components/ui/card";
import {
  Leaf,
  Bug,
  Beaker,
  MessageCircle,
  Sparkles,
  TrendingUp,
  Shield,
  Sun,
  Sprout,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

// FeatureCard component inline
const FeatureCard = ({ title, icon: Icon, gradient, to }) => {
  const navigate = useNavigate();
  
  return (
    <Card 
      className={`${gradient} p-8 cursor-pointer transform transition-all duration-500 hover:scale-110 hover:shadow-2xl group relative overflow-hidden h-44 flex items-center justify-center`}
      onClick={() => navigate(to)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative flex flex-col items-center text-center">
        <div className="bg-white/25 backdrop-blur-sm p-5 rounded-3xl mb-4 group-hover:bg-white/40 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 shadow-lg">
          <Icon className="h-10 w-10 text-white" />
        </div>
        <h3 className="font-bold text-lg leading-tight text-white">{title}</h3>
      </div>
    </Card>
  );
};

const Home = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="pb-20 min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50">
      {/* Hero Section with Enhanced Agriculture Theme */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-600 via-emerald-600 to-teal-500 text-white px-4 pt-16 pb-20 rounded-b-[3rem] shadow-2xl">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div className="absolute top-10 left-10 w-96 h-96 bg-yellow-300/40 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-lime-400/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-green-300/40 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        {/* Floating Agriculture Icons */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <Leaf className="absolute top-20 left-10 h-16 w-16 animate-bounce" style={{animationDuration: '3s'}} />
          <Sprout className="absolute top-40 right-20 h-20 w-20 animate-bounce" style={{animationDuration: '4s', animationDelay: '1s'}} />
          <Sun className="absolute bottom-32 left-1/4 h-24 w-24 animate-spin" style={{animationDuration: '20s'}} />
        </div>

        <div className="relative max-w-lg mx-auto">
          {/* Welcome Header with Enhanced Animation */}
          <div className="text-center mb-10" style={{animation: 'fadeIn 0.8s ease-out'}}>
            <h1 className="text-4xl font-extrabold mb-4 tracking-tight drop-shadow-lg">
              Welcome to DeepAgro
            </h1>
            <p className="text-white text-xl font-semibold tracking-wide drop-shadow-md">
              🌾 Smart AI-Based Agriculture 🌱
            </p>
            <div className="flex items-center justify-center gap-3 mt-5">
              <div className="h-2 w-2 bg-yellow-300 rounded-full animate-pulse shadow-lg"></div>
              <div className="h-2 w-2 bg-yellow-300 rounded-full animate-pulse shadow-lg" style={{animationDelay: '300ms'}}></div>
              <div className="h-2 w-2 bg-yellow-300 rounded-full animate-pulse shadow-lg" style={{animationDelay: '600ms'}}></div>
            </div>
          </div>

          {/* Stats Cards with Enhanced Stagger Animation */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="bg-white/20 backdrop-blur-xl border-white/40 p-5 text-center transform transition-all duration-500 hover:scale-110 hover:bg-white/30 shadow-xl hover:shadow-2xl" style={{animation: 'slideUp 0.8s ease-out'}}>
              <TrendingUp className="h-8 w-8 mx-auto mb-3 text-yellow-300 drop-shadow-lg" />
              <div className="text-3xl font-extrabold text-white drop-shadow-md">98%</div>
              <div className="text-sm text-white font-semibold mt-1">Accuracy</div>
            </Card>
            <Card className="bg-white/20 backdrop-blur-xl border-white/40 p-5 text-center transform transition-all duration-500 hover:scale-110 hover:bg-white/30 shadow-xl hover:shadow-2xl" style={{animation: 'slideUp 0.8s ease-out', animationDelay: '200ms'}}>
              <Shield className="h-8 w-8 mx-auto mb-3 text-yellow-300 drop-shadow-lg" />
              <div className="text-3xl font-extrabold text-white drop-shadow-md">24/7</div>
              <div className="text-sm text-white font-semibold mt-1">Support</div>
            </Card>
            <Card className="bg-white/20 backdrop-blur-xl border-white/40 p-5 text-center transform transition-all duration-500 hover:scale-110 hover:bg-white/30 shadow-xl hover:shadow-2xl" style={{animation: 'slideUp 0.8s ease-out', animationDelay: '400ms'}}>
              <Leaf className="h-8 w-8 mx-auto mb-3 text-yellow-300 drop-shadow-lg" />
              <div className="text-3xl font-extrabold text-white drop-shadow-md">Smart</div>
              <div className="text-sm text-white font-semibold mt-1">Insights</div>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-lg mx-auto px-4 mt-10">
        <div className="flex items-center justify-between mb-8" style={{animation: 'fadeIn 0.8s ease-out'}}>
          <h2 className="text-3xl font-extrabold text-gray-800 flex items-center gap-3">
            <Sprout className="h-8 w-8 text-green-600" />
            {t("smart_agriculture_tools")}
          </h2>
          <Sparkles className="h-8 w-8 text-green-600 animate-pulse" />
        </div>

        {/* Feature Cards Grid with Enhanced Hover Animations */}
        <div className="grid grid-cols-2 gap-5 mb-10">
          <div style={{animation: 'slideUp 0.8s ease-out', animationDelay: '100ms'}}>
            <FeatureCard
              title={t("crop_prediction")}
              icon={Leaf}
              gradient="gradient-crop"
              to="/crop-prediction"
            />
          </div>
          <div style={{animation: 'slideUp 0.8s ease-out', animationDelay: '250ms'}}>
            <FeatureCard
              title={t("disease_detection")}
              icon={Bug}
              gradient="gradient-disease"
              to="/disease-detection"
            />
          </div>
          <div style={{animation: 'slideUp 0.8s ease-out', animationDelay: '400ms'}}>
            <FeatureCard
              title={t("fertilizer_prediction")}
              icon={Beaker}
              gradient="gradient-fertilizer"
              to="/fertilizer-prediction"
            />
          </div>
          <div style={{animation: 'slideUp 0.8s ease-out', animationDelay: '550ms'}}>
            <FeatureCard
              title={t("ai_assistant")}
              icon={MessageCircle}
              gradient="gradient-ai"
              to="/assistant"
            />
          </div>
        </div>

        {/* Enhanced Quick Tips with Animation */}
        <Card className="p-6 mb-6 border-l-4 border-l-green-600 bg-gradient-to-r from-green-100 via-emerald-50 to-teal-50 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105" style={{animation: 'slideUp 0.8s ease-out', animationDelay: '700ms'}}>
          <div className="flex items-start gap-4">
            <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-4 rounded-2xl shadow-lg transform hover:rotate-12 transition-transform duration-300">
              <Leaf className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-extrabold text-green-800 mb-2 text-xl flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-600" />
                {t("todays_farming_tip_title")}
              </h3>
              <p className="text-base text-gray-700 leading-relaxed">
                {t("todays_farming_tip_body")}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounceSlow {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-15px) scale(1.05);
          }
        }
      `}</style>
    </div>
  );
};

export default Home;