import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://fwlfdkdklpnvdkiqatzl.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3bGZka2RrbHBudmRraXFhdHpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxMjM5MTYsImV4cCI6MjA1OTY5OTkxNn0.V2epbdBMBkbo3acH_aqI3wI02wxUqhrP02189PFYgbk";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function App() {
  const [fileUrl, setFileUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFileUrl = async () => {
      const fileName = "Acil Durum Yonetimi.mp4";
      const { data, error } = supabase
        .storage
        .from("documents")
        .getPublicUrl(fileName);

      if (error) {
        console.error("Hata:", error);
        setError("Supabase bağlantı hatası!");
      } else if (data?.publicUrl) {
        setFileUrl(data.publicUrl);
        console.log("URL:", data.publicUrl);
      } else {
        setError("Dosya bulunamadı veya public değil.");
      }
    };

    fetchFileUrl();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Acil Durum Yonetimi.mp4 Testi</h1>
      {fileUrl ? (
        <>
          <p>✅ Dosya bulundu!</p>
          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
            İndir / İzle
          </a>
        </>
      ) : error ? (
        <p style={{ color: "red" }}>❌ {error}</p>
      ) : (
        <p>Dosya kontrol ediliyor...</p>
      )}
    </div>
  );
}
