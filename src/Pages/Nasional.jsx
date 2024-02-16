import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Sector,
} from "recharts";
import { Link } from "react-router-dom";
import "../css/core.css";

const Nasional = () => {
  const [wilayahData, setWilayahData] = useState([]);
  const [pemiluData, setPemiluData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [Ts, setTs] = useState(null);
  const [Progres, setProgres] = useState(null);

  useEffect(() => {
    const fetchWilayahData = async () => {
      try {
        const response = await fetch(
          "https://sirekap-obj-data.kpu.go.id/wilayah/pemilu/ppwp/0.json"
        );
        const result = await response.json();
        result.sort((a, b) => a.nama.localeCompare(b.nama));
        setWilayahData(result);
      } catch (error) {
        console.error("Error fetching wilayah data:", error);
      }
    };

    const fetchPemiluData = async () => {
      try {
        const response = await fetch(
          "https://sirekap-obj-data.kpu.go.id/pemilu/hhcw/ppwp.json"
        );
        const result = await response.json();
        setPemiluData(result.table);
        setChartData(result.chart);
        setTs(result.ts);
        setProgres(result.progres);
      } catch (error) {
        console.error("Error fetching pemilu data:", error);
      }
    };

    fetchWilayahData();
    fetchPemiluData();
  }, []);

  if (!pemiluData || !wilayahData.length || !chartData) {
    return <p>Data Belum Tersedia</p>;
  }

  // Ubah objek data menjadi format yang sesuai
  const chartDataArray = [
    { name: "Anies Baswedan", value: chartData["100025"] || 0 },
    { name: "Prabowo Subianto", value: chartData["100026"] || 0 },
    { name: "Ganjar Pranowo", value: chartData["100027"] || 0 },
  ];

  const COLORS = ["#8CB9BD", "#C7B7A3", "#B67352"]; // Definisikan warna untuk setiap bagian
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
            <strong>TINGKAT NASIONAL</strong>
          </p>
        </div>
      </div>

      <header>
        <div className="kiri">
          <p>
            <strong>TINGKAT NASIONAL </strong>
          </p>
        </div>

        <div className="kanan"></div>
      </header>
      <div className="container">
        <h1>HASIL HITUNG SUARA PEMILU PRESIDEN & WAKIL PRESIDEN RI 2024</h1>
        <p className="versi">
          Versi: {Ts} Progress: {Progres.progres} dari {Progres.total} TPS (
          {chartData.persen}%)
        </p>
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
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Wilayah</th>
                <th>Anies Baswedan</th>
                <th>Prabowo Subianto</th>
                <th>Ganjar Pranowo</th>
                <th>Progres</th>
              </tr>
            </thead>
            <tbody>
              {wilayahData.map((wilayah) => {
                const pemiluDataItem = pemiluData[wilayah.kode];
                return (
                  <tr key={wilayah.kode}>
                    <td>
                      <Link to={`/hitungsuara/${wilayah.kode}`}>
                        {" "}
                        {wilayah.nama}
                      </Link>
                    </td>
                    <td>{pemiluDataItem["100025"]}</td>
                    <td>{pemiluDataItem["100026"]}</td>
                    <td>{pemiluDataItem["100027"]}</td>
                    <td>{pemiluDataItem.persen}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
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
        <p>
          Versi: {Ts} Progress: {Progres.progres} dari {Progres.total} TPS (
          {chartData.persen}%)
        </p>
      </div>
      <div className="container4">
        <p>
          Versi: {Ts} Progress: {Progres.progres} dari {Progres.total} TPS (
          {chartData.persen}%)
        </p>
      </div>

      <footer>@mgilangnurhlz || Piy</footer>
    </div>
  );
};

export default Nasional;
