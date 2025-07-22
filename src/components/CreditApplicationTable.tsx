import React from "react";

interface CreditApplication {
  id: number;
  borrower: string;
  amount: number;
  status: "Menunggu" | "Disetujui" | "Ditolak";
  date: string;
}

interface CreditApplicationTableProps {
  applications: CreditApplication[];
}

const CreditApplicationTable: React.FC<CreditApplicationTableProps> = ({ applications }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full h-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Pengajuan Kredit Terbaru
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-600">
          <thead className="text-xs uppercase bg-gray-100 text-gray-700">
            <tr>
              <th scope="col" className="px-4 py-3">Nama UMKM</th>
              <th scope="col" className="px-4 py-3">Jumlah</th>
              <th scope="col" className="px-4 py-3">Status</th>
              <th scope="col" className="px-4 py-3">Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-4 text-center text-gray-400">
                  Belum ada pengajuan.
                </td>
              </tr>
            ) : (
              applications.map((app) => (
                <tr key={app.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{app.borrower}</td>
                  <td className="px-4 py-3">Rp{app.amount.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        app.status === "Disetujui"
                          ? "bg-green-100 text-green-700"
                          : app.status === "Ditolak"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{app.date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CreditApplicationTable;
