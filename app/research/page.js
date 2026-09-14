import { ArrowRight } from "lucide-react";
import { SectionIntro } from "../../components/section-intro";

const pillars = [
  ["Real-time non-Abelian dynamics", "We study how color fields and matter evolve away from equilibrium. Real-time questions are complementary to the Euclidean observables that underpin much of lattice QCD, and they motivate controlled quantum and classical calculations."],
  ["Confinement and flux", "Flux tubes, screening, string breaking, and matter production provide concrete diagnostics of non-Abelian dynamics. We use them as scientific questions, not as claims of an already-complete quantum advantage."],
  ["SU(2) as a testbed", "Finite and lower-dimensional SU(2) systems make gauge symmetry, spectra, scaling, and dynamics testable at high resolution. They are deliberately controlled benchmarks—not substitutes for SU(3) QCD in 3+1 dimensions."],
  ["Quantum algorithms and hardware", "Gauge constraints, finite representations, state preparation, time evolution, measurement, noise, and verification must be treated together. Small systems can be compared against trusted classical calculations before larger studies are attempted."],
  ["AI and hybrid computing", "Machine learning and classical high-performance computing can support circuit compilation, resource estimation, inference, error mitigation, and cross-validation. Any improvement must remain measurable and physically interpretable."],
];

export const metadata = { title: "Research" };
export default function Research() { return <>
  <section className="page-hero shell"><SectionIntro title="From gauge symmetry to executable circuits." as="h1" className="page-intro">SU2QC develops and tests quantum-classical tools for real-time non-Abelian gauge dynamics, with SU(2) lattice gauge theory as a controlled setting for connecting field theory, computation, and experiment.</SectionIntro></section>
  <section className="section shell"><div className="pillar-list">{pillars.map(([t,d])=><article key={t}><SectionIntro title={t}>{d}</SectionIntro><ArrowRight className="pillar-arrow" size={20}/></article>)}</div></section>
  <section className="section ink"><div className="shell research-note"><SectionIntro title="A reusable scientific workflow, not a single demonstration.">Progress is measured by agreement with analytic limits, exact diagonalization, tensor-network or HPC calculations, and carefully characterized device data. The collaboration builds on public work in lattice-QCD structure and algorithms, gauge-field digitization and qubitization, many-body dynamics, symmetry-aware methods, error mitigation, and scientific machine learning.</SectionIntro></div></section>
  <section className="section shell research-sources"><SectionIntro title="Selected foundations"><p><a href="https://arxiv.org/abs/1906.11213">Gluon Field Digitization for Quantum Computers</a>; <a href="https://arxiv.org/abs/2209.00098">Qubitization Strategies for Bosonic Field Theories</a>; <a href="https://arxiv.org/abs/2308.05253">Fuzzy Gauge Theory for Quantum Computers</a>; <a href="https://arxiv.org/abs/2509.08868">Real-Time String Dynamics in a 2+1D Non-Abelian Lattice Gauge Theory</a>.</p></SectionIntro></section>
  </> }
