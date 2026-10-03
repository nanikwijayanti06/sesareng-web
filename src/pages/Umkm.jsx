import { useState } from "react";
import { Search, Store } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import "../styles/catalog.css";

const businesses = [
  { name: "Kopi Makmur", sector: "Makanan & Minuman", location: "Sleman", stage: "Diagnose", score: 68 },
  { name: "Batik Sekar", sector: "Fashion", location: "Bantul", stage: "Match", score: 74 },
  { name: "Keripik Ayu", sector: "Pengolahan Pangan", location: "Kulon Progo", stage: "Enable", score: 52 },
  { name: "Roti Pagi", sector: "Makanan & Minuman", location: "Kota Yogyakarta", stage: "Adopt", score: 81 },
  { name: "Lurik Menoreh", sector: "Fashion", location: "Kulon Progo", stage: "Diagnose", score: 59 },
  { name: "Madu Hutan Nglipar", sector: "Pertanian", location: "Gunungkidul", stage: "Verify", score: 77 },
];

function Umkm() {
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState("Semua tahap");
  const visibleBusinesses = businesses.filter((business) => {
    const matchesQuery = `${business.name} ${business.sector} ${business.location}`
      .toLowerCase()
      .includes(query.toLowerCase());
    return matchesQuery && (stage === "Semua tahap" || business.stage === stage);
  });

  return (
    <DashboardLayout>
      <section className="workspace-page">
        <header className="page-heading">
          <div>
            <p className="page-kicker">EKOSISTEM / PELAKU USAHA</p>
            <h1>UMKM</h1>
            <p>Daftar usaha dan perkembangan kesiapan produktivitas.</p>
          </div>
          <div className="page-count"><Store size={17} /> {visibleBusinesses.length} UMKM</div>
        </header>

        <div className="catalog-toolbar">
          <label className="catalog-search">
            <Search size={17} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari nama, sektor, atau wilayah" />
          </label>
          <select aria-label="Filter tahap ARPI" value={stage} onChange={(event) => setStage(event.target.value)}>
            {["Semua tahap", "Diagnose", "Match", "Enable", "Adopt", "Verify", "Adapt"].map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>

        <div className="catalog-table-wrap">
          <table className="catalog-table">
            <thead><tr><th>Nama UMKM</th><th>Sektor</th><th>Wilayah</th><th>Tahap ARPI</th><th>Kesiapan</th></tr></thead>
            <tbody>
              {visibleBusinesses.map((business) => (
                <tr key={business.name}>
                  <td><strong>{business.name}</strong></td>
                  <td>{business.sector}</td>
                  <td>{business.location}</td>
                  <td><span className="stage-tag">{business.stage}</span></td>
                  <td><div className="readiness"><span><i style={{ width: `${business.score}%` }} /></span><strong>{business.score}%</strong></div></td>
                </tr>
              ))}
              {visibleBusinesses.length === 0 && <tr><td className="empty-state" colSpan="5">Tidak ada UMKM yang cocok dengan pencarian.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </DashboardLayout>
  );
}

export default Umkm;