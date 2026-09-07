import { VaultList } from "../../components/vault-list";
import { SectionIntro } from "../../components/section-intro";

export const metadata = { title: "Vault", robots: { index: false, follow: false } };

export default function Vault() {
  return <>
    <section className="page-hero shell"><SectionIntro title="The member Vault." as="h1" className="page-intro">Working materials for approved SU2QC members. The static page contains no private content; authorized metadata loads only after session and membership checks.</SectionIntro></section>
    <section className="section shell"><VaultList /></section>
  </>;
}
