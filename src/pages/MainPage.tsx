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
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
  Title,
} from "chart.js";
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Legend, Tooltip, Title);


const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
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
        setUser(response.data);
      } catch (error) {
        navigate("/login");
      }
    };

    fetchUserData();
    fetchSummary();
    fetchChartData();
  }, [token, navigate]);

  useEffect(() => {
  if (token) {
    fetchChartData();
  }
}, [startDate, endDate, resolution]);


  return (

      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="ml-64 flex-1 flex flex-col"> {/* Tambah ml-64 */}
          <Header name={user?.name || "Pengguna"} />
          {/* Tombol tambah transaksi */}
          <div className="flex justify-end gap-4 px-6 mt-4">
            <button
              onClick={() => openTransactionModal('pemasukan')}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Tambah Pemasukan
            </button>
            <button
              onClick={() => openTransactionModal('pengeluaran')}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
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
            {/* Skor Kesehatan Dinamis */}
              {(() => {
              const income = summaryData?.income || 0;
              const expense = summaryData?.expense || 0;
              const margin = summaryData?.margin ?? 0;

              let score = 0;
              let color = "text-red-600";

              if (income === 0) {
                score = 0;
                color = "text-red-600";
              } else if (margin > 20) {
                score = 90;
                color = "text-green-600";
              } else if (margin >= 10) {
                score = 70;
                color = "text-yellow-600";
              } else if (margin >= 1) {
                score = 45;
                color = "text-amber-500";
              } else if (margin === 0) {
                score = 20;
                color = "text-orange-600";
              } else {
                score = 0;
                color = "text-red-700";
              }

              return (
                <div className="bg-white p-4 rounded-lg shadow text-center">
                  <h3 className="text-lg font-semibold mb-2">Skor Kesehatan Dinamis</h3>
                  <div className={`text-5xl font-bold ${color}`}>
                    {score}
                  </div>
                </div>
              );
            })()}


          </div>
          <div className="bg-white p-6 rounded-lg shadow">
  <h2 className="text-xl font-bold mb-4">Grafik Pemasukan vs Pengeluaran</h2>

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
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: `Grafik Transaksi (${resolution})`,
        },
      },
    }}
  />
</div>


          {/* Grafik Analisis */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Grafik Analisa Aplikasi Kredit</h2>
              <ChartCreditAnalysis data={summaryData?.chart_data || []} />
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Komposisi Nasabah</h2>
              <CustomerPieChart data={Array.isArray(summaryData?.customer_composition) ? summaryData.customer_composition : []} />
            </div>
          </div>

          {/* Aktivitas Terbaru dan Pengajuan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RecentActivities activities={summaryData?.recent_activities || []} />
            <CreditApplicationTable applications={summaryData?.latest_applications || []} />
          </div>
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
        </main>
      </div>
    </div>
  );
};

export default MainPage;