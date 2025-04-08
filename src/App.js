import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://fwlfdkdklpnvdkiqatzl.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3bGZka2RrbHBudmRraXFhdHpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxMjM5MTYsImV4cCI6MjA1OTY5OTkxNn0.V2epbdBMBkbo3acH_aqI3wI02wxUqhrP02189PFYgbk";
const supabase = createClient(supabaseUrl, supabaseKey);

const PASSWORD = "1234";

export default function App() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [files, setFiles] = useState([]);

  // URL'den şifre kontrolü
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code === PASSWORD) {
      setIsAuthorized(true);
    }
  }, []);

  // Dosya listesini yükle
  useEffect(() => {
    const fetchFiles = async () => {
      if (!isAuthorized) return;
      const { data, error } = await supabase.storage.from("documents").list();

      if (error) {
        console.error("Supabase dosya çekme hatası:", error.message);
      } else {
        setFiles(data);
        console.log("Dosyalar yüklendi:", data);
      }
    };

    fetchFiles();
  }, [isAuthorized]);

  // Dosya indirme
  const handleDownload = async (fileName) => {
    const cleanedFileName = fileName.startsWith("/") ? fileName.slice(1) : fileName;

    const { data } = supabase.storage
      .from("documents")
      .getPublicUrl(cleanedFileName);

    if (data?.publicUrl) {
      window.open(data.publicUrl, "_blank");
    } else {
      alert("Dosya URL'si alınamadı.");
    }
  };

  // Şifre girişi
  if (!isAuthorized) {
    return (
      <div style={{ padding: "2rem" }}>
        <h2>Şifre Giriniz</h2>
        <input
          type="text"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
          style={{ padding: "0.5rem", marginRight: "1rem" }}
        />
        <button
          onClick={() => {
            if (passwordInput === PASSWORD) {
              setIsAuthorized(true);
            } else {
              alert("Şifre yanlış.");
            }
          }}
        >
          Giriş
        </button>
      </div>
    );
  }

  // Dosya listesi
  return (
    <div style={{ padding: "2rem" }}>
      <h2>Paylaşılan Dosyalar</h2>
      {files.length === 0 ? (
        <p>Henüz bir dosya yüklenmemiş.</p>
      ) : (
        <ul>
          {files.map((file) => (
            <li key={file.name} style={{ marginBottom: "1rem" }}>
              {file.name}
              <button
                style={{ marginLeft: "1rem" }}
                onClick={() => handleDownload(file.name)}
              >
                İndir
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
