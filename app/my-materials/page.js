import { ManageMaterials } from "../../components/manage-materials";
import { SectionIntro } from "../../components/section-intro";

export const metadata = { title: "My materials", robots: { index: false, follow: false } };

export default function MyMaterials() {
  return <>
    <section className="page-hero shell"><SectionIntro title="Manage materials." as="h1" className="page-intro">Edit your metadata, replace files, change visibility, archive, restore, or delete. Admins can manage all member materials.</SectionIntro></section>
    <section className="section shell"><ManageMaterials /></section>
  </>;
}
