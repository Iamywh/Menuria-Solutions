function Footer({ t }) {
  return (
    <footer className="mt-20">
      {/* Banda La Casita */}
      <div className="bg-[#5a3518] px-6 py-5 text-center text-white">
        <p className="text-sm font-semibold">
          La Casita del Nazareno
        </p>

        <a
          href="https://www.instagram.com/lacasitasc_/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-2 text-sm text-white/90 hover:text-white"
        >
          <span>📸</span>
          <span>Síguenos en Instagram</span>
        </a>
      </div>

      {/* Banda Menuria */}
      <div className="bg-black px-6 py-6 text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-3">
            <img
              src="/assets/img/logo.jpg"
              alt="Menuria logo"
              className="h-10 w-10 rounded-full object-cover"
            />

            <div className="text-center md:text-left">
              <p className="text-sm text-white/70">Powered by</p>
              <p className="font-bold tracking-wide">Menuria</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/85">
            <a
              href="https://menuria-solutions.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              🌐 Website
            </a>

            <a
              href="https://www.instagram.com/menuriasolutionssl/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              📸 Instagram
            </a>

            <a
              href="mailto:menuriasolutions@gmail.com"
              className="hover:text-white"
            >
              ✉️ menuriasolutions@gmail.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

