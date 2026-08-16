import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Atom, CircuitBoard, Network, Sparkles } from "lucide-react";
import { people } from "../data/people";
import { SectionIntro } from "../components/section-intro";

const themes = [
  { icon: Atom, label: "Gauge dynamics", text: "Real-time non-Abelian dynamics, from confinement and flux tubes to string breaking." },
  { icon: CircuitBoard, label: "Quantum hardware", text: "Symmetry-preserving encodings and hardware-aware circuits for emerging quantum systems." },
  { icon: Sparkles, label: "AI acceleration", text: "Learning-assisted compilation, circuit optimization, measurement, and error mitigation." },
  { icon: Network, label: "Hybrid computing", text: "Quantum, GPU, tensor-network, and high-performance workflows designed to work together." },
];

export default function Home() {
  return <>
    <section className="hero shell">
      <div className="hero-grid">
        <div>
          <SectionIntro title="Building a path to real-time gauge dynamics." as="h1" className="page-intro">SU2QC is a multi-institution research collaboration developing AI-accelerated methods to study non-Abelian lattice gauge theories on quantum hardware.</SectionIntro>
          <div className="actions">
            <Link className="button primary" href="/research">Explore the research <ArrowRight size={17}/></Link>
            <Link className="button quiet" href="/library">View research library</Link>
          </div>
        </div>
        <div className="hero-art">
          <Image src="/images/su2qc-hero.png" alt="Illustration of oriented SU(2) lattice links, a plaquette evolution circuit, and a Gauss-law check." width={1254} height={1254} sizes="(max-width: 850px) 100vw, 42vw" priority />
        </div>
      </div>
    </section>

    <section className="section shell">
      <SectionIntro title="Physics-first. Hardware-aware.">We connect field-theory structure to practical execution, preserving physical constraints while reducing the cost of simulation.</SectionIntro>
      <div className="theme-grid">{themes.map(({icon: Icon, label, text}) => <article className="theme-card" key={label}><Icon/><h3>{label}</h3><p>{text}</p></article>)}</div>
    </section>

    <section className="section soft"><div className="shell">
      <div className="section-heading-row"><SectionIntro title="One team across physics and computing."/><Link href="/people" className="text-link">Meet the full team <ArrowRight size={16}/></Link></div>
      <div className="people-preview">{people.filter(p => p.featured).map(p => <article key={p.slug} className="person-mini"><Image className="person-mini-image" src={p.image} alt={p.imageAlt} width={200} height={300} sizes="56px"/><div><h3>{p.name}</h3><p className="role">{p.role} · {p.institutionShort}</p><p>{p.shortBio}</p><Link href={`/people#${p.slug}`}>Profile</Link></div></article>)}</div>
    </div></section>
  </>;
}
