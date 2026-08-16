import { LibraryList } from "../../components/library-list";
import { SectionIntro } from "../../components/section-intro";

export const metadata = { title: "Library" };

export default function Library() {
  return <>
    <section className="page-hero shell"><SectionIntro title="Talks, slides, and working materials." as="h1" className="page-intro">Browse public materials shared by members of the SU2QC collaboration.</SectionIntro></section>
    <section className="section shell"><LibraryList /></section>
  </>;
}
