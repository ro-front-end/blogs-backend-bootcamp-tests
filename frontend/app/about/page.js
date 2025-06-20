"use client";

import { FaLaptopCode, FaGithub, FaBookOpen } from "react-icons/fa";

export default function AboutPage() {
  return (
    <main className="min-h-screen px-4 py-12 bg-slate-950 text-cyan-200 flex flex-col items-center">
      <section className="max-w-3xl text-center space-y-6">
        <h1 className="text-4xl font-bold text-cyan-400">About This Project</h1>

        <p className="text-lg leading-relaxed text-slate-300">
          This blog platform was built with a fullstack JavaScript stack to
          provide a smooth and modern experience for writers and readers.
        </p>

        <div className="grid md:grid-cols-3 gap-6 text-left mt-10">
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-700 shadow-lg hover:shadow-cyan-600/30 transition duration-300">
            <FaLaptopCode className="text-cyan-400 text-3xl mb-4" />
            <h3 className="font-semibold text-cyan-300">Frontend</h3>
            <p className="text-sm text-slate-400 mt-2">
              Built with <strong>Next.js</strong>, <strong>Tailwind CSS</strong>
              , <strong>Redux Toolkit</strong>, <strong>Redux Thunk</strong>,
              and <strong>Axios</strong> for responsive UI, clean state
              management, and smooth backend communication.
            </p>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-700 shadow-lg hover:shadow-cyan-600/30 transition duration-300">
            <FaBookOpen className="text-cyan-400 text-3xl mb-4" />
            <h3 className="font-semibold text-cyan-300">Backend</h3>
            <p className="text-sm text-slate-400 mt-2">
              Powered by <strong>Express</strong>, <strong>Mongoose</strong>,{" "}
              <strong>JWT</strong>, and <strong>Multer</strong> for secure,
              RESTful APIs, image uploads, and seamless integration with{" "}
              <strong>MongoDB</strong>.
            </p>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-700 shadow-lg hover:shadow-cyan-600/30 transition duration-300">
            <FaGithub className="text-cyan-400 text-3xl mb-4" />
            <h3 className="font-semibold text-cyan-300">Open Source</h3>
            <p className="text-sm text-slate-400 mt-2">
              This project is part of my portfolio. Feel free to check the code,
              suggest improvements, or get in touch!
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
