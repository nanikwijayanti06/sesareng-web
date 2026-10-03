import DashboardLayout from "../components/layout/DashboardLayout";
import "../styles/dashboard.css";

function Dashboard() {
  const statistics = [
    {
      label: "Total UMKM",
      value: "1.248",
      info: "+68 bulan ini",
      icon: "▦",
      type: "blue",
    },
    {
      label: "Provider Aktif",
      value: "48",
      info: "42 terakreditasi",
      icon: "◈",
      type: "teal",
    },
    {
      label: "Perguruan Tinggi",
      value: "12",
      info: "Mitra regional",
      icon: "◇",
      type: "purple",
    },
    {
      label: "Program Berjalan",
      value: "326",
      info: "26 perlu ditinjau",
      icon: "◎",
      type: "orange",
    },
  ];

  const bottlenecks = [
    {
      name: "Inventory Management",
      value: 72,
      amount: 214,
    },
    {
      name: "Digital Marketing",
      value: 58,
      amount: 173,
    },
    {
      name: "Workforce Capability",
      value: 46,
      amount: 137,
    },
    {
      name: "Financial Management",
      value: 32,
      amount: 95,
    },
  ];

  const activities = [
    {
      title: "Assessment selesai",
      text: "Kopi Makmur menyelesaikan productivity assessment.",
      time: "10 menit lalu",
      status: "assessment",
    },
    {
      title: "Provider ditugaskan",
      text: "DigitalGrow ditugaskan pada Batik Sekar.",
      time: "34 menit lalu",
      status: "provider",
    },
    {
      title: "Intervensi diverifikasi",
      text: "Program demand forecasting berhasil diverifikasi.",
      time: "1 jam lalu",
      status: "verify",
    },
    {
      title: "Mitra baru",
      text: "Perguruan tinggi baru bergabung dalam RA.H.",
      time: "3 jam lalu",
      status: "university",
    },
  ];

  const umkmPreview = [
    {
      initials: "KM",
      name: "Kopi Makmur",
      sector: "Food & Beverage",
      location: "Sleman",
      readiness: "68%",
      status: "Diagnose",
      tone: "blue",
    },
    {
      initials: "BS",
      name: "Batik Sekar",
      sector: "Fashion",
      location: "Bantul",
      readiness: "74%",
      status: "Match",
      tone: "purple",
    },
    {
      initials: "KA",
      name: "Keripik Ayu",
      sector: "Food Processing",
      location: "Kulon Progo",
      readiness: "52%",
      status: "Enable",
      tone: "orange",
    },
  ];

  return (
    <DashboardLayout>
      <section className="dashboard-welcome">
        <div>
          <p className="welcome-label">
            PORTAL PEMERINTAH
          </p>

          <h1>
            Selamat datang kembali,
            <span> Admin Pemerintah.</span>
          </h1>

          <p className="welcome-description">
            Pantau kondisi UMKM, koordinasikan
            ekosistem pendukung, dan kelola
            intervensi produktivitas dalam satu
            tempat.
          </p>
        </div>

        <div className="welcome-actions">
          <button className="secondary-action">
            ⌖ Lihat Peta
          </button>

          <button className="primary-action">
            + Tambah UMKM
          </button>
        </div>
      </section>

      <section className="stat-grid">
        {statistics.map((item) => (
          <article
            className="stat-card"
            key={item.label}
          >
            <div
              className={`stat-icon ${item.type}`}
            >
              {item.icon}
            </div>

            <div className="stat-top">
              <p>{item.label}</p>

              <button>•••</button>
            </div>

            <strong className="stat-number">
              {item.value}
            </strong>

            <span className="stat-info">
              {item.info}
            </span>
          </article>
        ))}
      </section>

      <section className="dashboard-grid-main">
        <article className="dashboard-card overview-card">
          <div className="card-header">
            <div>
              <p className="card-eyebrow">
                PROGRAM ARPI
              </p>

              <h3>Progress Intervensi</h3>
            </div>

            <button className="text-action">
              Lihat program →
            </button>
          </div>

          <div className="arpi-progress">
            <div className="progress-item completed">
              <div className="progress-circle">
                ✓
              </div>
              <span>Diagnose</span>
              <strong>842</strong>
            </div>

            <div className="progress-line active"></div>

            <div className="progress-item completed">
              <div className="progress-circle">
                ✓
              </div>
              <span>Match</span>
              <strong>621</strong>
            </div>

            <div className="progress-line active"></div>

            <div className="progress-item current">
              <div className="progress-circle">
                3
              </div>
              <span>Enable</span>
              <strong>326</strong>
            </div>

            <div className="progress-line"></div>

            <div className="progress-item">
              <div className="progress-circle">
                4
              </div>
              <span>Adopt</span>
              <strong>214</strong>
            </div>

            <div className="progress-line"></div>

            <div className="progress-item">
              <div className="progress-circle">
                5
              </div>
              <span>Verify</span>
              <strong>174</strong>
            </div>

            <div className="progress-line"></div>

            <div className="progress-item">
              <div className="progress-circle">
                6
              </div>
              <span>Adapt</span>
              <strong>96</strong>
            </div>
          </div>

          <div className="program-highlight">
            <div className="highlight-icon">
              ◎
            </div>

            <div>
              <span>Intervensi aktif</span>
              <strong>
                326 UMKM sedang menerima dukungan
              </strong>
            </div>

            <div className="highlight-percentage">
              38,7%
            </div>
          </div>
        </article>

        <article className="dashboard-card quick-card">
          <div className="card-header">
            <div>
              <p className="card-eyebrow">
                AKSES CEPAT
              </p>

              <h3>Kelola Ekosistem</h3>
            </div>
          </div>

          <div className="quick-actions">
            <button>
              <div className="quick-icon blue">
                ▦
              </div>

              <div>
                <strong>Daftar UMKM</strong>
                <span>1.248 terdaftar</span>
              </div>

              <b>›</b>
            </button>

            <button>
              <div className="quick-icon teal">
                ◈
              </div>

              <div>
                <strong>Provider</strong>
                <span>48 provider aktif</span>
              </div>

              <b>›</b>
            </button>

            <button>
              <div className="quick-icon purple">
                ◇
              </div>

              <div>
                <strong>
                  Perguruan Tinggi
                </strong>
                <span>12 mitra regional</span>
              </div>

              <b>›</b>
            </button>

            <button>
              <div className="quick-icon orange">
                ⌖
              </div>

              <div>
                <strong>Peta Ekosistem</strong>
                <span>Lihat persebaran</span>
              </div>

              <b>›</b>
            </button>
          </div>
        </article>
      </section>

      <section className="dashboard-grid-secondary">
        <article className="dashboard-card">
          <div className="card-header">
            <div>
              <p className="card-eyebrow">
                PRODUCTIVITY BOTTLENECK
              </p>

              <h3>
                Kendala UMKM Teratas
              </h3>
            </div>

            <select className="small-select">
              <option>Bulan ini</option>
              <option>3 bulan</option>
              <option>Tahun ini</option>
            </select>
          </div>

          <div className="bottleneck-list">
            {bottlenecks.map((item) => (
              <div
                className="bottleneck-item"
                key={item.name}
              >
                <div className="bottleneck-label">
                  <span>{item.name}</span>

                  <strong>
                    {item.amount} UMKM
                  </strong>
                </div>

                <div className="bottleneck-track">
                  <div
                    className="bottleneck-fill"
                    style={{
                      width: `${item.value}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="dashboard-card activity-card">
          <div className="card-header">
            <div>
              <p className="card-eyebrow">
                AKTIVITAS
              </p>

              <h3>Aktivitas Terbaru</h3>
            </div>

            <button className="text-action">
              Semua →
            </button>
          </div>

          <div className="activity-list">
            {activities.map((item) => (
              <div
                className="activity-item"
                key={item.text}
              >
                <div
                  className={`activity-dot ${item.status}`}
                ></div>

                <div>
                  <strong>
                    {item.title}
                  </strong>

                  <p>{item.text}</p>

                  <span>{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="dashboard-card umkm-section">
        <div className="card-header">
          <div>
            <p className="card-eyebrow">
              UMKM TERBARU
            </p>

            <h3>UMKM dalam Ekosistem</h3>
          </div>

          <button className="text-action">
            Lihat semua UMKM →
          </button>
        </div>

        <div className="umkm-preview-grid">
          {umkmPreview.map((umkm) => (
            <article
              className="umkm-preview-card"
              key={umkm.name}
            >
              <div className="umkm-card-top">
                <div
                  className={`umkm-avatar ${umkm.tone}`}
                >
                  {umkm.initials}
                </div>

                <span className="umkm-status">
                  {umkm.status}
                </span>
              </div>

              <h4>{umkm.name}</h4>

              <p>
                {umkm.sector}
              </p>

              <div className="umkm-location">
                ⌖ {umkm.location}
              </div>

              <div className="readiness-section">
                <div>
                  <span>
                    Digital Readiness
                  </span>

                  <strong>
                    {umkm.readiness}
                  </strong>
                </div>

                <div className="readiness-track">
                  <div
                    style={{
                      width: umkm.readiness,
                    }}
                  ></div>
                </div>
              </div>

              <button className="detail-button">
                Lihat Detail
              </button>
            </article>
          ))}
        </div>
      </section>
    </DashboardLayout>
  );
}

export default Dashboard;