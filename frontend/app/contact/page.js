"use client";

import { FaEnvelope, FaLinkedin, FaGlobe, FaGithub } from "react-icons/fa";

export default function ContactPage() {
  return (
    <main className="min-h-screen px-4 py-12 bg-slate-950 text-cyan-200 flex flex-col items-center">
      <section className="max-w-3xl text-center space-y-6">
        <h1 className="text-4xl font-bold text-cyan-400">Get in Touch</h1>
        <p className="text-lg text-slate-300">
          Feel free to reach out if you have questions, want to collaborate, or
          just want to connect.
        </p>

        <div className="mt-10 grid md:grid-cols-2 gap-6 text-left">
          <a
            href="mailto:newmearound@outlook.com"
            className="flex items-center gap-4 bg-slate-900 hover:bg-slate-800 transition p-4 rounded-xl border border-slate-700 shadow-md"
          >
            <FaEnvelope className="text-cyan-400 text-2xl" />
            <span className="text-slate-300">newmearound@outlook.com</span>
          </a>

          <a
            href="https://www.linkedin.com/in/rodrigo-arellano-ganem/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 bg-slate-900 hover:bg-slate-800 transition p-4 rounded-xl border border-slate-700 shadow-md"
          >
            <FaLinkedin className="text-cyan-400 text-2xl" />
            <span className="text-slate-300">LinkedIn Profile</span>
          </a>

          <a
            href="https://portfolio-front-end-rodrigo.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 bg-slate-900 hover:bg-slate-800 transition p-4 rounded-xl border border-slate-700 shadow-md"
          >
            <FaGlobe className="text-cyan-400 text-2xl" />
            <span className="text-slate-300">My Portfolio</span>
          </a>

          <a
            href="https://github.com/ro-front-end"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 bg-slate-900 hover:bg-slate-800 transition p-4 rounded-xl border border-slate-700 shadow-md"
          >
            <FaGithub className="text-cyan-400 text-2xl" />
            <span className="text-slate-300">GitHub</span>
          </a>
        </div>
      </section>
    </main>
  );
}
