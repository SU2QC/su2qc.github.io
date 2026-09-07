import { ExternalLink } from "lucide-react";
import Image from "next/image";
import { people } from "../../data/people";
import { SectionIntro } from "../../components/section-intro";

export const metadata = { title: "People" };
export default function People() { return <>
  <section className="page-hero shell"><SectionIntro title="A cross-institution team." as="h1" className="page-intro">Nuclear theory, lattice gauge theory, quantum algorithms, and high-performance computing.</SectionIntro></section>
  <section className="section shell"><div className="people-grid">{people.map(p=><article className="person-card" id={p.slug} key={p.slug}>{p.image ? <Image className="person-image" src={p.image} alt={p.imageAlt} width={200} height={300} sizes="(max-width: 560px) 80px, 120px"/> : <div className="person-image monogram large" aria-label={p.imageAlt}>{p.initials}</div>}<div><span className="person-type">{p.role}</span><SectionIntro title={p.name} as="h2" className="profile-intro">{p.title}<br/>{p.institution}</SectionIntro><p>{p.bio}</p><div className="tags">{p.interests.map(i=><span key={i}>{i}</span>)}</div><div className="profile-links">{(p.profiles || [{label:"Official profile", href:p.profile}]).filter(profile => profile?.href).map(profile => <a key={profile.href} href={profile.href} target="_blank" rel="noreferrer">{profile.label} <ExternalLink size={14}/></a>)}</div></div></article>)}</div>
  <div className="future-team"><span>Researchers and collaborators</span><p>SU2QC brings together principal investigators, postdoctoral researchers, and graduate students across institutions.</p></div></section>
  </> }
