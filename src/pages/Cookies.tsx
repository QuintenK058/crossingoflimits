import { useI18n } from "@/i18n";
import { cookies } from "@/content/legal";
import { LegalPage } from "@/components/sections/LegalPage";


export default function Cookies() {
  const { t } = useI18n();
  return (
    <LegalPage
      routeKey="cookies"
      doc={cookies}
      title={t.meta.cookies.title.split(" | ")[0]}
      description={t.meta.cookies.description}
      
    />
  );
}
