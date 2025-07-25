// components/ScanReceiptModal.tsx

import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Modal from "./Modal";

interface Props {
  onClose: () => void;
  onSuccess?: () => void;
}

const ScanReceiptModal: React.FC<Props> = ({ onClose, onSuccess }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("access_token");

  const handleUpload = async () => {
    if (!imageFile) return toast.error("Silakan pilih gambar terlebih dahulu.");
    setLoading(true);

    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/ocr/process-receipt`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(response.data.message || "Transaksi berhasil diproses.");
      if (onSuccess) onSuccess();
      onClose();
      window.location.reload(); // ⬅️ reload data terbaru
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Gagal memproses gambar.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

    return (
    <Modal visible={true} onClose={onClose}>
        <div className="flex items-center justify-center ">
        <div className="p-6 w-full max-w-sm bg-white rounded-lg relative text-center shadow-md">
            <h2 className="text-xl font-bold mb-4">Scan Gambar Transaksi</h2>

            <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="mb-4 w-full"
            />

            <button
            onClick={handleUpload}
            disabled={loading || !imageFile}
            className={`w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition ${
                loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            >
            {loading ? "Memproses..." : "Kirim ke AI"}
            </button>
        </div>
        </div>
    </Modal>
    );

};

export default ScanReceiptModal;
