import Navbar from "../components/landing/Navbar";
import About from "../components/landing/About";
import Skills from "../components/landing/Skills";
import Contact from "../components/landing/Contact";
import Footer from "../components/landing/Footer";
import Project from "@/components/landing/Project";
import FloatingToggle from "@/components/landing/FloatingToggle";
import Profile from "../components/landing/Profile";
import WorkExperience from "../components/landing/WorkExperience";
import LandingLayout from "./landing-layout";
import { getProfile } from "@/modules/landing/profile/profile.service";
import { getAbout } from "@/modules/landing/about/about.service";
import { getSkills } from "@/modules/landing/skills/skill.service";
import { getWorkExperiences } from "@/modules/landing/work-experience/work-experience.service";
import { getProjects } from "@/modules/landing/project/project.service";
import { getSocialMedia } from "@/modules/landing/social-media/social-media.service";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [profile, about, skills, workExperience, projects, socialMedia] =
    await Promise.all([
      getProfile(),
      getAbout(),
      getSkills(1, 10),
      getWorkExperiences(),
      getProjects(),
      getSocialMedia(),
    ]);

  return (
    <LandingLayout>
      <main className="min-h-screen bg-gradient-to-b bg-pastel-green">
        <Navbar />
        <section id="home" className="scroll-mt-16">
          <Profile data={profile} />
        </section>

        <section id="about" className="scroll-mt-16">
          <About data={about} />
        </section>

        <section id="skills" className="scroll-mt-16 bg-pastel-green/20">
          <Skills data={skills.data} />
        </section>

        <section
          id="work-experience"
          className="scroll-mt-16 bg-pastel-green/20"
        >
          <WorkExperience data={workExperience} />
        </section>

        <section id="projects" className="scroll-mt-16 bg-pastel-green/20">
          <Project data={projects} />
        </section>

        <section id="contact" className="scroll-mt-16">
          <Contact data={socialMedia.items} />
        </section>

        <Footer />
        <FloatingToggle />
      </main>
    </LandingLayout>
  );
}
