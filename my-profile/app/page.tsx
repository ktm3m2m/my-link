export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-mono selection:bg-pink-400 selection:text-black">
      {/* Header */}
      <header className="p-6 border-b-4 border-black dark:border-white flex justify-between items-center bg-yellow-400 dark:bg-zinc-800 text-black dark:text-white">
        <div className="font-black text-2xl tracking-tighter uppercase">Ktm3m</div>
        <nav className="hidden md:flex gap-6 font-bold uppercase">
          <a href="#about" className="hover:underline decoration-4 underline-offset-4">About</a>
          <a href="#projects" className="hover:underline decoration-4 underline-offset-4">Projects</a>
          <a href="#contact" className="hover:underline decoration-4 underline-offset-4">Contact</a>
        </nav>
        <button className="neo-box bg-cyan-400 text-black px-4 py-2 font-bold uppercase hidden md:block border-black">
          Resume
        </button>
      </header>

      <main className="flex flex-col w-full">
        {/* Hero Section */}
        <section className="px-6 py-24 md:py-32 flex flex-col items-center justify-center border-b-4 border-black dark:border-white bg-pink-400 text-black overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiMwMDAiIG9wYWNpdHk9IjAuMSIvPjwvc3ZnPg==')] opacity-50 mix-blend-multiply"></div>
          
          <div className="relative z-10 text-center flex flex-col items-center">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter neo-text-shadow mb-6 text-white">
              NAM YUNTAE
            </h1>
            <div className="bg-yellow-400 neo-box border-black px-6 py-3 mb-10 transform -rotate-2">
              <h2 className="text-xl md:text-3xl font-bold uppercase tracking-widest text-black">
                Frontend Developer
              </h2>
            </div>
            <p className="text-lg md:text-xl font-bold max-w-2xl bg-white neo-box border-black p-6 text-black">
              I build beautiful, responsive, and user-centric web applications. Passionate about modern web technologies and design aesthetics.
            </p>
          </div>
        </section>

        {/* Marquee Section */}
        <div className="w-full overflow-hidden border-b-4 border-black dark:border-white bg-lime-400 text-black py-4 flex whitespace-nowrap items-center">
          <div className="animate-marquee flex gap-8 font-black text-2xl uppercase tracking-widest min-w-full">
            <span>React</span><span>•</span>
            <span>Next.js</span><span>•</span>
            <span>TypeScript</span><span>•</span>
            <span>TailwindCSS</span><span>•</span>
            <span>Neobrutalism</span><span>•</span>
            <span>React</span><span>•</span>
            <span>Next.js</span><span>•</span>
            <span>TypeScript</span><span>•</span>
            <span>TailwindCSS</span><span>•</span>
            <span>Neobrutalism</span>
          </div>
        </div>

        {/* Projects Section */}
        <section id="projects" className="p-6 md:p-12 lg:p-24 border-b-4 border-black dark:border-white bg-cyan-400 dark:bg-zinc-900">
          <h2 className="text-4xl md:text-6xl font-black uppercase mb-12 text-white neo-text-shadow">
            Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white dark:bg-black text-black dark:text-white neo-box flex flex-col h-full border-black dark:border-white p-0">
                <div className="h-48 bg-yellow-400 border-b-4 border-black dark:border-white flex items-center justify-center">
                  <span className="font-black text-3xl opacity-50 text-black">IMAGE</span>
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-2xl font-black mb-3 uppercase">Project Title {item}</h3>
                  <p className="font-bold mb-6 flex-grow">A short description of the awesome project and the technologies used to build it.</p>
                  <a href="#" className="bg-pink-400 text-black text-center font-bold uppercase py-3 neo-box mt-auto block border-black">
                    View Project
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="p-6 md:p-12 lg:p-24 bg-yellow-400 dark:bg-zinc-800 text-black dark:text-white flex flex-col md:flex-row gap-12 items-center justify-between">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-6xl font-black uppercase mb-6">Let's Talk</h2>
            <p className="text-xl font-bold mb-8">Ready to start your next big project? Drop me a line and let's make it happen.</p>
          </div>
          <div className="flex flex-col gap-4 w-full md:w-auto">
            <a href="mailto:hello@example.com" className="bg-white dark:bg-black text-black dark:text-white neo-box px-8 py-4 font-black uppercase text-xl text-center border-black dark:border-white">
              Email Me
            </a>
            <a href="https://github.com/ktm3m" target="_blank" rel="noreferrer" className="bg-cyan-400 text-black neo-box px-8 py-4 font-black uppercase text-xl text-center border-black">
              GitHub
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-black dark:border-white p-6 bg-white dark:bg-black text-center font-bold uppercase">
        © {new Date().getFullYear()} Nam Yuntae. Built with Next.js & Tailwind.
      </footer>
    </div>
  );
}
