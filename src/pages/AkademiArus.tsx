// src/pages/AkademiArus.tsx
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import axios from "axios";


type Modul = {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
};




const modulList: Modul[] = [
  {
    id: "m1",
    title: "Dasar‑Dasar Arus Kas: Memahami Uang Masuk & Keluar",
    description:
      "Modul Dasar-Dasar Arus Kas ini akan menjadi pintu gerbang Anda untuk memahami denyut nadi finansial setiap bisnis. Anda akan diajak menyelami esensi uang masuk—mulai dari penerimaan penjualan produk atau jasa Anda, pelunasan piutang dari pelanggan, hingga suntikan modal baru—serta mengidentifikasi dan mencatat setiap uang keluar, yang mencakup semua pengeluaran operasional. Ini termasuk pembayaran gaji karyawan, biaya pembelian bahan baku atau stok barang, sewa tempat usaha, tagihan utilitas, hingga cicilan pinjaman yang perlu dilunasi. Dengan menguasai konsep dasar ini, Anda tidak hanya sekadar mencatat angka, tetapi juga mulai bisa membaca cerita di balik setiap transaksi, melihat bagaimana uang Anda bergerak dan berdampak pada likuiditas bisnis secara real-time. Pemahaman yang kuat tentang arus kas bukan hanya sekadar teori, melainkan fondasi vital untuk mengambil keputusan bisnis yang lebih cerdas dan proaktif. Anda akan belajar bagaimana mengelola siklus uang agar bisnis tidak kehabisan napas di tengah jalan, memastikan selalu ada dana yang cukup untuk operasional harian dan peluang pertumbuhan. Modul ini akan memberdayakan Anda dengan pengetahuan praktis untuk menjaga kesehatan finansial, memprediksi kebutuhan kas di masa depan, dan pada akhirnya, membangun kepercayaan diri yang tinggi dalam mengelola keuangan usaha Anda. Ini adalah langkah pertama menuju bisnis yang lebih stabil, berkelanjutan, dan siap berkembang",
    youtubeUrl: "https://www.youtube.com/embed/21-ZZ-iatkQ",
  },
  {
    id: "m2",
    title: "Strategi Penetapan Harga: Cara Menghitung Margin Laba",
    description:
      "Modul Strategi Penetapan Harga akan membekali Anda dengan pengetahuan krusial tentang bagaimana menentukan harga jual produk atau layanan yang tidak hanya menarik bagi pelanggan, tetapi juga menguntungkan bagi bisnis Anda. Anda akan diajari langkah demi langkah cara mengidentifikasi semua komponen biaya, baik itu biaya langsung untuk memproduksi satu unit barang, maupun biaya tidak langsung seperti sewa, gaji karyawan, dan pemasaran. Pemahaman mendalam tentang struktur biaya ini adalah kunci untuk kemudian menghitung margin laba Anda dengan akurat. Margin laba menunjukkan seberapa besar persentase keuntungan yang Anda dapatkan dari setiap penjualan setelah dikurangi semua biaya, sebuah indikator vital untuk kesehatan finansial bisnis. Lebih dari sekadar angka, modul ini akan membantu Anda memahami bahwa penetapan harga adalah sebuah seni sekaligus sains. Anda akan menjelajahi berbagai strategi penetapan harga, seperti cost-plus pricing, value-based pricing, atau competitive pricing, dan belajar kapan harus menerapkan masing-masing strategi tersebut sesuai dengan kondisi pasar dan tujuan bisnis Anda. Dengan menguasai cara menghitung dan mengoptimalkan margin laba, Anda akan dapat membuat keputusan harga yang strategis, memastikan bisnis Anda tidak hanya bertahan, tetapi juga berkembang dan mencapai profitabilitas maksimal di tengah persaingan pasar yang dinamis.",
    youtubeUrl: "https://www.youtube.com/embed/nzItju22Mkk",
  },
  {
    id: "m3",
    title: "Persiapan Pinjaman: 3 Hal yang Dilihat oleh Lender",
    description:
      "Modul Persiapan Pinjaman ini akan membongkar rahasia di balik meja para pemberi pinjaman, mengungkap tiga aspek krusial yang selalu mereka perhatikan saat mengevaluasi permohonan pinjaman Anda. Pertama dan terpenting adalah kapasitas pembayaran Anda. Pemberi pinjaman ingin melihat bukti kuat bahwa bisnis Anda memiliki arus kas yang stabil dan cukup untuk melunasi cicilan tepat waktu. Ini berarti mereka akan meninjau laporan keuangan Anda, seperti laporan laba rugi dan arus kas, untuk memastikan ada pendapatan yang konsisten dan pengeluaran yang terkendali, sehingga Anda tidak akan kesulitan memenuhi kewajiban finansial. Mereka ingin melihat bahwa bisnis Anda sehat secara finansial dan mampu menghasilkan keuntungan yang memadai untuk menutupi pinjaman. Aspek kedua yang sangat diperhatikan adalah jaminan atau agunan yang bisa Anda berikan. Meskipun tidak semua pinjaman memerlukan agunan fisik, bagi banyak jenis pinjaman, aset yang dapat diagunkan—seperti properti, kendaraan, atau inventaris—memberikan rasa aman tambahan bagi pemberi pinjaman. Ini berfungsi sebagai jaring pengaman jika terjadi kegagalan pembayaran. Terakhir, mereka akan menilai karakter dan rekam jejak kredit Anda. Ini mencakup riwayat pinjaman Anda sebelumnya, kepatuhan dalam pembayaran utang, dan bahkan bagaimana Anda mengelola keuangan pribadi. Pemberi pinjaman ingin berbisnis dengan individu atau entitas yang memiliki reputasi baik dalam hal tanggung jawab finansial. Memahami dan mempersiapkan ketiga hal ini dengan matang akan sangat meningkatkan peluang Anda untuk mendapatkan persetujuan pinjaman dan membuka akses ke modal yang dibutuhkan bisnis Anda untuk berkembang.",
    youtubeUrl: "https://www.youtube.com/embed/fuiiJuB7tJs",
  },
];

const AkademiArus: React.FC = () => {
  const [completed, setCompleted] = useState<string[]>([]);

  const toggleComplete = (id: string) => {
    setCompleted((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const [full_name, setfull_name] = useState<string>("");
const token = localStorage.getItem("access_token");

useEffect(() => {
  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/user/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setfull_name(response.data.full_name); // Misalnya field-nya adalah "full_name"
    } catch (error) {
      console.error("Gagal mengambil data user:", error);
    }
  };

  fetchUserData();
}, []);


  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 w-64 h-screen bg-white border-r shadow z-50">
        <Sidebar />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 min-h-screen flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white z-40 border-b shadow">
          <Header name={full_name} />
        </div>

        {/* Page Content */}
        <main className="p-8 space-y-12">
          <div>
            <h1 className="text-4xl font-bold mb-2">📚 Akademi Arus</h1>
            <p className="text-gray-600 max-w-2xl">
              Belajar finansial dan manajemen keuangan dengan video singkat dan penjelasan yang mudah dipahami.
            </p>
          </div>

          {/* Modul List */}
          {modulList.map((mod) => {
            const done = completed.includes(mod.id);
            return (
              <div
                key={mod.id}
                className="bg-white rounded-2xl shadow-md p-6 flex flex-col lg:flex-row gap-6"
              >
                {/* Video */}
                <div className="w-full lg:w-1/2">
                  <div className="aspect-video rounded-lg overflow-hidden shadow">
                    <iframe
                      src={mod.youtubeUrl}
                      title={mod.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    ></iframe>
                  </div>
                </div>

                {/* Info */}
                <div className="w-full lg:w-1/2 flex flex-col justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-blue-700">{mod.title}</h2>
                    <p className="text-gray-600 mt-2 text-base">{mod.description}</p>
                  </div>
                  <button
                    onClick={() => toggleComplete(mod.id)}
                    className={`mt-4 w-max px-4 py-2 rounded-full text-sm font-medium transition ${
                      done
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    }`}
                  >
                    {done ? "✓ Sudah Ditonton" : "Tandai Sudah Ditonton"}
                  </button>
                </div>
              </div>
            );
          })}

          {/* Progress */}
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <h3 className="text-xl font-semibold">Progress Belajar Kamu</h3>
            <progress
              value={completed.length}
              max={modulList.length}
              className="w-full h-4 mt-4 rounded-full overflow-hidden [&::-webkit-progress-bar]:bg-gray-200 [&::-webkit-progress-value]:bg-blue-500"
            />
            <p className="text-gray-600 mt-2 text-sm">
              {completed.length} dari {modulList.length} modul selesai
            </p>
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center text-gray-400 py-6 text-sm mt-10 border-t">
          © {new Date().getFullYear()} Akademi Arus. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default AkademiArus;
