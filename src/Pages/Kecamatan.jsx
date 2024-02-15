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
import "../css/core.css";

const Kecamatan = () => {
  const { id, id2, id3 } = useParams();

  const [wilayahData, setWilayahData] = useState([]);
  const [pemiluData, setPemiluData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [Ts, setTs] = useState(null);
  const [Progres, setProgres] = useState(null);
  const [routeData1, setRouteData1] = useState({});
  const [routeData2, setRouteData2] = useState({});
  const [routeData3, setRouteData3] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseWilayah = await fetch(
          `https://sirekap-obj-data.kpu.go.id/wilayah/pemilu/ppwp/${id}/${id2}/${id3}.json`
        );
        const resultWilayah = await responseWilayah.json();
        resultWilayah.sort((a, b) => a.nama.localeCompare(b.nama));
        setWilayahData(resultWilayah);

        const responsePemilu = await fetch(
          `https://sirekap-obj-data.kpu.go.id/pemilu/hhcw/ppwp/${id}/${id2}/${id3}.json`
        );
        const resultPemilu = await responsePemilu.json();
        setPemiluData(resultPemilu.table);
        setChartData(resultPemilu.chart);
        setTs(resultPemilu.ts);
        setProgres(resultPemilu.progres);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id, id2, id3]);

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

    fetchRouteData1();
    fetchRouteData2();
    fetchRouteData3();
  }, [id, id2, id3]);

  if (!pemiluData || !wilayahData.length || !chartData) {
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
      <header>
        <div className="kiri">
          {routeData1.kode === id && (
            <p>
              <strong>Wilayah Pemilihan:</strong>{" "}
              <Link to={`/hitungsuara/${id}/`}>PROV. {routeData1.nama} </Link>/
              {routeData2.kode === id2 && (
                <span>
                  <Link to={`/hitungsuara/${id}/${id2}`}>
                    {" "}
                    KAB. {routeData2.nama}
                  </Link>{" "}
                  /{" "}
                </span>
              )}
              {routeData3.kode === id3 && <span>KEC. {routeData3.nama}</span>}
            </p>
          )}
        </div>

        <div className="kanan">
          <Link to={`/`}>
            <p>Beranda</p>
          </Link>
        </div>
      </header>
      <div className="container">
        <h1>HASIL HITUNG SUARA PEMILU PRESIDEN & WAKIL PRESIDEN RI 2024</h1>

        <p>
          Versi: {Ts} Progress: {Progres.progres} dari {Progres.total} TPS (
          {chartData.persen})
        </p>
        <div className="hidden">
          <p>
            <strong>Tingkat Kecamatan</strong>
          </p>
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

        <h2>Table Data</h2>
        <table>
          <thead>
            <tr>
              <th>Wilayah</th>
              <th>Anies Baswedan</th>
              <th>Prabowo Subianto</th>
              <th>Ganjar Pranowo</th>
              <th>Progress</th>
            </tr>
          </thead>
          <tbody>
            {wilayahData.map((wilayah) => {
              const pemiluDataItem = pemiluData[wilayah.kode];
              return (
                <tr key={wilayah.kode}>
                  <td>
                    <Link
                      to={`/hitungsuara/${id}/${id2}/${id3}/${wilayah.kode}`}
                    >
                      {wilayah.nama}
                    </Link>
                  </td>
                  <td>{pemiluDataItem["100025"]}</td>
                  <td>{pemiluDataItem["100026"]}</td>
                  <td>{pemiluDataItem["100027"]}</td>
                  <td>{pemiluDataItem.persen || 0}%</td>{" "}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <footer>@mgilangnurhlz || Piy </footer>
    </div>
  );
};

export default Kecamatan;
