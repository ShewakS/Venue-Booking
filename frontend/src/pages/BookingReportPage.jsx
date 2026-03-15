import React, { useState } from "react";
import Button from "../components/common/Button";
import api from "../services/api";

const BookingReportPage = () => {
  const now = new Date();
  const [reportScope, setReportScope] = useState("month");
  const [reportYear, setReportYear] = useState(String(now.getFullYear()));
  const [reportMonth, setReportMonth] = useState(String(now.getMonth() + 1));
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState("");
  const [reportData, setReportData] = useState(null);

  const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const buildReportParams = () => ({
    scope: reportScope,
    year: Number(reportYear),
    ...(reportScope === "month" ? { month: Number(reportMonth) } : {}),
  });

  const handleGenerateReport = async () => {
    setReportError("");
    setReportLoading(true);
    try {
      const response = await api.get("/bookings/report", { params: buildReportParams() });
      setReportData(response?.data?.data || null);
    } catch (error) {
      setReportData(null);
      setReportError(error?.response?.data?.message || "Unable to generate report");
    } finally {
      setReportLoading(false);
    }
  };

  const handleDownloadReportPdf = async () => {
    setReportError("");
    setReportLoading(true);
    try {
      const response = await api.get("/bookings/report/pdf", {
        params: buildReportParams(),
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      const monthLabel = String(Number(reportMonth) || 0).padStart(2, "0");
      const fileName =
        reportScope === "month"
          ? `booking-report-month-${reportYear}-${monthLabel}.pdf`
          : `booking-report-year-${reportYear}.pdf`;

      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setReportError(error?.response?.data?.message || "Unable to download report PDF");
    } finally {
      setReportLoading(false);
    }
  };

  const periodLabel =
    reportData
      ? reportScope === "month"
        ? `${MONTH_NAMES[(reportData.month || 1) - 1]} ${reportData.year}`
        : `Year ${reportData.year}`
      : null;

  return (
    <div style={{ display: "grid", gap: "20px" }}>
      <div>
        <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 700 }}>Booking Report</h2>
        <p style={{ margin: "4px 0 0 0", color: "#5b6475", fontSize: "14px" }}>
          Generate and download booking summaries by month or year.
        </p>
      </div>

      <div className="card" style={{ maxWidth: "640px" }}>
        <h3 style={{ marginTop: 0, marginBottom: "16px" }}>Report Filters</h3>

        <div className="form-grid" style={{ marginBottom: "16px" }}>
          <label className="input-field" htmlFor="reportScope">
            <span>Report Type</span>
            <select id="reportScope" value={reportScope} onChange={(e) => setReportScope(e.target.value)}>
              <option value="month">Monthly</option>
              <option value="year">Yearly</option>
            </select>
          </label>

          <label className="input-field" htmlFor="reportYear">
            <span>Year</span>
            <input
              id="reportYear"
              type="number"
              min="2000"
              max="9999"
              value={reportYear}
              onChange={(e) => setReportYear(e.target.value)}
            />
          </label>

          {reportScope === "month" ? (
            <label className="input-field" htmlFor="reportMonth">
              <span>Month</span>
              <select id="reportMonth" value={reportMonth} onChange={(e) => setReportMonth(e.target.value)}>
                {MONTH_NAMES.map((name, idx) => (
                  <option key={idx + 1} value={String(idx + 1)}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <Button type="button" onClick={handleGenerateReport} disabled={reportLoading}>
            {reportLoading ? "Processing..." : "View Report"}
          </Button>
          <Button className="secondary" type="button" onClick={handleDownloadReportPdf} disabled={reportLoading}>
            Download PDF
          </Button>
        </div>

        {reportError ? (
          <p style={{ color: "#c62828", margin: "12px 0 0 0" }}>{reportError}</p>
        ) : null}
      </div>

      {reportData ? (
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ margin: 0 }}>Results — {periodLabel}</h3>
            <span style={{ fontSize: "13px", color: "#5b6475" }}>
              {reportData.fromDate} to {reportData.toDate}
            </span>
          </div>

          <div className="card-grid" style={{ marginBottom: "20px" }}>
            <div className="stat-card tone-blue" style={{ minHeight: "80px" }}>
              <div style={{ fontSize: "28px", fontWeight: 700 }}>{reportData?.totals?.total || 0}</div>
              <div style={{ fontSize: "13px", color: "#5b6475", marginTop: "4px" }}>Total Bookings</div>
            </div>
            <div className="stat-card tone-teal" style={{ minHeight: "80px" }}>
              <div style={{ fontSize: "28px", fontWeight: 700 }}>{reportData?.totals?.approved || 0}</div>
              <div style={{ fontSize: "13px", color: "#5b6475", marginTop: "4px" }}>Approved</div>
            </div>
            <div className="stat-card tone-amber" style={{ minHeight: "80px" }}>
              <div style={{ fontSize: "28px", fontWeight: 700 }}>{reportData?.totals?.pending || 0}</div>
              <div style={{ fontSize: "13px", color: "#5b6475", marginTop: "4px" }}>Pending</div>
            </div>
            <div className="stat-card tone-violet" style={{ minHeight: "80px" }}>
              <div style={{ fontSize: "28px", fontWeight: 700 }}>{reportData?.totals?.rejected || 0}</div>
              <div style={{ fontSize: "13px", color: "#5b6475", marginTop: "4px" }}>Rejected</div>
            </div>
          </div>

          {reportData.bookings && reportData.bookings.length > 0 ? (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                  <tr style={{ background: "#f4f6fb" }}>
                    <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600 }}>#</th>
                    <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600 }}>Title</th>
                    <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600 }}>Space</th>
                    <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600 }}>Date</th>
                    <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600 }}>Time</th>
                    <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600 }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.bookings.map((b, idx) => (
                    <tr key={b.id || idx} style={{ borderBottom: "1px solid #e5e9f2" }}>
                      <td style={{ padding: "10px 12px", color: "#5b6475" }}>{idx + 1}</td>
                      <td style={{ padding: "10px 12px" }}>{b.title || "—"}</td>
                      <td style={{ padding: "10px 12px" }}>{b.spaceName || b.spaceId || "—"}</td>
                      <td style={{ padding: "10px 12px" }}>{b.date || "—"}</td>
                      <td style={{ padding: "10px 12px" }}>
                        {b.startTime && b.endTime ? `${b.startTime} – ${b.endTime}` : "—"}
                      </td>
                      <td style={{ padding: "10px 12px" }}>
                        <span
                          style={{
                            padding: "2px 10px",
                            borderRadius: "12px",
                            fontSize: "12px",
                            fontWeight: 600,
                            background:
                              b.status === "Approved"
                                ? "#e6f4ea"
                                : b.status === "Rejected"
                                ? "#fdecea"
                                : "#fff8e1",
                            color:
                              b.status === "Approved"
                                ? "#2e7d32"
                                : b.status === "Rejected"
                                ? "#c62828"
                                : "#f57f17",
                          }}
                        >
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ color: "#5b6475", textAlign: "center", margin: "16px 0 0 0" }}>
              No bookings found for this period.
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default BookingReportPage;
