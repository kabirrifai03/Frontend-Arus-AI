import React, { useState, useEffect, useRef, FC, ReactNode } from "react";
import { FaBars, FaTimes } from "react-icons/fa"; // Ikon untuk menu mobile

// --- Data & Tipe ---

interface Feature {
  id: number;
  title: string;
  imageUrl: string;
  url: string;
}


const featureList: Feature[] = [
  {
    id: 1,
    title: "Dasbor Kesehatan Bisnis",
    imageUrl: "https://i.imgur.com/JQBiaWv.jpeg",
    url: "#",
  },
  {
    id: 2,
    title: "Skor Kredit Dinamis",
    imageUrl: "https://i.imgur.com/Jo7mrhe.jpeg",
    url: "#",
  },
  {
    id: 3,
    title: "Prediksi Arus Kas",
    imageUrl: "https://i.imgur.com/PHb1JBf.jpeg",
    url: "#",
  },
  {
    id: 4,
    title: "Laporan Laba Rugi Otomatis",
    imageUrl: "https://i.imgur.com/wSUpTDY.jpeg",
    url: "#",
  },
  {
    id: 5,
    title: "Akademi Arus",
    imageUrl: "https://i.imgur.com/dGv3FUD.jpeg",
    url: "#",
  },
  {
    id: 6,
    title: "Integrasi WhatsApp Bot (Opsional)",
    imageUrl: "https://i.imgur.com/nW2BCJu.jpeg",
    url: "#",
  },
];

const slides = [
  {
    title: "UMKM Bergerak",
    description:
      "Warung Madura, pedagang kecil, dan pelaku usaha mikro kini bisa berkembang lewat pinjaman modal mudah.",
    imageUrl:
      "https://i.imgur.com/InpljTG.jpeg",
  },
  {
    title: "Keyakinan Tanpa Keraguan",
    description:
      "Loan officer kini tak perlu menebak atau menyelidiki—dengan sistem cerdas Arus AI, keputusan pendanaan jadi lebih cepat, adil, dan efisien.",
    imageUrl:
      "https://i.imgur.com/Vjh5wv1.jpeg",
  },
  {
    title: "Ekonomi Merata",
    description:
      "Bersatunya Arus AI, Bank Indonesia, dan OJK memperkuat ekosistem keuangan inklusif demi pertumbuhan ekonomi Indonesia menuju 2045.",
    imageUrl:
      "https://i.imgur.com/8aTpTrM.jpeg",
  },
];

// --- Komponen-Komponen Kecil ---

// Custom Hook untuk deteksi elemen di layar (untuk animasi fade-in)
const useOnScreen = (ref: React.RefObject<HTMLElement>, rootMargin = "0px") => {
  const [isIntersecting, setIntersecting] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIntersecting(entry.isIntersecting),
      { rootMargin }
    );
    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [ref, rootMargin]);
  return isIntersecting;
};

// Wrapper Animasi
const AnimatedSection: FC<{ children: ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const onScreen = useOnScreen(ref as any, "-100px");
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        onScreen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } ${className}`}
    >
      {children}
    </div>
  );
};

// --- Komponen Utama ---
const BerandaPage: React.FC = () => {
  const [sliderIndex, setSliderIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSliderIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { href: "/register", text: "REGISTER" },
    { href: "/login", text: "LOGIN" },
  ];

  return (
    <div className="bg-white text-gray-800 font-sans">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 h-20 shadow-sm">
        <nav className="container mx-auto px-6 flex justify-between items-center h-full">
          <a href="/" className="flex-shrink-0">
            <img
              src="https://i.imgur.com/l82Pfyy.png"
              alt="Arus AI Logo"
              className="h-10"
            />
          </a>
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-blue-800 font-bold hover:text-yellow-500 transition-colors"
              >
                {link.text}
              </a>
            ))}
          </div>
          <div className="lg:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-blue-800 text-2xl"
            >
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </nav>
      </header>
      <div
        className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
          menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setMenuOpen(false)}
        ></div>

        {/* Menu Panel */}
        <div
          className={`absolute top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-5 flex justify-end">
            <button
              onClick={() => setMenuOpen(false)}
              className="text-blue-800 text-3xl"
            >
              <FaTimes />
            </button>
          </div>
          <div className="flex flex-col space-y-4 px-5">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-blue-800 font-bold hover:text-yellow-500 transition-colors py-2"
              >
                {link.text}
              </a>
            ))}
          </div>
        </div>
      </div>

      <main>
        {/* Carousel Section */}
        <section className="relative w-full h-screen">
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <img
            src={slides[sliderIndex].imageUrl}
            alt="Carousel"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center z-20 p-4">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 text-shadow-lg">
              {slides[sliderIndex].title}
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl text-shadow">
              {slides[sliderIndex].description}
            </p>
          </div>
        </section>

        <div className="container mx-auto px-6 py-16 md:py-24 space-y-24">
          {/* Intro Section */}
          <AnimatedSection>
            <div className="bg-blue-50/50 rounded-xl shadow-lg p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-blue-800 mb-6 uppercase tracking-wider">
                Arus AI
              </h2>
              <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
                Arus AI adalah platform cerdas yang memberdayakan pelaku UMKM melalui pemantauan kesehatan bisnis secara real-time dan sistem penilaian kelayakan pinjaman berbasis data. Kami menyediakan fitur Dasbor Kesehatan Bisnis, Skor Kredit Dinamis, Prediksi Arus Kas, dan Akademi UMKM untuk membantu pertumbuhan usaha mikro dengan cepat, mudah, dan terpercaya, serta menjembatani koneksi antara UMKM, pemberi pinjaman, dan regulator seperti BI & OJK
              </p>
            </div>
          </AnimatedSection>

          {/* Latar Belakang Section */}
          <AnimatedSection>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <img
                src="https://i.imgur.com/XNvOX6r.png"
                alt="Satelit Illustration"
                className="w-full max-w-md mx-auto rounded-lg"
              />
              <div className="text-gray-700 leading-relaxed">
                <h2 className="text-3xl md:text-4xl font-bold text-blue-800 mb-6 uppercase tracking-wider">
                  Latar Belakang
                </h2>
                <p className="mb-4">
                  UMKM merupakan tulang punggung ekonomi Indonesia, namun banyak di antaranya kesulitan mendapatkan akses pendanaan karena minimnya data keuangan yang jelas dan sistem penilaian kredit yang kompleks. Hal ini menyebabkan kesenjangan pembiayaan yang menghambat pertumbuhan usaha mikro di berbagai daerah.
                </p>
                <p>
                  Arus.AI hadir sebagai solusi berbasis teknologi untuk menjawab tantangan tersebut. Dengan menggabungkan data transaksi harian dan kecerdasan buatan, Arus.AI menyediakan sistem pemantauan bisnis real-time dan penilaian kredit dinamis, guna mendukung pembiayaan yang adil, efisien, dan berkelanjutan bagi UMKM.
                </p>
              </div>
            </div>
          </AnimatedSection>

          {/* Features Section */}
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-blue-800 mb-12 text-center uppercase tracking-wider">
              Fitur Utama
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
              {featureList.map((feature) => (
                <div
                  key={feature.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-2 transition-transform duration-300"
                >
                  <img
                    src={feature.imageUrl}
                    alt={feature.title}
                    className="w-full h-48 object-cover"
                  />
                  <h3 className="p-4 font-bold text-center text-blue-800">
                    {feature.title}
                  </h3>
                </div>
              ))}
            </div>
          </AnimatedSection>


          {/* Kontak Section */}
<AnimatedSection>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left text-gray-800">
    {/* Kolom 1 */}
    <div className="space-y-2">
      <h3 className="text-4xl font-semibold text-blue-900">Kami siap terhubung</h3>
    </div>

    {/* Kolom 2 */}
    <div className="space-y-2 text-sm">
      <p>
        <span className="font-semibold">E</span> &nbsp;
        <a href="mailto:achmad@example.com" className="text-blue-600 hover:underline">
          achmad@example.com
        </a>
      </p>
      <p>
        <span className="font-semibold">T</span> &nbsp; +62 812-1956-9889
      </p>
      <p>
        <span className="font-semibold">T</span> &nbsp; +62 858-1074-6193
      </p>
      <p className="text-gray-500 mt-1">Senin–Jumat (09:00–17:00)</p>
    </div>

    {/* Kolom 3 */}
    <div className="space-y-2 text-sm text-gray-600">
      <h4 className="font-semibold text-blue-900">Alamat Kantor</h4>
      <p>
        Jl. Kina No. 23 Blok 5A, RT01/RW04, <br />
        Kel. Pasir Kaliki, Kec. Cicendo, <br />
        Kota Bandung 40171
      </p>
    </div>
  </div>
</AnimatedSection>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-blue-900 text-white text-center p-6 mt-16">
        <p>
          © 2025 Website Arus AI | Hak Cipta Dilindungi
        </p>
      </footer>

      {/* CSS untuk efek text-shadow */}
      {/* <style jsx global>{`
        .text-shadow { text-shadow: 1px 1px 8px rgba(0,0,0,0.5); }
        .text-shadow-lg { text-shadow: 2px 2px 12px rgba(0,0,0,0.6); }
      `}</style> */}
    </div>
  );
};

export default BerandaPage;
