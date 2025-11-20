import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  User,
  MapPin,
  Sprout,
  Bell,
  Globe,
  Info,
  HelpCircle,
  LogOut,
  Phone,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useNavigate } from "react-router-dom";

interface ProfileData {
  farmer_name: string;
  location: string;
  phone_number: string;
  farm_size: string;
  primary_crops: string;
}

const Profile = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [editData, setEditData] = useState<ProfileData>({
    farmer_name: "",
    location: "",
    phone_number: "",
    farm_size: "",
    primary_crops: "",
  });
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchProfile();
  }, [user, navigate]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
      setEditData(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update(editData)
        .eq("user_id", user?.id);

      if (error) throw error;

      setProfile(editData);
      setIsEditOpen(false);
      toast({ title: t("save") + " successful" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>{t("loading")}</p>
      </div>
    );
  }

  const initials = profile.farmer_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="pb-20 min-h-screen">
      <PageHeader title={t("profile")} subtitle={t("manage_account")} showBack={false} />

      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Profile Info */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-2xl font-bold">
              {initials}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{profile.farmer_name}</h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogTrigger asChild>
                  <Button variant="link" className="p-0 h-auto text-primary">
                    {t("edit_profile")}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t("edit_profile")}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="farmer_name">{t("farmer_name")}</Label>
                      <Input
                        id="farmer_name"
                        value={editData.farmer_name}
                        onChange={(e) =>
                          setEditData({ ...editData, farmer_name: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">{t("phone_number")}</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={editData.phone_number}
                        onChange={(e) =>
                          setEditData({ ...editData, phone_number: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">{t("location")}</Label>
                      <Input
                        id="location"
                        value={editData.location}
                        onChange={(e) =>
                          setEditData({ ...editData, location: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="farm_size">{t("farm_size")}</Label>
                      <Input
                        id="farm_size"
                        value={editData.farm_size}
                        onChange={(e) =>
                          setEditData({ ...editData, farm_size: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="crops">{t("primary_crops")}</Label>
                      <Input
                        id="crops"
                        value={editData.primary_crops}
                        onChange={(e) =>
                          setEditData({ ...editData, primary_crops: e.target.value })
                        }
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSave} disabled={loading} className="flex-1">
                        {loading ? t("loading") : t("save")}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditOpen(false)}
                        className="flex-1"
                      >
                        {t("cancel")}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-3">
            {profile.phone_number && (
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{t("phone_number")}:</span>
                <span className="font-medium">{profile.phone_number}</span>
              </div>
            )}
            {profile.location && (
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{t("location")}:</span>
                <span className="font-medium">{profile.location}</span>
              </div>
            )}
            {profile.farm_size && (
              <div className="flex items-center gap-3 text-sm">
                <Sprout className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{t("farm_size")}:</span>
                <span className="font-medium">{profile.farm_size}</span>
              </div>
            )}
            {profile.primary_crops && (
              <div className="flex items-center gap-3 text-sm">
                <Sprout className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{t("primary_crops")}:</span>
                <span className="font-medium">{profile.primary_crops}</span>
              </div>
            )}
          </div>
        </Card>

        {/* Preferences */}
        <Card className="p-6 mb-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            {t("preferences")}
          </h3>

          <div className="space-y-3">
            <div>
              <Label className="mb-2 block">{t("language")}</Label>
              <LanguageSwitcher />
            </div>
          </div>
        </Card>

        {/* App Information */}
        <Card className="p-6 mb-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            {t("app_information")}
          </h3>

          <div className="space-y-3">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate("/about")}
            >
              <Info className="h-4 w-4 mr-3" />
              {t("about_deepagro")}
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => navigate("/about")}
            >
              <HelpCircle className="h-4 w-4 mr-3" />
              {t("help_support")}
            </Button>
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-sm text-muted-foreground">{t("version")}</span>
              <span className="text-sm font-medium">1.0.0</span>
            </div>
          </div>
        </Card>

        {/* Logout */}
        <Button variant="destructive" className="w-full" onClick={signOut}>
          <LogOut className="h-4 w-4 mr-2" />
          {t("logout")}
        </Button>
      </div>
    </div>
  );
};

export default Profile;
