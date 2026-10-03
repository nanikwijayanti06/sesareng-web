import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import { ArrowRight, Building2, GraduationCap, MapPinned, Search, Store, UserPlus } from "lucide-react";
import ActorAvatar from "../components/common/ActorAvatar";
import AdminDialog from "../components/common/AdminDialog";
import DetailDrawer from "../components/common/DetailDrawer";
import DashboardLayout from "../components/layout/DashboardLayout";
import locationsData from "../data/locations.json";
import umkmData from "../data/umkm.json";
import { filterLocations } from "../logic/mapLogic";
import "leaflet/dist/leaflet.css";
import "../styles/catalog.css";
import "../styles/map.css";

const locations = locationsData.items;
const markerColors = { UMKM: "#2d63c8", Provider: "#138579", "Perguruan Tinggi": "#17324f" };
const actorIcons = { UMKM: Store, Provider: Building2, "Perguruan Tinggi": GraduationCap };

function EcosystemMap() {
  const navigate = useNavigate();
  const [visibleTypes, setVisibleTypes] = useState(["UMKM", "Provider", "Perguruan Tinggi"]);
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("");
  const [stage, setStage] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [assignmentUmkmId, setAssignmentUmkmId] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const regions = [...new Set(locations.map((item) => item.region))];
  const stages = [...new Set(locations.map((item) => item.stage))];

  const filteredLocations = useMemo(() => filterLocations(locations, { search, region, stage })
    .filter((location) => visibleTypes.includes(location.type)), [search, region, stage, visibleTypes]);

  const toggleType = (type) => setVisibleTypes((current) => current.includes(type)
    ? current.filter((item) => item !== type)
    : [...current, type]);

  const openRelatedPage = () => {
    const path = selectedLocation.type === "UMKM" ? "/umkm"
      : selectedLocation.type === "Provider" ? "/provider" : "/universitas";
    navigate(path);
  };

  const openArpi = () => navigate(`/arpi?stage=${selectedLocation.stage.toLowerCase()}${selectedLocation.umkmId ? `&umkmId=${selectedLocation.umkmId}` : ""}`);

  const saveAssignment = (event) => {
    event.preventDefault();
    if (!assignmentUmkmId || !selectedLocation) return;
    setAssignments((current) => [...current, { actorId: selectedLocation.id, actorName: selectedLocation.name, umkmId: assignmentUmkmId }]);
    setAssigning(false);
    setAssignmentUmkmId("");
  };

  return (
    <DashboardLayout>
      <section className="workspace-page map-page">
        <header className="page-heading">
          <div><p className="page-kicker">ADMIN REGIONAL AI HUB / SEBARAN</p><h1>Peta Ekosistem</h1><p>Lokasi aktor dan mitra produktivitas di Kabupaten Sleman.</p></div>
          <div className="page-count"><MapPinned size={17} /> {filteredLocations.length} lokasi</div>
        </header>
        <p className="prototype-label">{locationsData.dataStatus}</p>

        <div className="map-admin-toolbar">
          <label className="catalog-search"><Search size={16} /><input aria-label="Cari aktor peta" onChange={(event) => setSearch(event.target.value)} placeholder="Cari aktor atau layanan" value={search} /></label>
          <select aria-label="Filter wilayah peta" onChange={(event) => setRegion(event.target.value)} value={region}><option value="">Semua wilayah</option>{regions.map((item) => <option key={item}>{item}</option>)}</select>
          <select aria-label="Filter tahap peta" onChange={(event) => setStage(event.target.value)} value={stage}><option value="">Semua tahap</option>{stages.map((item) => <option key={item}>{item}</option>)}</select>
        </div>

        <div className="map-filters" aria-label="Filter jenis lokasi">
          {Object.entries(markerColors).map(([type, color]) => (
            <button aria-pressed={visibleTypes.includes(type)} className={`map-filter ${visibleTypes.includes(type) ? "selected" : ""}`} key={type} onClick={() => toggleType(type)} type="button">
              <i style={{ backgroundColor: color }} />{type}
            </button>
          ))}
        </div>
        <p className="map-result-count">Menampilkan <strong>{filteredLocations.length}</strong> dari {locations.length} lokasi</p>
        <div className="ecosystem-map">
          <MapContainer center={[-7.75, 110.37]} zoom={11} scrollWheelZoom className="ecosystem-leaflet-map">
            <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {filteredLocations.map((location) => (
              <CircleMarker
                eventHandlers={{ click: () => setSelectedLocation(location) }}
                key={location.id}
                center={location.position}
                radius={9}
                pathOptions={{ color: "#fff", weight: 2, fillColor: markerColors[location.type], fillOpacity: 0.95 }}
              >
                <Popup><strong>{location.name}</strong><br />{location.type} · {location.region} · {location.detail}</Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      </section>

      <DetailDrawer
        open={Boolean(selectedLocation)}
        title="Detail aktor"
        onClose={() => setSelectedLocation(null)}
        footer={selectedLocation && <>
          <button className="admin-button" onClick={openRelatedPage} type="button">Detail <ArrowRight size={14} /></button>
          <button className="admin-button" onClick={() => setAssigning(true)} type="button"><UserPlus size={14} /> Assign</button>
          <button className="admin-button primary" onClick={openArpi} type="button">Open ARPI <ArrowRight size={14} /></button>
        </>}
      >
        {selectedLocation && <div className="map-detail-content">
          <ActorAvatar assetKey={selectedLocation.imageKey} name={selectedLocation.name} icon={actorIcons[selectedLocation.type]} />
          <h3>{selectedLocation.name}</h3>
          <span className="provider-type-badge">{selectedLocation.type}</span>
          <div className="admin-detail-grid">
            {[["Wilayah", selectedLocation.region], ["Profil/layanan", selectedLocation.detail], ["ARPI stage", selectedLocation.stage], ["Diagnose profile", selectedLocation.diagnoseProfile ?? "Tidak terkait"], ["Assignment lokal", assignments.filter((item) => item.actorId === selectedLocation.id).length]].map(([label, value]) => <div className="admin-detail-item" key={label}><span>{label}</span><strong>{value}</strong></div>)}
          </div>
        </div>}
      </DetailDrawer>

      <AdminDialog open={assigning} onClose={() => setAssigning(false)} title={`Assign ${selectedLocation?.name ?? "aktor"}`}>
        <form id="map-assign-form" onSubmit={saveAssignment}>
          <label className="admin-form-field">UMKM<select onChange={(event) => setAssignmentUmkmId(event.target.value)} required value={assignmentUmkmId}><option value="">Pilih UMKM</option>{umkmData.items.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
          <div className="admin-dialog-footer"><button className="admin-button" onClick={() => setAssigning(false)} type="button">Batal</button><button className="admin-button primary" type="submit"><UserPlus size={14} /> Simpan assignment</button></div>
        </form>
      </AdminDialog>
    </DashboardLayout>
  );
}

export default EcosystemMap;
