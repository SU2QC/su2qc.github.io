import { LoginForm } from "../../components/login-form";
import { SectionIntro } from "../../components/section-intro";
export const metadata = { title: "Sign in", robots: { index: false, follow: false } };
export default function Login() { return <section className="auth-wrap shell"><div className="auth-card"><SectionIntro title="Sign in to SU2QC" as="h1" className="page-intro">Approved members sign in with a six-digit code sent to their email. Authentication alone does not grant access; an administrator must approve the member record.</SectionIntro><LoginForm/></div></section>; }
