import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";
import { Sprout, Target, CheckCircle, Phone, Mail, HelpCircle } from "lucide-react";

const About = () => {
  const { t } = useTranslation();

  return (
    <div className="pb-20 min-h-screen">
      <PageHeader
        title={t("about_deepagro")}
        subtitle={t("app_information")}
        showBack={true}
      />

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">

        {/* INTRO */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Sprout className="h-6 w-6 text-primary" />
            </div>

            <div>
              <h2 className="text-2xl font-bold">{t("app_name")}</h2>
              <p className="text-sm text-muted-foreground">
                {t("version")} 1.0.0
              </p>
            </div>
          </div>

          <p className="text-muted-foreground leading-relaxed">
            {t("about_description")}
          </p>
        </Card>

        {/* MISSION */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Target className="h-6 w-6 text-primary" />
            <h3 className="text-xl font-semibold">{t("our_mission")}</h3>
          </div>

          <p className="text-muted-foreground leading-relaxed">
            {t("mission_text")}
          </p>
        </Card>

        {/* FEATURES */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="h-6 w-6 text-primary" />
            <h3 className="text-xl font-semibold">{t("features")}</h3>
          </div>

          <ul className="space-y-3">
            {[1, 2, 3, 4].map((n) => (
              <li key={n} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                <span>{t(`feature_${n}`)}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* CONTACT */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <HelpCircle className="h-6 w-6 text-primary" />
            <h3 className="text-xl font-semibold">{t("contact_us")}</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">{t("contact_phone")}</p>
                <a 
                  href="tel:9444220441" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  9444220441
                </a>
              </div>
            </div>

            <Separator />

            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">{t("contact_email")}</p>
                <a 
                  href="mailto:sudhavalli.ommurali@gmail.com" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors break-all"
                >
                  sudhavalli.ommurali@gmail.com
                </a>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default About;
