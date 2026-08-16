import { ArrowRight } from "lucide-react";
import { SectionIntro } from "../../components/section-intro";

const pillars = [
  ["Physics formulation", "Represent gauge and matter degrees of freedom while enforcing local SU(2) gauge symmetry and Gauss's law."],
  ["Encoding and circuits", "Develop compact, symmetry-aware encodings and low-depth real-time evolution circuits suited to constrained hardware."],
  ["AI-assisted optimization", "Use learning-based approaches for mapping, synthesis, compilation, error mitigation, and observable reconstruction."],
  ["Scientific observables", "Study Wilson loops, string tension, flux-tube profiles, string breaking, and particle-production signatures."],
];

export const metadata = { title: "Research" };
export default function Research() { return <>
  <section className="page-hero shell"><SectionIntro title="From gauge symmetry to executable circuits." as="h1" className="page-intro">The program integrates theory, machine learning, and quantum computing to make real-time non-Abelian dynamics increasingly tractable.</SectionIntro></section>
  <section className="section shell"><div className="pillar-list">{pillars.map(([t,d])=><article key={t}><SectionIntro title={t}>{d}</SectionIntro><ArrowRight className="pillar-arrow" size={20}/></article>)}</div></section>
  <section className="section ink"><div className="shell research-note"><SectionIntro title="A reusable scientific workflow, not a single demonstration.">The collaboration is building toward scalable quantum-classical methods that translate physics problems into optimized, verifiable quantum computations.</SectionIntro></div></section>
  </> }
