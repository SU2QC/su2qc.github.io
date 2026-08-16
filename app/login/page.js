import { LoginForm } from "../../components/login-form";
import { SectionIntro } from "../../components/section-intro";
export const metadata = { title: "Sign in" };
export default function Login() { return <section className="auth-wrap shell"><div className="auth-card"><SectionIntro title="Sign in to SU2QC" as="h1" className="page-intro">Use your institutional email and password. Authentication alone does not grant upload access; an administrator must approve your member record.</SectionIntro><LoginForm/></div></section>; }
