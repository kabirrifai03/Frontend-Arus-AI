import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import DashboardCard from "../components/DashboardCard";
import ChartCreditAnalysis from "../components/ChartCreditAnalysis";
import CustomerPieChart from "../components/CustomerPieChart";
import RecentActivities from "../components/RecentActivities";
import CreditApplicationTable from "../components/CreditApplicationTable";
import InputTransaksiModal from "../components/InputTransaksi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCallback } from "react";
import { Line } from "react-chartjs-2";
import { Pie } from "react-chartjs-2";
import ScanReceiptModal from "../components/ScanReceiptModal";
import { ChartOptions, TooltipItem } from "chart.js"; // Tambahkan ini jika belum
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
  Title,
  ArcElement,  // 👈 ini penting
} from "chart.js";
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Legend, Tooltip, Title, ArcElement);





const AIBusinessConsultation: React.FC = () => {
  const [businessDetails, setBusinessDetails] = useState<string>("");
  const [analysisSummary, setAnalysisSummary] = useState<string | null>(null);
  const [strategicAdvice, setStrategicAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("access_token");

  const fetchAIAdvice = async () => {
    setLoading(true);
    setError(null); // Reset error
    setAnalysisSummary(null); // Reset previous advice
    setStrategicAdvice(null);

    if (!businessDetails.trim()) {
      setError("Mohon masukkan detail bisnis Anda terlebih dahulu.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/dashboard/predict`, // Menggunakan endpoint yang sama
        { business_details: businessDetails },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAnalysisSummary(response.data.analysis_summary);
      setStrategicAdvice(response.data.strategic_advice);
    } catch (err: any) {
      console.error("Gagal mendapatkan saran AI:", err);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Terjadi kesalahan saat mendapatkan saran AI. Coba lagi nanti.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Efek untuk mengambil pesan awal (GET request) saat komponen pertama kali dimuat
  useEffect(() => {
    const fetchInitialMessage = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/dashboard/predict`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // Kita hanya mengambil pesan awal dari GET request
        setStrategicAdvice(response.data.ai_advice || response.data.message);
      } catch (err: any) {
        console.error("Gagal mengambil pesan awal AI:", err);
        if (err.response && err.response.data && err.response.data.error) {
          setError(err.response.data.error);
        } else {
          setError("Gagal memuat pesan awal konsultasi.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchInitialMessage();
  }, [token]);


  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Konsultasi Bisnis AI</h2>
      <div className="mb-4">
        <label htmlFor="businessDetails" className="block text-gray-700 text-sm font-bold mb-2">
          Ceritakan tentang bisnis Anda (jenis, omzet, sumber dana, tantangan, dll.):
        </label>
        <textarea
          id="businessDetails"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32 resize-y"
          placeholder="Contoh: Bisnis saya toko kelontong, omzet rata-rata Rp 50jt/bulan, modal dari tabungan. Tantangan utama stok cepat habis..."
          value={businessDetails}
          onChange={(e) => setBusinessDetails(e.target.value)}
        ></textarea>
        {error && <p className="text-red-500 text-xs italic mt-2">{error}</p>}
      </div>
      <button
        onClick={fetchAIAdvice}
        disabled={loading}
        className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-2 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {loading ? 'Menganalisis...' : 'Dapatkan Saran AI'}
      </button>

      {(analysisSummary || strategicAdvice) && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          {analysisSummary && (
            <>
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Analisis Bisnis:</h3>
              <p className="text-gray-800 mb-4 whitespace-pre-wrap">{analysisSummary}</p>
            </>
          )}
          {strategicAdvice && (
            <>
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Saran Strategis:</h3>
              <p className="text-gray-800 whitespace-pre-wrap">{strategicAdvice}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};


const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const [full_name, setfull_name] = useState<string>(""); // Default "Pengguna"
  const [summaryData, setSummaryData] = useState<any>({});
  const token = localStorage.getItem("access_token");
  const [chartData, setChartData] = useState<any[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [resolution, setResolution] = useState("daily");



  const [transactionType, setTransactionType] = useState<"pemasukan" | "pengeluaran" | null>(null);


  const [showTransactionModal, setShowTransactionModal] = useState(false);

  const openTransactionModal = useCallback((type: "pemasukan" | "pengeluaran") => {
  setTransactionType(type);
  setShowTransactionModal(true);
  }, []);

type InputTransaksiModalProps = {
  type: "pemasukan" | "pengeluaran";
  onClose: () => void;
};


  
  const fetchChartData = async () => {
  try {
    const params = new URLSearchParams();
    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);
    if (resolution) params.append("resolution", resolution);

    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/transactions/chart?${params.toString()}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setChartData(response.data);
  } catch (err) {
    console.error("Gagal mengambil data chart transaksi", err);
  }
};

  
  const fetchSummary = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/dashboard/summary`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSummaryData(response.data);
    } catch (error) {
      console.error("Gagal mengambil data dashboard", error);
    }
  };

  const downloadReport = async () => {
  try {
    const params = new URLSearchParams();
    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);

    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/transactions/report?${params.toString()}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob", // penting!
      }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Laporan_Transaksi.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Gagal mengunduh laporan", error);
  }
};

const [healthScore, setHealthScore] = useState<number | null>(null);
const [healthScoreColor, setHealthScoreColor] = useState<string>("text-gray-500");
const [scoreDetails, setScoreDetails] = useState<any>(null);
const [showScoreModal, setShowScoreModal] = useState(false);



const fetchHealthScore = async () => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/scoring/health-score`,
      {
        bill_late_in_3m: false,
        bill_total_late: 0,
        bill_cv: 0.25,
        bill_ratio: 0.15,
        mobile_avg_topup: 120000,
        mobile_topup_cv: 0.3,
        mobile_number_age: 2,
        mobile_has_banking: true,
        mobile_has_gambling: false,
        tax_has_npwp: true,
        tax_provides_npwp: true,
        credit_has_failed: false,
        credit_active_loans: 1
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const score = response.data.final_health_score;
    setHealthScore(score);
    setScoreDetails(response.data.details);


    // Warna berdasar skor
    let color = "text-red-600";
    if (score >= 85) color = "text-green-600";
    else if (score >= 70) color = "text-yellow-500";
    else if (score >= 50) color = "text-amber-500";
    else if (score >= 30) color = "text-orange-600";
    else color = "text-red-700";

    setHealthScoreColor(color);

  } catch (error) {
    console.error("Gagal mengambil skor kesehatan", error);
    setHealthScore(null);
  }
};



  useEffect(() => {
    if (!token) {
      navigate("/login");
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/user/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setfull_name(response.data.full_name); 
      } catch (error) {
        navigate("/login");
      }
    };

    fetchUserData();
    fetchSummary();
    fetchChartData();
    fetchHealthScore();
  }, [token, navigate]);





const [metrics, setMetrics] = useState<any>(null);
const fetchMetrics = async () => {
  try {
    const params = new URLSearchParams();
    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);

    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/transactions/metrics?${params.toString()}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setMetrics(response.data);
  } catch (err) {
    console.error("Gagal mengambil data metrik", err);
  }
};


  useEffect(() => {
  if (token) {
    fetchChartData();
    fetchMetrics(); // <- tambahkan ini

  }
}, [startDate, endDate, resolution]);

type IncomeExpensePieChartProps = {
  income: number;
  expense: number;
};


const IncomeExpensePieChart: React.FC<IncomeExpensePieChartProps> = ({ income, expense }) => {
  const total = income + expense;

  if (total === 0) {
    return <p className="text-gray-500">Tidak ada data transaksi untuk rentang waktu ini.</p>;
  }

  const data = {
    labels: ["Pemasukan", "Pengeluaran"],
    datasets: [
      {
        data: [income, expense],
        backgroundColor: ["#22c55e", "#ef4444"],
        borderColor: ["#16a34a", "#dc2626"],
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<"pie"> = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context: TooltipItem<"pie">) {
            const value = context.raw as number;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: Rp ${(value ?? 0).toLocaleString('id-ID')} (${percentage}%)`;
          },
        },
      },
      legend: {
        position: "bottom", // ← valid union literal, sesuai yang diizinkan Chart.js
      },
    },
  };

  return (
  <div style={{ width: "100%", maxWidth: "410px", height: "410px", margin: "0 auto" }}>
    <Pie data={data} options={options} />
  </div>
  );
};

// AIIncomeForecast component
const AIIncomeForecast: React.FC = () => {
  const [predictionData, setPredictionData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchPrediction = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/dashboard/predict`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPredictionData(response.data);
      } catch (error) {
        console.error("Gagal mengambil data prediksi AI", error);
        setPredictionData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPrediction();
  }, [token]);

  if (loading) return <p className="text-gray-600">Memuat prediksi dari AI...</p>;
  if (!predictionData) return <p className="text-gray-600">Tidak ada prediksi yang tersedia atau terjadi kesalahan.</p>;

  // Ambil data dari respons AI
  const predicted_summary = predictionData.predicted_summary || "Tidak ada ringkasan prediksi.";
  // Pastikan nama variabel sesuai dengan yang dikirim dari backend (predicted_total_net_cashflow)
  const predicted_total_net_cashflow = predictionData.predicted_total_net_cashflow || 0;
  const ai_advice = predictionData.ai_advice || "Tidak ada saran AI.";

  const formattedTotalCashFlow = (predicted_total_net_cashflow ?? 0).toLocaleString('id-ID');

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Ringkasan Prediksi AI</h3>
        <p className="text-base text-gray-700 font-medium mb-2">{predicted_summary}</p>

        {/* Tampilkan total prediksi bersih dalam bentuk angka */}
        <p className="text-sm text-gray-600 mb-2">
          Diprediksi total arus kas bersih untuk 30 hari ke depan adalah:{" "}
          <strong className={`${predicted_total_net_cashflow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            Rp {formattedTotalCashFlow}
          </strong>
        </p>

        <h3 className="text-lg font-semibold mt-4">Saran Strategis dari AI</h3>
        <p className="text-sm text-gray-600 italic">{ai_advice}</p>
      </div>
    </div>
  );
};



  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Prediksi Arus Kas (Pemasukan vs Pengeluaran)',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += `Rp ${(context.parsed.y ?? 0).toLocaleString('id-ID')}`;
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Tanggal',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Jumlah (Rp)',
        },
        beginAtZero: true,
      },
    },
  };

  const [showScanModal, setShowScanModal] = useState(false);





  return (

      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="ml-64 flex-1 flex flex-col"> {/* Tambah ml-64 */}
          <Header name={full_name} /> 
          
          {/* Tombol tambah transaksi */}
          <div className="flex justify-end gap-4 px-6 mt-4">
            <button
            onClick={() => setShowScanModal(true)}
            className="bg-indigo-600 text-white px-8 py-2 rounded hover:bg-indigo-700"
          >
            Scan Gambar
          </button>
            <button
              onClick={() => openTransactionModal('pemasukan')}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Tambah Pemasukan
            </button>
            <button
              onClick={() => openTransactionModal('pengeluaran')}
              className="bg-red-600 text-white px-4 py-2 mr-4 rounded hover:bg-red-700"
            >
              Tambah Pengeluaran
            </button>

          </div>
          <main className="p-6 md:p-10 space-y-8">
          {/* Ringkasan Fitur */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardCard
              title="Aplikasi Terdeteksi Fraud"
              value={summaryData?.fraud_count}
              subtitle={`Dari ${summaryData?.total_applications} pengajuan`}
              highlight
            />
            <DashboardCard
              title="Total Aplikasi Kredit"
              value={summaryData?.total_applications}
              percentage={summaryData?.growth_percentage}
              upTrend
            />
            <div className="bg-white p-4 rounded-lg shadow text-center relative">
                <h3 className="text-lg font-semibold mb-2">Skor Kesehatan Bisnis</h3>
                <div className={`text-5xl font-bold ${healthScoreColor}`}>
                  {healthScore !== null ? healthScore : "Memuat..."}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Berdasarkan analisis keuangan dan perilaku
                </p>

                {scoreDetails && (
                <button
                  onClick={() => setShowScoreModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-2"
                >
                  Lihat Detail Skor
                </button>
              )}
              </div>
          </div>


<div className="space-y-6">
  {/* Bagian Atas: Line chart & Pie chart */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {/* Kiri: Grafik Line & Filter */}
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4 text-center">Grafik Line Pemasukan vs Pengeluaran</h2>

      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2 rounded"
        />
        <select
          value={resolution}
          onChange={(e) => setResolution(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="daily">Harian</option>
          <option value="weekly">Mingguan</option>
          <option value="monthly">Bulanan</option>
          <option value="yearly">Tahunan</option>
        </select>
        <button
          onClick={downloadReport}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Unduh Report
        </button>
      </div>

      {/* Grafik Line */}
      <Line
        data={{
          labels: chartData.map((item) => item.date),
          datasets: [
            {
              label: "Pemasukan",
              data: chartData.map((item) => item.income),
              borderColor: "rgb(34,197,94)",
              backgroundColor: "rgba(34,197,94,0.2)",
            },
            {
              label: "Pengeluaran",
              data: chartData.map((item) => item.expense),
              borderColor: "rgb(239,68,68)",
              backgroundColor: "rgba(239,68,68,0.2)",
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: { position: "top" },
            title: {
              display: true,
              text: `Grafik Transaksi (${resolution})`,
            },
          },
        }}
      />
    </div>

    {/* Kanan: Pie Chart */}
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-10 text-center">Komposisi Pemasukan vs Pengeluaran</h2>
      {metrics && (
        <IncomeExpensePieChart
          income={metrics.total_income}
          expense={metrics.total_expense}
        />
      )}
    </div>

  </div>

  {/* Bawah: Ringkasan Dinamis */}
  {metrics && (
    <div className="bg-white p-6 rounded-lg shadow border">
      <h3 className="text-lg  font-bold mb-10 text-center">Ringkasan Dinamis</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <p>📊 Total Pemasukan: <strong>Rp {(metrics.total_income ?? 0).toLocaleString('id-ID')}</strong></p>
          <p>📉 Total Pengeluaran: <strong>Rp {(metrics.total_expense ?? 0).toLocaleString('id-ID')}</strong></p>
          <p>🔁 Jumlah Transaksi: <strong>{metrics.transaction_count}</strong></p>
        </div>

        <div>
          <p>📆 Rata-rata per Hari:</p>
          <ul className="ml-4 list-disc">
            <li>💰 Pemasukan: <strong>Rp {(metrics.avg_income_per_day ?? 0).toLocaleString('id-ID')}</strong></li>
            <li>💸 Pengeluaran: <strong>Rp {(metrics.avg_expense_per_day ?? 0).toLocaleString('id-ID')}</strong></li>
          </ul>
        </div>

        <div>
          <p>📅 Rata-rata per Minggu:</p>
          <ul className="ml-4 list-disc">
            <li>💰 Pemasukan: <strong>Rp {(metrics.avg_income_per_week ?? 0).toLocaleString('id-ID')}</strong></li>
            <li>💸 Pengeluaran: <strong>Rp {(metrics.avg_expense_per_week ?? 0).toLocaleString('id-ID')}</strong></li>
         </ul>
        </div>
        <div>
          <p className="mt-2">🗓️ Rata-rata per Bulan:</p>
          <ul className="ml-4 list-disc">
            <li>💰 Pemasukan: <strong>Rp {(metrics.avg_income_per_month ?? 0).toLocaleString('id-ID')}</strong></li>
            <li>💸 Pengeluaran: <strong>Rp {(metrics.avg_expense_per_month ?? 0).toLocaleString('id-ID')}</strong></li>
           </ul>
        </div>
      </div>
    </div>
  )}
{metrics && (
  <div className="bg-white p-6 rounded-lg shadow border">
    <h3 className="text-lg font-bold mb-4 text-center">Laporan Laba Rugi</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">

      <div>
        <p>📈 <strong>Pendapatan (Revenue):</strong></p>
        <p>Rp {(metrics.revenue ?? 0).toLocaleString()}</p>
      </div>

      <div>
        <p>📉 <strong>Beban / Pengeluaran (Expense):</strong></p>
        <p>Rp {(metrics.expense ?? 0).toLocaleString()}</p>
      </div>

      <div>
        <p>🧾 <strong>Pajak (PPh Badan):</strong></p>
        <p>Rp {(metrics.tax ?? 0).toLocaleString()}</p>
        <p className="text-gray-500 text-xs italic">{metrics.tax_note ?? "-"}</p>
      </div>

      <div>
        <p>💵 <strong>Laba Bersih (Net Income):</strong></p>
        <p className="font-bold text-green-700">Rp {(metrics.net_income ?? 0).toLocaleString()}</p>
      </div>

      <div>
        <p>📊 <strong>Omzet Disetahunkan:</strong></p>
        <p>Rp {(metrics.annualized_omzet ?? 0).toLocaleString()}</p>
      </div>

      <div>
        <p>⏳ <strong>Durasi Periode:</strong></p>
        <p>
            {metrics.duration_days ?? 0} hari ({metrics.is_less_than_year ? "Kurang dari 1 tahun" : ">= 1 tahun"})
        </p>
      </div>

    </div>
  </div>
)}

</div>


{/* Modul Prediksi Income Statement */}
{/* Modul Konsultasi Bisnis AI */}
<div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
   <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
     <AIBusinessConsultation /> {/* Menggunakan komponen baru */}
   </div>
 </div>



          {showScoreModal && scoreDetails && (
          <div className="fixed inset-0 h-screen bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
              <button
                onClick={() => setShowScoreModal(false)}
                className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-lg"
              >
                &times;
              </button>
              <h2 className="text-xl font-bold mb-4 text-center">Detail Skor Kesehatan</h2>

              <div className="space-y-4 text-sm text-gray-800">
                {/* Kontribusi P&L */}
                {scoreDetails?.pnl_dna_breakdown && (
                  <div>
                    <div className="font-semibold mb-1">Kontribusi P&L:</div>
                    <ul className="pl-4 list-disc">
                      {Object.entries(scoreDetails.pnl_dna_breakdown).map(([key, value]) => (
                        <li key={key}>
                          {`${key.replaceAll("_", " ")}: ${value}`}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Kontribusi ICS */}
                {scoreDetails?.ics_breakdown && (
                  <div>
                    <div className="font-semibold mb-1">Kontribusi ICS:</div>
                    <ul className="pl-4 list-disc">
                      {Object.entries(scoreDetails.ics_breakdown).map(([key, value]) => (
                        <li key={key}>
                          {`${key.replaceAll("_", " ")}: ${value}`}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}


              

                {/* Total Skor */}
                <div>
                  <div className="font-semibold mb-1">Total Kontribusi:</div>
                  <p>
                    P&L: {scoreDetails?.pnl_score_contribution} | ICS: {scoreDetails?.ics_score_contribution}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

          {showTransactionModal && transactionType && (
            <InputTransaksiModal
              type={transactionType}
              onClose={() => setShowTransactionModal(false)}
              onSuccess={() => {
                fetchSummary();
                fetchChartData();
              }}
            />
          )}

          {showScanModal && (
          <ScanReceiptModal
            onClose={() => setShowScanModal(false)}
            onSuccess={() => {
              // Optional: fetch ulang summary atau chart
              fetchSummary();
              fetchChartData();
            }}
          />
        )}


          

        </main>
      </div>
    </div>
  );
};

export default MainPage;