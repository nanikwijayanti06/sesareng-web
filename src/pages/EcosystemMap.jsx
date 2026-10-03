import { useMemo, useState } from "react";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import { MapPinned } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import "leaflet/dist/leaflet.css";
import "../styles/catalog.css";

const locations = [
  { name: "Kopi Makmur", type: "UMKM", area: "Sleman", position: [-7.718, 110.355] },
  { name: "Batik Sekar", type: "UMKM", area: "Bantul", position: [-7.889, 110.329] },
  { name: "Keripik Ayu", type: "UMKM", area: "Kulon Progo", position: [-7.858, 110.164] },
  { name: "DigitalGrow", type: "Provider", area: "Kota Yogyakarta", position: [-7.797, 110.369] },
  { name: "Produktiva Konsultan", type: "Provider", area: "Sleman", position: [-7.759, 110.378] },
  { name: "Universitas Gadjah Mada", type: "Perguruan Tinggi", area: "Sleman", position: [-7.771, 110.378] },
  { name: "Universitas Ahmad Dahlan", type: "Perguruan Tinggi", area: "Kota Yogyakarta", position: [-7.811, 110.323] },
];
const markerColors = { UMKM: "#d46a32", Provider: "#168578", "Perguruan Tinggi": "#365f9d" };

function EcosystemMap() {
  const [visibleTypes, setVisibleTypes] = useState(["UMKM", "Provider", "Perguruan Tinggi"]);
  const filteredLocations = useMemo(
    () => locations.filter((location) => visibleTypes.includes(location.type)),
    [visibleTypes],
  );
  const toggleType = (type) => setVisibleTypes((current) =>
    current.includes(type) ? current.filter((item) => item !== type) : [...current, type],
  );

  return (
    <DashboardLayout>
      <section className="workspace-page map-page">
        <header className="page-heading">
          <div><p className="page-kicker">EKOSISTEM / SEBARAN WILAYAH</p><h1>Peta Ekosistem</h1><p>Lokasi usaha dan mitra pendukung di Daerah Istimewa Yogyakarta.</p></div>
          <div className="page-count"><MapPinned size={17} /> {filteredLocations.length} lokasi</div>
        </header>
        <div className="map-filters" aria-label="Filter jenis lokasi">
          {Object.keys(markerColors).map((type) => (
            <button className={`map-filter ${visibleTypes.includes(type) ? "selected" : ""}`} key={type} onClick={() => toggleType(type)} type="button" aria-pressed={visibleTypes.includes(type)}>
              <i style={{ backgroundColor: markerColors[type] }} />{type}
            </button>
          ))}
        </div>
        <div className="ecosystem-map">
          <MapContainer center={[-7.85, 110.35]} zoom={10} scrollWheelZoom className="ecosystem-leaflet-map">
            <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {filteredLocations.map((location) => (
              <CircleMarker key={location.name} center={location.position} radius={8} pathOptions={{ color: "#fff", weight: 2, fillColor: markerColors[location.type], fillOpacity: 0.95 }}>
                <Popup><strong>{location.name}</strong><br />{location.type} · {location.area}</Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      </section>
    </DashboardLayout>
  );
}

export default EcosystemMap;