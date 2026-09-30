import { AccessScreen } from "@/components/AccessScreen/AccessScreen";
import { IdentityRecord } from "@/components/IdentityRecord/IdentityRecord";
import { InstalledModules } from "@/components/InstalledModules/InstalledModules";
import { Operations } from "@/components/Operations/Operations";
import { SiteHeader } from "@/components/SiteHeader/SiteHeader";
import { SkipLink } from "@/components/SkipLink/SkipLink";
import { Transmission } from "@/components/Transmission/Transmission";

export default function Page() {
  return (
    <>
      <SkipLink />
      {/* La séquence d'accès est superposée au contenu, jamais un préalable à
          son rendu : le document complet est déjà dans le DOM en dessous. */}
      <AccessScreen />
      <SiteHeader />
      <main id="contenu" tabIndex={-1}>
        <IdentityRecord />
        <Operations />
        <InstalledModules />
        <Transmission />
      </main>
    </>
  );
}
