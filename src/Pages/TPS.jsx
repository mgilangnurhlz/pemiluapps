import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Sector,
} from "recharts";
import { Link } from "react-router-dom";

import "../css/core.css"; // Import file CSS untuk styling

const TPS = () => {
  const { id, id2, id3, id4, id5 } = useParams();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true); // State untuk menunjukkan loading
  const [Ts, setTs] = useState(null);
  const [routeData1, setRouteData1] = useState({});
  const [routeData2, setRouteData2] = useState({});
  const [routeData3, setRouteData3] = useState({});
  const [routeData4, setRouteData4] = useState({});
  const [routeData5, setRouteData5] = useState({});
  const [administrasi, setAdministrasi] = useState(null);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(
          `https://sirekap-obj-data.kpu.go.id/pemilu/hhcw/ppwp/${id}/${id2}/${id3}/${id4}/${id5}.json`
        );
        const data = await response.json();
        setImages(data.images);
        setTs(data.ts);
        setAdministrasi(data.administrasi);
        setChartData(data.chart);
        setLoading(false); // Set loading menjadi false setelah gambar dimuat
      } catch (error) {
        console.error("Error fetching images:", error);
        setLoading(false); // Set loading menjadi false jika terjadi error
      }
    };

    fetchImages();
  }, [id, id2, id3, id4, id5]); // Menyertakan variabel-variabel sebagai dependensi
  useEffect(() => {
    const fetchRouteData1 = async () => {
      try {
        const response = await fetch(
          "https://sirekap-obj-data.kpu.go.id/wilayah/pemilu/ppwp/0.json"
        );
        const result = await response.json();
        setRouteData1(result.find((item) => item.kode === id) || {});
      } catch (error) {
        console.error("Error fetching route data:", error);
      }
    };

    const fetchRouteData2 = async () => {
      try {
        const response = await fetch(
          `https://sirekap-obj-data.kpu.go.id/wilayah/pemilu/ppwp/${id}.json`
        );
        const result = await response.json();
        setRouteData2(result.find((item) => item.kode === id2) || {});
      } catch (error) {
        console.error("Error fetching route data:", error);
      }
    };

    const fetchRouteData3 = async () => {
      try {
        const response = await fetch(
          `https://sirekap-obj-data.kpu.go.id/wilayah/pemilu/ppwp/${id}/${id2}.json`
        );
        const result = await response.json();
        setRouteData3(result.find((item) => item.kode === id3) || {});
      } catch (error) {
        console.error("Error fetching route data:", error);
      }
    };

    const fetchRouteData4 = async () => {
      try {
        const response = await fetch(
          `https://sirekap-obj-data.kpu.go.id/wilayah/pemilu/ppwp/${id}/${id2}/${id3}.json`
        );
        const result = await response.json();
        setRouteData4(result.find((item) => item.kode === id4) || {});
      } catch (error) {
        console.error("Error fetching route data:", error);
      }
    };

    const fetchRouteData5 = async () => {
      try {
        const response = await fetch(
          `https://sirekap-obj-data.kpu.go.id/wilayah/pemilu/ppwp/${id}/${id2}/${id3}/${id4}.json`
        );
        const result = await response.json();
        setRouteData5(result.find((item) => item.kode === id5) || {});
      } catch (error) {
        console.error("Error fetching route data:", error);
      }
    };

    fetchRouteData1();
    fetchRouteData2();
    fetchRouteData3();
    fetchRouteData4();
    fetchRouteData5();
  }, [id, id2, id3, id4, id5]);
  if (!chartData) {
    return <p>Data Belum Tersedia</p>;
  }
  const chartDataArray = [
    { name: "Anies Baswedan", value: chartData["100025"] || 0 },
    { name: "Prabowo Subianto", value: chartData["100026"] || 0 },
    { name: "Ganjar Pranowo", value: chartData["100027"] || 0 },
  ];

  const COLORS = ["#8CB9BD", "#C7B7A3", "#B67352"];

  // Menghitung total suara untuk setiap kandidat
  const totalAnies = chartData["100025"] || 0;
  const totalPrabowo = chartData["100026"] || 0;
  const totalGanjar = chartData["100027"] || 0;

  // Menghitung total keseluruhan suara
  const totalSuara = totalAnies + totalPrabowo + totalGanjar;

  // Menghitung persentase untuk setiap kandidat
  const persenAnies = ((totalAnies / totalSuara) * 100).toFixed(2);
  const persenPrabowo = ((totalPrabowo / totalSuara) * 100).toFixed(2);
  const persenGanjar = ((totalGanjar / totalSuara) * 100).toFixed(2);
  return (
    <div className="body">
      <div className="container5">
        <div className="route">
          <p>
            <strong>Wilayah Pemilihan:</strong>
            <Link to={`/hitungsuara/${id}/`}>
              {" "}
              PROV. {routeData1.nama}{" "}
            </Link>/{" "}
            {routeData2.kode === id2 && (
              <span>
                <Link to={`/hitungsuara/${id}/${id2}`}>
                  KAB. {routeData2.nama}
                </Link>{" "}
                /{" "}
              </span>
            )}
            {routeData3.kode === id3 && (
              <span>
                <Link to={`/hitungsuara/${id}/${id2}/${id3}`}>
                  KEC. {routeData3.nama}
                </Link>{" "}
                /{" "}
              </span>
            )}
            {routeData4.kode === id4 && (
              <span>
                <Link to={`/hitungsuara/${id}/${id2}/${id3}/${id4}`}>
                  KEL. {routeData4.nama}{" "}
                </Link>
                /{" "}
              </span>
            )}
            {routeData5.kode === id5 && <span>{routeData5.nama} </span>}
          </p>
        </div>
      </div>
      <header>
        <div className="kiri">
          <p>
            <strong>Wilayah Pemilihan:</strong>
            <Link to={`/hitungsuara/${id}/`}>
              {" "}
              PROV. {routeData1.nama}{" "}
            </Link>/{" "}
            {routeData2.kode === id2 && (
              <span>
                <Link to={`/hitungsuara/${id}/${id2}`}>
                  KAB. {routeData2.nama}
                </Link>{" "}
                /{" "}
              </span>
            )}
            {routeData3.kode === id3 && (
              <span>
                <Link to={`/hitungsuara/${id}/${id2}/${id3}`}>
                  KEC. {routeData3.nama}
                </Link>{" "}
                /{" "}
              </span>
            )}
            {routeData4.kode === id4 && (
              <span>
                <Link to={`/hitungsuara/${id}/${id2}/${id3}/${id4}`}>
                  KEL. {routeData4.nama}{" "}
                </Link>
                /{" "}
              </span>
            )}
            {routeData5.kode === id5 && <span>{routeData5.nama} </span>}
          </p>
        </div>
        <div className="kanan">
          <Link to={`/`}>
            <p>Beranda</p>
          </Link>
        </div>
      </header>
      <div className="container">
        <h1 className="title">
          HASIL HITUNG SUARA PEMILU PRESIDEN & WAKIL PRESIDEN RI 2024
        </h1>

        <p className="versi">Versi: {Ts}</p>
        <div className="hidden">
          <p>
            <strong>Anies Baswedan:</strong> {totalAnies} suara ({persenAnies}%)
          </p>
          <p>
            <strong>Prabowo Subianto:</strong> {totalPrabowo} suara (
            {persenPrabowo}%)
          </p>
          <p>
            <strong>Ganjar Pranowo:</strong> {totalGanjar} suara ({persenGanjar}
            %)
          </p>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={chartDataArray}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              labelLine={false} // Menghilangkan garis penunjuk label
              label={({
                cx,
                cy,
                midAngle,
                innerRadius,
                outerRadius,
                percent,
                index,
              }) => {
                const radius = outerRadius + 20; // Mengatur jarak label dari lingkaran
                const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

                return (
                  <text
                    x={x}
                    y={y}
                    fill="#000000" // Warna teks hitam
                    textAnchor={x > cx ? "start" : "end"}
                    dominantBaseline="central"
                    className="pie-chart-label"
                  >
                    {`${chartDataArray[index].name} (${
                      chartDataArray[index].value
                    }) - ${(percent * 100).toFixed(2)}%`}
                  </text>
                );
              }}
              activeShape={({
                cx,
                cy,
                innerRadius,
                outerRadius,
                startAngle,
                endAngle,
                fill,
              }) => {
                return (
                  <g>
                    <Sector
                      cx={cx}
                      cy={cy}
                      innerRadius={innerRadius}
                      outerRadius={outerRadius + 10} // Menambah ukuran saat di-hover
                      startAngle={startAngle}
                      endAngle={endAngle}
                      fill={fill}
                    />
                  </g>
                );
              }}
            >
              {chartDataArray.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value, name) => [`${value}`, name]} />
          </PieChart>
        </ResponsiveContainer>

        <h2>Data Pengguna Hak Pilih</h2>
        {administrasi ? (
          <table>
            <thead>
              <tr>
                <th>Uraian</th>
                <th>Jumlah</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Jumlah pengguna hak pilih dalam DPT</td>
                <td>{administrasi.pengguna_dpt_j}</td>
              </tr>
              <tr>
                <td>Jumlah pengguna hak pilih dalam DPTb</td>
                <td>{administrasi.pengguna_dptb_j}</td>
              </tr>
              <tr>
                <td>Jumlah pengguna hak pilih dalam DPK</td>
                <td>{administrasi.pengguna_non_dpt_j}</td>
              </tr>
              <tr>
                <td>Jumlah pengguna hak pilih</td>
                <td>{administrasi.pengguna_total_j}</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p>Data Belum Tersedia</p>
        )}
        <h2>Perolehan Suara</h2>
        {chartData ? (
          <table>
            <thead>
              <tr>
                <th>Uraian</th>
                <th>Jumlah</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Anies Baswedan</td>
                <td>{chartData && chartData["100025"]}</td>
              </tr>
              <tr>
                <td>Prabowo Subianto</td>
                <td>{chartData && chartData["100026"]}</td>
              </tr>
              <tr>
                <td>Ganjar Pranowo</td>
                <td>{chartData && chartData["100027"]}</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p>Data Belum Tersedia</p>
        )}
        <h2>Jumlah Suara Sah Dan Tidak Sah</h2>
        {administrasi ? (
          <table>
            <thead>
              <tr>
                <th>Uraian</th>
                <th>Jumlah</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Jumlah Suara Sah</td>
                <td>{administrasi.suara_sah}</td>
              </tr>
              <tr>
                <td>Jumlah Suara Tidak Sah</td>
                <td>{administrasi.suara_tidak_sah}</td>
              </tr>
              <tr>
                <td>Jumlah Suara Sah dan Suara Tidak Sah</td>
                <td>{administrasi.suara_total}</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p>Data Belum Tersedia</p>
        )}
        <h2>Form Pindai C</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="image-container">
            {images.map((imageUrl, index) => (
              <div key={index} className="image-wrapper">
                <img
                  src={imageUrl}
                  alt={`Pemilu ${index + 1}`}
                  className="image"
                />
                <div className="overlay">
                  <p className="image-text">Form Pindai C ({index + 1})</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="container2">
        <p>Disclaimer</p>
        <ol>
          <li>
            Publikasi Form Model C/D Hasil adalah hasil penghitungan suara di
            TPS dengan tujuan untuk memudahkan akses informasi publik.
          </li>
          <li>
            Penghitungan suara yang dilakukan oleh KPPS, rekapitulasi hasil
            penghitungan suara dan penetapan hasil pemilu dilakukan secara
            berjenjang dalam rapat pleno terbuka oleh PPK, KPU Kabupaten/Kota,
            KPU Provinsi dan KPU berdasarkan ketentuan peraturan
            perundang-undangan.
          </li>
        </ol>
      </div>
      <div className="container3">
        <p>Versi: {Ts}</p>
      </div>
      <div className="container4">
        <p>Versi: {Ts}</p>
      </div>

      <footer>@mgilangnurhlz || Piy </footer>
    </div>
  );
};

export default TPS;
