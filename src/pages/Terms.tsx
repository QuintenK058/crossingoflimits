import { useI18n } from "@/i18n";
import { terms } from "@/content/legal";
import { LegalPage } from "@/components/sections/LegalPage";


export default function Terms() {
  const { t } = useI18n();
  return (
    <LegalPage
      routeKey="terms"
      doc={terms}
      title={t.meta.terms.title.split(" | ")[0]}
      description={t.meta.terms.description}
      
    />
  );
}
