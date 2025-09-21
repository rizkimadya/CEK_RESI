import { useEffect, useState } from "react";
// import Dummy from "./data/dummy.json";

function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchMode, setSearchMode] = useState(null); // "resi" atau "nopes"
  const [dataApi, setDataApi] = useState([]); // simpan data dari API
  const API_URL = "https://jokico.web.id/api/checkout/belum/1853";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(API_URL);
        const json = await res.json();
        setDataApi(json); // simpan ke state
      } catch (err) {
        console.error("Gagal fetch API:", err);
      }
    };
    fetchData();
  }, []);
  console.log(dataApi);

  const handleSearch = (field) => {
    setLoading(true);
    setResults([]);

    const list = query
      .split(/[\n,]+/) // bisa pakai koma atau enter
      .map((r) => r.trim().toUpperCase())
      .filter((r) => r);

    const resultsArray = list.map((val) => {
      let found = null;

      if (field === "no_resi") {
        // Cocokkan persis
        found = Dummy.find(
          (item) => item.no_resi && item.no_resi.toUpperCase() === val
        );
      } else if (field === "no_pes") {
        // Cocokkan 4 angka terakhir
        found = Dummy.find(
          (item) =>
            item.no_pes &&
            item.no_pes.slice(-4) === val.slice(-4) // bandingkan 4 digit terakhir
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

      {/* Pilih menu */}
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <button
          onClick={() => {
            setSearchMode("resi");
            setResults([]);
            setQuery("");
          }}
          style={{ padding: "8px", marginRight: "10px" }}
        >
          🔎 Cari by Resi
        </button>
        <button
          onClick={() => {
            setSearchMode("nopes");
            setResults([]);
            setQuery("");
          }}
          style={{ padding: "8px" }}
        >
          🔎 Cari by NoPes
        </button>
      </div>

      {/* Input + Hasil */}
      {searchMode && (
        <div>
          <h3>
            {searchMode === "resi" ? "Cari Nomor Resi" : "Cari Nomor Pesanan 4 Angka Terakhir"}
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
                ✅ {result.name} ditemukan — Resi: {result.data.no_resi} — NoPes:{" "}
                {result.data.no_pes} — Pengirim: {result.data.pengirim} — Penerima:{" "}
                {result.data.penerima} — Status: {result.data.status}
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
