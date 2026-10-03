import { useState } from "react";
import { GraduationCap, Search } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import "../styles/catalog.css";

const universities = [
  { name: "Universitas Gadjah Mada", short: "UGM", area: "Sleman", expertise: "Teknologi pangan, manajemen", partners: 18 },
  { name: "Universitas Negeri Yogyakarta", short: "UNY", area: "Sleman", expertise: "Pengembangan SDM, desain", partners: 12 },
  { name: "Universitas Ahmad Dahlan", short: "UAD", area: "Kota Yogyakarta", expertise: "Sistem informasi, pemasaran", partners: 9 },
  { name: "Universitas Muhammadiyah Yogyakarta", short: "UMY", area: "Bantul", expertise: "Rantai pasok, keuangan", partners: 7 },
];

function University() {
  const [query, setQuery] = useState("");
  const filteredUniversities = universities.filter((university) =>
    `${university.name} ${university.area} ${university.expertise}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <DashboardLayout>
      <section className="workspace-page">
        <header className="page-heading">
          <div>
            <p className="page-kicker">EKOSISTEM / MITRA AKADEMIK</p>
            <h1>Perguruan Tinggi</h1>
            <p>Kolaborasi keahlian akademik untuk mendukung produktivitas daerah.</p>
          </div>
          <div className="page-count"><GraduationCap size={18} /> {filteredUniversities.length} mitra</div>
        </header>

        <label className="catalog-search catalog-search-wide">
          <Search size={17} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari institusi, keahlian, atau wilayah" />
        </label>

        <div className="university-list">
          {filteredUniversities.map((university) => (
            <article className="university-row" key={university.short}>
              <div className="university-monogram">{university.short}</div>
              <div className="university-info"><h2>{university.name}</h2><p>{university.expertise}</p></div>
              <div className="university-partners"><strong>{university.partners}</strong><span>UMKM didampingi</span></div>
              <span className="university-area">{university.area}</span>
            </article>
          ))}
          {filteredUniversities.length === 0 && <p className="empty-state">Tidak ada perguruan tinggi yang cocok dengan pencarian.</p>}
        </div>
      </section>
    </DashboardLayout>
  );
}

export default University;