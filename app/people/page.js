import { ExternalLink } from "lucide-react";
import Image from "next/image";
import { people } from "../../data/people";
import { SectionIntro } from "../../components/section-intro";

export const metadata = { title: "People" };
export default function People() { return <>
  <section className="page-hero shell"><SectionIntro title="A cross-institution team." as="h1" className="page-intro">Nuclear theory, lattice gauge theory, quantum algorithms, and high-performance computing.</SectionIntro></section>
  <section className="section shell"><div className="people-grid">{people.map(p=><article className="person-card" id={p.slug} key={p.slug}><Image className="person-image" src={p.image} alt={p.imageAlt} width={200} height={300} sizes="(max-width: 560px) 80px, 120px"/><div><span className="person-type">{p.role}</span><SectionIntro title={p.name} as="h2" className="profile-intro">{p.title}<br/>{p.institution}</SectionIntro><p>{p.bio}</p><div className="tags">{p.interests.map(i=><span key={i}>{i}</span>)}</div><a href={p.profile} target="_blank" rel="noreferrer">Official profile <ExternalLink size={14}/></a></div></article>)}</div>
  <div className="future-team"><span>Graduate students and postdoctoral researchers</span><p>Additional team members will be added after appointments are publicly confirmed.</p></div></section>
  </> }
