import { useState } from "react";
import { Building2, Search } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import "../styles/catalog.css";

const providers = [
  { name: "DigitalGrow", focus: "Transformasi digital", area: "Kota Yogyakarta", status: "Aktif", programs: 12 },
  { name: "Produktiva Konsultan", focus: "Operasional & mutu", area: "Sleman", status: "Aktif", programs: 8 },
  { name: "Kreasi Niaga", focus: "Pemasaran", area: "Bantul", status: "Aktif", programs: 6 },
  { name: "Finansial Cerdas", focus: "Keuangan usaha", area: "DIY", status: "Verifikasi", programs: 4 },
  { name: "Pangan Prima Lab", focus: "Teknologi pangan", area: "Kulon Progo", status: "Aktif", programs: 5 },
];

function Provider() {
  const [query, setQuery] = useState("");
  const filteredProviders = providers.filter((provider) =>
    `${provider.name} ${provider.focus} ${provider.area}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <DashboardLayout>
      <section className="workspace-page">
        <header className="page-heading">
          <div>
            <p className="page-kicker">EKOSISTEM / MITRA LAYANAN</p>
            <h1>Provider</h1>
            <p>Mitra pendampingan, pelatihan, dan teknologi untuk UMKM.</p>
          </div>
          <div className="page-count"><Building2 size={17} /> {filteredProviders.length} provider</div>
        </header>

        <label className="catalog-search catalog-search-wide">
          <Search size={17} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari provider, keahlian, atau wilayah" />
        </label>

        <div className="provider-grid">
          {filteredProviders.map((provider) => (
            <article className="provider-tile" key={provider.name}>
              <div className="provider-mark"><Building2 size={20} /></div>
              <div className="provider-title"><h2>{provider.name}</h2><span className={`status-tag ${provider.status === "Aktif" ? "status-active" : ""}`}>{provider.status}</span></div>
              <p>{provider.focus}</p>
              <div className="provider-meta"><span>{provider.area}</span><strong>{provider.programs} program</strong></div>
            </article>
          ))}
          {filteredProviders.length === 0 && <p className="empty-state">Tidak ada provider yang cocok dengan pencarian.</p>}
        </div>
      </section>
    </DashboardLayout>
  );
}

export default Provider;