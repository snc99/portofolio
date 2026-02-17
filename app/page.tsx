// app/page.tsx
import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import About from "../components/landing/About";
import Skills from "../components/landing/Skills";
import WorkHistory from "../components/landing/WorkExperience";
import Contact from "../components/landing/Contact";
import Footer from "../components/landing/Footer";
import Project from "@/components/landing/Project";
import FloatingToggle from "@/components/landing/FloatingToggle";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b bg-pastel-green">
      <Navbar />

      <section id="home" className="scroll-mt-16">
        <Hero />
      </section>

      <section id="about" className="scroll-mt-16">
        <About />
      </section>

      <section id="skills" className="scroll-mt-16 bg-pastel-green/20">
        <Skills />
      </section>

      <section id="work" className="scroll-mt-16">
        <WorkHistory />
      </section>

      <section id="projects" className="scroll-mt-16 bg-pastel-green/20">
        <Project />
      </section>

      <section id="contact" className="scroll-mt-16">
        <Contact />
      </section>

      <Footer />

      <FloatingToggle />
    </main>
  );
}
