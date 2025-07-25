import React, { useState } from "react";
import Modal from "./Modal";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import * as XLSX from "xlsx"; // ✅ Tambahkan ini
import toast, { Toaster } from "react-hot-toast";


interface InputTransaksiModalProps {
  type: "pemasukan" | "pengeluaran";
  onClose: () => void;
  onSuccess?: () => void;
}

const InputTransaksiModal: React.FC<InputTransaksiModalProps> = ({ type, onClose, onSuccess }) => {
  const [inputMethod, setInputMethod] = useState<"manual" | "excel" | null>(null);
  const [items, setItems] = useState([{ description: "", amount: 0 }]);
  const [date, setDate] = useState("");
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [fromExcel, setFromExcel] = useState(false);







  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setExcelFile(file);
    handleReadExcel(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"] },
  });
const handleReadExcel = async (file: File) => {
  const loadingToast = toast.loading("📥 Memproses file Excel...");

  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const bstr = e.target?.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];

      const data: any[][] = XLSX.utils.sheet_to_json(ws, {
        header: 1,
        range: 1, // ⬅️ mulai dari baris kedua (abaikan header)
      });

      const importedItems = data
        .map((row, idx) => {
          const description = String(row[0] || "").trim();
          const amountRaw = row[1];
          const amount =
            typeof amountRaw === "number"
              ? amountRaw
              : parseFloat(String(amountRaw).replace(/[^0-9.]/g, "")) || 0;

          const dateRaw = row[2];
          let formattedDate = "";

          if (typeof dateRaw === "string") {
            // Jika format string "21/07/2025" atau "2025-07-21"
            if (dateRaw.includes("/")) {
              const parts = dateRaw.split("/");
              if (parts.length === 3) {
                const day = parts[0].padStart(2, "0");
                const month = parts[1].padStart(2, "0");
                const year = parts[2].length === 2 ? `20${parts[2]}` : parts[2];
                formattedDate = `${year}-${month}-${day}`;
              }
            } else if (dateRaw.includes("-")) {
              formattedDate = dateRaw;
            }
          } else if (typeof dateRaw === "number") {
            // Jika Excel date serial number
            const excelDate = new Date((dateRaw - 25569) * 86400 * 1000);
            formattedDate = excelDate.toISOString().split("T")[0];
          }

          if (!description || !amount || !formattedDate) {
            console.warn(`❌ Baris tidak valid:`, { description, amount, dateRaw, formattedDate });
            return null;
          }

          return { description, amount, date: formattedDate };
        })
        .filter((item) => item !== null);

      if (importedItems.length === 0) {
        toast.error("❌ Tidak ada data valid di Excel.", { id: loadingToast });
        return;
      }

      setItems(importedItems as { description: string; amount: number; date: string }[]);
      setFromExcel(true);
      setInputMethod("excel");
      toast.success("✅ File Excel berhasil dibaca!", { id: loadingToast });
    } catch (error) {
      toast.error("❌ Gagal membaca file Excel.", { id: loadingToast });
      console.error(error);
    }
  };

  reader.readAsBinaryString(file);
};





  const handleItemChange = (index: number, field: "description" | "amount", value: any) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: field === "amount" ? parseFloat(value) : value,
    };
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { description: "", amount: 0 }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("access_token");

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/transactions/add`,
        fromExcel
            ? { type, items } // <- dari Excel, date per-item
            : { type, items, date }, // <- input manual
        { headers: { Authorization: `Bearer ${token}` } }
        );
      setSuccessMessage("✅ Transaksi berhasil disimpan");
      if (onSuccess) onSuccess();
      setTimeout(() => {
        setLoading(false);
        onClose();
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.error("Gagal menyimpan transaksi", err);
      alert("❌ Gagal menyimpan transaksi");
      setLoading(false);
    }
  };

  return (
    <Modal visible={true} onClose={onClose}>
      <div className="p-6 w-full max-w-xl bg-white rounded-lg relative">
        <h2 className="text-xl font-bold text-center mb-4">Input {type}</h2>

        {!inputMethod && (
          <div className="flex justify-center gap-4 py-4">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded"
              onClick={() => setInputMethod("manual")}
            >
              Input Manual
            </button>
            <button
              className="px-4 py-2 bg-green-600 text-white rounded"
              onClick={() => setInputMethod("excel")}
            >
              Import Excel
            </button>
          </div>
        )}

        {inputMethod === "excel" && (
          <div className="space-y-4">
            <div
              {...getRootProps()}
              className={`p-6 border-2 border-dashed rounded text-center cursor-pointer ${
                isDragActive ? "bg-blue-50 border-blue-500" : "border-gray-300"
              }`}
            >
              <input {...getInputProps()} />
              <p className="text-gray-600">
                {excelFile ? excelFile.name : "Seret dan lepas file Excel di sini, atau klik untuk memilih"}
              </p>
            </div>
            
            {excelFile && (
              <div className="text-center">
                <button
                  onClick={() => {
                    setExcelFile(null);
                    setItems([{ description: "", amount: 0 }]);
                  }}
                  className="text-red-600 text-sm hover:underline"
                >
                  Hapus File
                </button>
              </div>
            )}
          </div>
        )}

        {(inputMethod === "manual" || fromExcel) && (
        <form onSubmit={handleSubmit} className="space-y-4">
            {!fromExcel && (
            <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Tanggal</label>
                <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                />
            </div>
            )}

            {items.map((item, i) => (
            <div key={i} className="flex gap-2 items-center">
                <input
                type="text"
                value={item.description}
                onChange={(e) => handleItemChange(i, "description", e.target.value)}
                placeholder="Deskripsi"
                className="flex-1 px-3 py-2 border rounded"
                required
                disabled={fromExcel} // ✅ Biar tidak bisa diubah jika dari Excel
                />
                <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">Rp</span>
                <input
                    type="number"
                    value={item.amount}
                    onChange={(e) => handleItemChange(i, "amount", e.target.value)}
                    placeholder="Harga"
                    className="w-40 pl-10 pr-2 py-2 border rounded"
                    required
                    disabled={fromExcel}
                />
                </div>
            </div>
            ))}

            <div className="flex justify-between pt-2">
            {!fromExcel && (
                <button type="button" onClick={addItem} className="text-blue-600 hover:underline">
                + Tambah Item
                </button>
            )}
            <div className="flex gap-2">
                <button onClick={onClose} type="button" className="px-4 py-2 bg-gray-300 rounded">
                Batal
                </button>
                <button
                type="submit"
                className={`px-4 py-2 text-white rounded ${loading ? "bg-gray-400" : "bg-blue-600"}`}
                disabled={loading}
                >
                {loading ? "Menyimpan..." : "Simpan"}
                </button>
            </div>
            </div>

            {successMessage && (
            <p className="text-green-600 text-sm text-center mt-2">{successMessage}</p>
            )}
        </form>
        )}

      </div>
    </Modal>
  );
};

export default InputTransaksiModal;
