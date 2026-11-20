import { useI18n } from "@/i18n";
import { privacy } from "@/content/legal";
import { LegalPage } from "@/components/sections/LegalPage";


export default function Privacy() {
  const { t } = useI18n();
  return (
    <LegalPage
      routeKey="privacy"
      doc={privacy}
      title={t.meta.privacy.title.split(" | ")[0]}
      description={t.meta.privacy.description}
      
    />
  );
}
