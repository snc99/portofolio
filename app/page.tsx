import Navbar from "../components/landing/Navbar";
import About from "../components/landing/About";
import Skills from "../components/landing/Skills";
import Contact from "../components/landing/Contact";
import Footer from "../components/landing/Footer";
import Project from "@/components/landing/Project";
import FloatingToggle from "@/components/landing/FloatingToggle";
import Profile from "../components/landing/Profile";
import WorkExperience from "../components/landing/WorkExperience";

import { getHomeData } from "@/modules/landing/landing.service";
import LandingLayout from "./landing-layout";

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await getHomeData();

  return (
    <LandingLayout>
      <main className="min-h-screen bg-gradient-to-b bg-pastel-green">
        <Navbar />

        <section id="home" className="scroll-mt-16">
          <Profile data={data.profile} />
        </section>

        <section id="about" className="scroll-mt-16">
          <About data={data.about} />
        </section>

        <section id="skills" className="scroll-mt-16 bg-pastel-green/20">
          <Skills data={data.skills} />
        </section>

        <section id="work" className="scroll-mt-16">
          <WorkExperience data={data.workExperience} />
        </section>

        <section id="projects" className="scroll-mt-16 bg-pastel-green/20">
          <Project data={data.projects} />
        </section>

        <section id="contact" className="scroll-mt-16">
          <Contact data={data.socialMedia} />
        </section>

        <Footer />

        <FloatingToggle />
      </main>
    </LandingLayout>
  );
}
