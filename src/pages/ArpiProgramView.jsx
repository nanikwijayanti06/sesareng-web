import { useSearchParams } from "react-router-dom";
import {
  BadgeCheck,
  ClipboardCheck,
  Gauge,
  Landmark,
  WalletCards,
} from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import AdaptPanel from "../components/arpi/AdaptPanel";
import AdoptPanel from "../components/arpi/AdoptPanel";
import ArpiTabs from "../components/arpi/ArpiTabs";
import DiagnosePanel from "../components/arpi/DiagnosePanel";
import EnablePanel from "../components/arpi/EnablePanel";
import MatchPanel from "../components/arpi/MatchPanel";
import ProgressStepper from "../components/arpi/ProgressStepper";
import VerifyPanel from "../components/arpi/VerifyPanel";
import { arpiPrototypeStatus, arpiProviders, arpiRecords, arpiStages, arpiUniversities } from "../logic/arpiData";
import "../styles/arpi.css";

const policyItems = [
  { title: "National Standard", description: "Acuan diagnosis dan tata kelola penggunaan AI.", icon: Landmark },
  { title: "Funding Framework", description: "Voucher produktivitas untuk kendala pembiayaan.", icon: WalletCards },
  { title: "Provider Accreditation", description: "Verifikasi kapabilitas dan akreditasi mitra.", icon: BadgeCheck },
  { title: "Productivity Indicators", description: "Ukuran outcome yang dapat dibandingkan.", icon: Gauge },
];

function ArpiProgramView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedStage = searchParams.get("stage");
  const selectedStage = Math.max(0, arpiStages.findIndex((stage) => stage.name.toLowerCase() === requestedStage?.toLowerCase()));
  const setSelectedStage = (index) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("stage", arpiStages[index].name.toLowerCase());
    setSearchParams(nextParams);
  };

  const summaries = [
    { label: "Total UMKM", value: arpiRecords.length, note: "Terdaftar dalam prototipe", icon: ClipboardCheck, tone: "summary-navy" },
    { label: "Diagnose", value: arpiRecords.filter((record) => record.assessmentStatus === "Selesai").length, note: "Assessment selesai", icon: Landmark, tone: "summary-blue" },
    { label: "Intervensi Aktif", value: arpiRecords.filter((record) => ["Enable", "Adopt"].includes(record.stage)).length, note: "Tahap Enable dan Adopt", icon: WalletCards, tone: "summary-teal" },
    { label: "Verify Pending", value: arpiRecords.filter((record) => record.verify.overallStatus !== "Target Tercapai").length, note: "Perlu tindak lanjut", icon: Gauge, tone: "summary-amber" },
  ];

  const panels = [
    <DiagnosePanel key="diagnose" records={arpiRecords} />,
    <MatchPanel key="match" records={arpiRecords} providers={arpiProviders} />,
    <EnablePanel key="enable" records={arpiRecords} providers={arpiProviders} />,
    <AdoptPanel key="adopt" records={arpiRecords} universities={arpiUniversities} />,
    <VerifyPanel key="verify" records={arpiRecords} />,
    <AdaptPanel key="adapt" records={arpiRecords} />,
  ];

  return (
    <DashboardLayout>
      <main className="arpi-workspace">
        <header className="arpi-header">
          <div>
            <p className="arpi-eyebrow">PROGRAM / KERANGKA INTERVENSI</p>
            <h1>Program ARPI</h1>
            <p>Adaptive Regional Productivity Intervention · Regional AI Hub - Kabupaten Sleman</p>
          </div>
          <span className="prototype-chip">{arpiPrototypeStatus}</span>
        </header>

        <section className="arpi-summary-grid" aria-label="Ringkasan ARPI">
          {summaries.map(({ label, value, note, icon: Icon, tone }) => (
            <article className={`arpi-summary-card ${tone}`} key={label}>
              <span className="arpi-summary-label"><Icon size={15} />{label}</span><strong>{value}</strong><small>{note} · Data simulasi/prototipe</small>
            </article>
          ))}
        </section>

        <ProgressStepper stages={arpiStages} activeStage={selectedStage} onStageChange={setSelectedStage} />
        <ArpiTabs stages={arpiStages} activeStage={selectedStage} onStageChange={setSelectedStage} />
        {panels.map((panel, index) => (
          <div hidden={selectedStage !== index} key={arpiStages[index].name}>
            {panel}
          </div>
        ))}

        <section className="arpi-policy-card" aria-labelledby="policy-title">
          <div><h3 id="policy-title">Policy & Governance</h3><p>Prinsip tata kelola untuk koordinasi intervensi produktivitas daerah.</p></div>
          {policyItems.map(({ title, description, icon: Icon }) => (
            <div className="arpi-policy-item" key={title}><Icon size={16} /><div><strong>{title}</strong><span>{description}</span></div></div>
          ))}
        </section>
      </main>
    </DashboardLayout>
  );
}

export default ArpiProgramView;