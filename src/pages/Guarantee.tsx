import { useI18n } from "@/i18n";
import { guarantee } from "@/content/legal";
import { LegalPage } from "@/components/sections/LegalPage";
import { StoLogo } from "@/components/layout/StoBadge";

export default function Guarantee() {
  const { t } = useI18n();
  return (
    <LegalPage
      routeKey="guarantee"
      doc={guarantee}
      title={t.meta.guarantee.title.split(" | ")[0]}
      description={t.meta.guarantee.description}
      aside={<span className="block w-24 rounded-lg bg-sand p-2"><StoLogo size={192} /></span>}
    />
  );
}
