// src/pages/ProfileNasabah.tsx
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import axios from "axios";

import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { UploadIcon, SaveIcon } from "lucide-react";


const ProfileNasabah: React.FC = () => {
  const [formData, setFormData] = useState({
    namaLengkap: "",
    email: "",
    noTelepon: "",
    npwp: "",
    alamat: "",
    fotoProfil: "",
    business_description: "", // tambahkan ini
});


  

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);


  const validateForm = () => {
    let newErrors: { [key: string]: string } = {};
    if (!formData.namaLengkap.trim()) {
      newErrors.namaLengkap = "Nama Lengkap tidak boleh kosong.";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email tidak boleh kosong.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format email tidak valid.";
    }
    if (!formData.noTelepon.trim()) {
      newErrors.noTelepon = "Nomor Telepon tidak boleh kosong.";
    } else if (!/^\d+$/.test(formData.noTelepon)) {
      newErrors.noTelepon = "Nomor Telepon harus angka.";
    }
    // NPWP bisa kosong, alamat bisa kosong sesuai default
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    // Hapus error saat input berubah
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    if (name === "fotoProfil" && files?.[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, fotoProfil: reader.result as string }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSuccessMessage(null);
  setErrorMessage(null);

  if (!validateForm()) {
    setErrorMessage("Mohon lengkapi semua data dengan benar.");
    return;
  }

  setIsLoading(true);

  try {
    const response = await axios.put(
      `${process.env.REACT_APP_API_URL}/user/profile/update`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    if (response.status === 200) {
      setSuccessMessage("Profil berhasil diperbarui!");
    } else {
      setErrorMessage("Gagal menyimpan perubahan.");
    }
  } catch (error: any) {
    console.error("Gagal menyimpan profil:", error);
    setErrorMessage("Terjadi kesalahan saat menyimpan profil.");
  } finally {
    setIsLoading(false);
  }
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

      const user = response.data;
      setfull_name(user.full_name);

      setFormData({
        namaLengkap: user.full_name || "",
        email: user.email || "",
        noTelepon: user.phone_number || "",
        npwp: user.npwp_number || "",
        alamat: user.address || "",
        fotoProfil: user.photo_url || "",
        business_description:user.business_description || "",
      });

    } catch (error) {
      console.error("Gagal mengambil data user:", error);
    }
  };

  fetchUserData();
  }, []);


  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-64 min-h-screen flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white z-40 border-b shadow">
          <Header name={full_name} />
        </div>

          <main className="bg-white p-6 rounded-lg shadow border">
  <h1 className="text-3xl font-bold text-gray-800 mb-6">Profil Nasabah</h1>

  {successMessage && (
    <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded mb-4">
      {successMessage}
    </div>
  )}
  {errorMessage && (
    <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded mb-4">
      {errorMessage}
    </div>
  )}

  <div className="bg-white shadow-lg rounded-2xl p-8 flex flex-col md:flex-row gap-10">
    {/* KIRI - Foto Profil */}
<div className="flex flex-col items-center w-full md:w-1/3 gap-4">
  <div className="relative w-40 h-40 rounded-full overflow-hidden shadow-lg border-4 border-indigo-500 bg-gray-100 flex items-center justify-center">
    {formData.fotoProfil ? (
      <img
        src={formData.fotoProfil}
        alt="Foto Profil"
        className="object-cover w-full h-full"
      />
    ) : (
      <img
        src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
        alt="Default Avatar"
        className="w-40 h-40 opacity-60"
      />
    )}
  </div>

  <label
    htmlFor="fotoProfil"
    className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium shadow hover:bg-indigo-700 transition-all"
  >
    <UploadIcon className="w-4 h-4" />
    Unggah Foto Baru
  </label>
  <Input
    type="file"
    name="fotoProfil"
    id="fotoProfil"
    accept="image/*"
    onChange={handleChange}
    className="hidden"
  />
</div>

    {/* KANAN - Data Profil */}
    <form
      onSubmit={handleSubmit}
      className="space-y-6 w-full md:w-2/3"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="namaLengkap">Nama Lengkap</Label>
          <Input
            type="text"
            name="namaLengkap"
            id="namaLengkap"
            value={formData.namaLengkap}
            onChange={handleChange}
          />
          {errors.namaLengkap && (
            <p className="text-red-500 text-sm mt-1">{errors.namaLengkap}</p>
          )}
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>
        <div>
          <Label htmlFor="noTelepon">No. Telepon</Label>
          <Input
            type="text"
            name="noTelepon"
            id="noTelepon"
            value={formData.noTelepon}
            onChange={handleChange}
          />
          {errors.noTelepon && (
            <p className="text-red-500 text-sm mt-1">
              {errors.noTelepon}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="npwp">NPWP</Label>
          <Input
            type="text"
            name="npwp"
            id="npwp"
            placeholder="Opsional"
            value={formData.npwp}
            onChange={handleChange}
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="alamat">Alamat</Label>
          <Input
            type="text"
            name="alamat"
            id="alamat"
            value={formData.alamat}
            onChange={handleChange}
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="business_description">Deskripsi Bisnis</Label>
          <Input
            type="text"
            name="business_description"
            id="business_description"
            value={formData.business_description}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Tombol Simpan */}
      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg shadow"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"
                />
              </svg>
              Menyimpan...
            </span>
          ) : (
            <>
              <SaveIcon className="w-4 h-4 mr-2" />
              Simpan Perubahan
            </>
          )}
        </Button>
      </div>
    </form>
  </div>
</main>


      </div>
    </div>
  );
};

export default ProfileNasabah;