import { useState, useEffect } from "react";

function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchMode, setSearchMode] = useState(null);
  const [dataApi, setDataApi] = useState([]);
  const API_URL = "https://jokico.web.id/api/checkout/belum/1853";

  // ✅ Fetch API hanya sekali saat mount
  useEffect(() => {
    setLoading(true); // ⬅️ mulai loading sebelum fetch
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        console.log("Data asli dari API:", data);
        if (Array.isArray(data.data)) {
          setDataApi(data.data);
        } else {
          console.warn("API tidak mengembalikan array:", data);
          setDataApi([]);
        }
      })
      .catch((err) => console.error("Error fetch API:", err))
      .finally(() => setLoading(false)); // ⬅️ stop loading setelah fetch
  }, []);

  const handleSearch = (field) => {
    setLoading(true);
    setResults([]);

    const list = query
      .split(/[\n,]+/)
      .map((r) => r.trim().toUpperCase())
      .filter((r) => r);

    const resultsArray = list.map((val) => {
      let found = null;

      if (field === "no_resi") {
        found = dataApi.find(
          (item) => item.no_resi && item.no_resi.toUpperCase() === val
        );
      } else if (field === "no_pes") {
        found = dataApi.find(
          (item) =>
            item.no_pesanan &&
            item.no_pesanan.slice(-4) === val.slice(-4)
        );
      }

      if (found) {
        return { name: val, found: true, data: found };
      } else {
        return { name: val, found: false };
      }
    });

    setResults(resultsArray);
    setLoading(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ textAlign: "center" }}>
        <h1>Cari Banyak Nomor Sekaligus</h1>
        <h2>Solusi untuk pabom 💩</h2>
      </div>
      {/* 🔹 Tampilkan loading saat data awal masih kosong */}
      {loading && dataApi.length === 0 && (
        <p style={{ textAlign: "center" }}>⏳ Loading data dari server...</p>
      )}
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <button
          onClick={() => {
            setSearchMode("resi");
            setResults([]);
            setQuery("");
          }}
          disabled={loading} // 🔹 tombol disable saat loading
          style={{
            padding: "8px",
            marginRight: "10px",
            opacity: loading ? 0.5 : 1, // biar kelihatan abu-abu
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          🔎 Cari by Resi
        </button>
        <button
          onClick={() => {
            setSearchMode("nopes");
            setResults([]);
            setQuery("");
          }}
          disabled={loading} // 🔹 tombol disable saat loading
          style={{
            padding: "8px",
            opacity: loading ? 0.5 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          🔎 Cari by NoPes
        </button>
      </div>

      {searchMode && (
        <div>
          <h3>
            {searchMode === "resi"
              ? "Cari Nomor Resi"
              : "Cari Nomor Pesanan 4 Angka Terakhir"}
          </h3>
          <textarea
            placeholder={
              searchMode === "resi"
                ? "Contoh: JX53534534345, JX09U9034546"
                : "Masukin 4angka terakhir no pesanan misal 580412921456920201, jadi 0201"
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows={10}
            style={{ width: "100%", padding: "8px" }}
          />
          <br />
          <button
            onClick={() =>
              handleSearch(searchMode === "resi" ? "no_resi" : "no_pes")
            }
            style={{ marginTop: "10px", padding: "8px" }}
          >
            Cari
          </button>
        </div>
      )}

      {loading && <p>Loading...</p>}

      <ul>
        {results.map((result, idx) => (
          <li key={idx}>
            {result.found ? (
              <>
                ✅ {result.name} ditemukan — Resi: {result.data.no_resi} — Nomor Pesanan :
                {result.data.no_pesanan} — Nama: {result.data.nama_lengkap} — Produk:{" "}
                {result.data.produk} — Status: {result.data.keterangan}
              </>
            ) : (
              <>❌ {result.name} tidak ditemukan di data</>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
