// src/pages/doctor/AppointmentManagement/DataExport.jsx

import React, { useState, useMemo } from "react";
import ExportFilters from "../../../components/doctor/dataExport/ExportFilters";
import ExportButtons from "../../../components/doctor/dataExport/ExportButtons";
import ExportHistory from "../../../components/doctor/dataExport/ExportHistory";
import useAppointments from "../../../hooks/useAppointments";
import usePatients from "../../../hooks/usePatients";
import useAppointmentRequests from "../../../hooks/useAppointmentRequests";
import EmptyState from "../../../components/receptionist/common/EmptyState";
import StatusBadge from "../../../components/receptionist/appointments/StatusBadge";
import { FileSpreadsheet, Download, Table } from "lucide-react";
import toast from "react-hot-toast";

const getLocalDateString = (offsetDays = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatDisplayDate = (dateStr) => {
  if (!dateStr) return "N/A";
  if (String(dateStr).includes(",")) return dateStr;
  let cleanStr = String(dateStr).split("T")[0].split("GMT")[0].split("+")[0].split("05.30")[0].split("05:30")[0].trim();
  const [y, m, d] = cleanStr.split("-");
  if (y && m && d && y.length === 4) {
    const dateObj = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
    if (!isNaN(dateObj.getTime())) {
      return dateObj.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      });
    }
  }
  return cleanStr;
};

export default function DataExport() {
  const { appointments: rawAppointments, loading: loadingApts } = useAppointments();
  const { patients: rawPatients, loading: loadingPatients } = usePatients();
  const { requests: rawRequests, loading: loadingRequests } = useAppointmentRequests();

  const [exportType, setExportType] = useState("appointments"); // 'appointments' | 'patients' | 'requests'
  const [datePreset, setDatePreset] = useState("all"); // 'all' | 'today' | 'yesterday' | 'week' | 'month' | 'custom'

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    status: "All",
    query: ""
  });

  const [isExporting, setIsExporting] = useState(false);
  const [history, setHistory] = useState([]);

  // Compute active date filter boundaries based on preset
  const { filterStart, filterEnd } = useMemo(() => {
    const today = getLocalDateString(0);
    if (datePreset === "today") {
      return { filterStart: today, filterEnd: today };
    }
    if (datePreset === "yesterday") {
      const yest = getLocalDateString(-1);
      return { filterStart: yest, filterEnd: yest };
    }
    if (datePreset === "week") {
      const d = new Date();
      const dayOfWeek = d.getDay(); // 0 is Sun
      const distanceToMon = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      const startOfWeek = getLocalDateString(-distanceToMon);
      return { filterStart: startOfWeek, filterEnd: today };
    }
    if (datePreset === "month") {
      const d = new Date();
      const startOfMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
      return { filterStart: startOfMonth, filterEnd: today };
    }
    if (datePreset === "custom") {
      return { filterStart: filters.startDate, filterEnd: filters.endDate };
    }
    return { filterStart: "", filterEnd: "" };
  }, [datePreset, filters.startDate, filters.endDate]);

  // Data Pipeline
  const filteredData = useMemo(() => {
    if (exportType === "appointments") {
      let list = (rawAppointments || []).map((a) => {
        const rawDate = a.appointmentDate || a.date || "";
        const formattedDate = typeof rawDate === "string" ? rawDate.split("T")[0] : getLocalDateString(0);
        return {
          id: a._id || a.id,
          aptNumber: a.appointmentNumber || (a._id ? `APT-${String(a._id).slice(-4).toUpperCase()}` : "APT-1001"),
          patientName: a.patient?.name || a.patientName || "Patient",
          phoneNumber: a.patient?.phone || a.phoneNumber || a.phone || "N/A",
          email: a.patient?.email || a.email || "",
          treatment: a.treatment || "General Consultation",
          doctor: a.doctor || "Dr. K. Ravindra Babu",
          status: a.status || "Confirmed",
          date: formattedDate,
          time: a.appointmentTime || a.time || "10:00 AM",
          createdAt: a.createdAt ? formatDisplayDate(a.createdAt) : formatDisplayDate(formattedDate)
        };
      });

      if (filterStart) list = list.filter((a) => a.date >= filterStart);
      if (filterEnd) list = list.filter((a) => a.date <= filterEnd);
      if (filters.status && filters.status !== "All") {
        list = list.filter((a) => a.status.toLowerCase() === filters.status.toLowerCase());
      }
      if (filters.query.trim() !== "") {
        const q = filters.query.toLowerCase();
        list = list.filter(
          (a) =>
            a.patientName.toLowerCase().includes(q) ||
            a.phoneNumber.includes(q) ||
            a.treatment.toLowerCase().includes(q)
        );
      }
      return list;
    }

    if (exportType === "patients") {
      let list = (rawPatients || []).map((p) => ({
        id: p._id || p.id,
        patientName: p.name || "Patient",
        phoneNumber: p.phone || "N/A",
        email: p.email || "N/A",
        visitCount: p.totalVisits ?? (p.appointmentHistory || []).length,
        firstVisit: formatDisplayDate(p.firstVisitDate),
        latestVisit: formatDisplayDate(p.latestAppointmentDate || p.latestVisitDate),
        currentStatus: p.currentStatus || "Active",
        createdAt: formatDisplayDate(p.createdAt || p.firstVisitDate)
      }));

      if (filters.status && filters.status !== "All") {
        list = list.filter((p) => p.currentStatus.toLowerCase() === filters.status.toLowerCase());
      }
      if (filters.query.trim() !== "") {
        const q = filters.query.toLowerCase();
        list = list.filter(
          (p) =>
            p.patientName.toLowerCase().includes(q) ||
            p.phoneNumber.includes(q) ||
            p.email.toLowerCase().includes(q)
        );
      }
      return list;
    }

    if (exportType === "requests") {
      let list = (rawRequests || []).map((r) => {
        const rawDate = r.preferredDate || r.date || "";
        const formattedDate = typeof rawDate === "string" ? rawDate.split("T")[0] : getLocalDateString(0);
        return {
          id: r._id || r.id,
          patientName: r.patientName || r.name || "Patient",
          phoneNumber: r.phone || r.phoneNumber || "N/A",
          treatment: r.treatment || "General Consultation",
          date: formattedDate,
          time: r.preferredTime || r.time || "10:00 AM",
          status: r.status || "Pending",
          createdAt: formatDisplayDate(r.createdAt || formattedDate)
        };
      });

      if (filterStart) list = list.filter((r) => r.date >= filterStart);
      if (filterEnd) list = list.filter((r) => r.date <= filterEnd);
      if (filters.status && filters.status !== "All") {
        list = list.filter((r) => r.status.toLowerCase() === filters.status.toLowerCase());
      }
      if (filters.query.trim() !== "") {
        const q = filters.query.toLowerCase();
        list = list.filter(
          (r) =>
            r.patientName.toLowerCase().includes(q) ||
            r.phoneNumber.includes(q) ||
            r.treatment.toLowerCase().includes(q)
        );
      }
      return list;
    }

    return [];
  }, [exportType, rawAppointments, rawPatients, rawRequests, filterStart, filterEnd, filters]);

  const generateFileName = (extension) => {
    const today = getLocalDateString(0);
    const now = new Date();
    const monthName = now.toLocaleString("default", { month: "long" });
    const year = now.getFullYear();

    let prefix = "Appointments";
    if (exportType === "patients") prefix = "Patients";
    if (exportType === "requests") prefix = "Appointment_Requests";

    if (filters.status && filters.status !== "All") {
      prefix = `${filters.status}_${prefix}`;
    }

    if (datePreset === "month") {
      return `${prefix}_${monthName}_${year}.${extension}`;
    }
    return `${prefix}_${today}.${extension}`;
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleDatePresetChange = (preset) => {
    setDatePreset(preset);
  };

  const handleResetFilters = () => {
    setDatePreset("all");
    setFilters({
      startDate: "",
      endDate: "",
      status: "All",
      query: ""
    });
  };

  const recordHistory = (filename, format, count) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setHistory((prev) => [
      { filename, format, recordCount: count, time: timeStr },
      ...prev.slice(0, 4)
    ]);
  };

  const checkEmptyValidation = () => {
    if (filteredData.length === 0) {
      toast.error("There are no records available to export.");
      return false;
    }
    return true;
  };

  // 1. Export CSV
  const handleExportCSV = async () => {
    if (!checkEmptyValidation()) return;
    setIsExporting(true);
    try {
      let headers = [];
      let csvStr = "";

      if (exportType === "appointments") {
        headers = ["Patient Name", "Phone Number", "Treatment", "Appointment Date", "Appointment Time", "Status", "Created Date"];
        csvStr = headers.join(",") + "\n";
        filteredData.forEach((a) => {
          csvStr += [`"${a.patientName}"`, `"${a.phoneNumber}"`, `"${a.treatment}"`, `"${a.date}"`, `"${a.time}"`, `"${a.status}"`, `"${a.createdAt}"`].join(",") + "\n";
        });
      } else if (exportType === "patients") {
        headers = ["Patient Name", "Phone Number", "Email", "Visit Count", "First Visit", "Latest Visit"];
        csvStr = headers.join(",") + "\n";
        filteredData.forEach((p) => {
          csvStr += [`"${p.patientName}"`, `"${p.phoneNumber}"`, `"${p.email}"`, `"${p.visitCount}"`, `"${p.firstVisit}"`, `"${p.latestVisit}"`].join(",") + "\n";
        });
      } else {
        headers = ["Patient Name", "Phone Number", "Treatment", "Requested Date", "Requested Time", "Status"];
        csvStr = headers.join(",") + "\n";
        filteredData.forEach((r) => {
          csvStr += [`"${r.patientName}"`, `"${r.phoneNumber}"`, `"${r.treatment}"`, `"${r.date}"`, `"${r.time}"`, `"${r.status}"`].join(",") + "\n";
        });
      }

      const blob = new Blob([csvStr], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const filename = generateFileName("csv");

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      recordHistory(filename, "CSV", filteredData.length);
      toast.success(`Exported ${filteredData.length} records to ${filename}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate CSV file.");
    } finally {
      setIsExporting(false);
    }
  };

  // 2. Export Excel (.xlsx)
  const handleExportExcel = async () => {
    if (!checkEmptyValidation()) return;
    setIsExporting(true);
    try {
      let headers = [];
      let tsvStr = "";

      if (exportType === "appointments") {
        headers = ["Patient Name", "Phone Number", "Treatment", "Appointment Date", "Appointment Time", "Status", "Created Date"];
        tsvStr = headers.join("\t") + "\n";
        filteredData.forEach((a) => {
          tsvStr += [a.patientName, a.phoneNumber, a.treatment, a.date, a.time, a.status, a.createdAt].join("\t") + "\n";
        });
      } else if (exportType === "patients") {
        headers = ["Patient Name", "Phone Number", "Email", "Visit Count", "First Visit", "Latest Visit"];
        tsvStr = headers.join("\t") + "\n";
        filteredData.forEach((p) => {
          tsvStr += [p.patientName, p.phoneNumber, p.email, p.visitCount, p.firstVisit, p.latestVisit].join("\t") + "\n";
        });
      } else {
        headers = ["Patient Name", "Phone Number", "Treatment", "Requested Date", "Requested Time", "Status"];
        tsvStr = headers.join("\t") + "\n";
        filteredData.forEach((r) => {
          tsvStr += [r.patientName, r.phoneNumber, r.treatment, r.date, r.time, r.status].join("\t") + "\n";
        });
      }

      const blob = new Blob([tsvStr], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const url = URL.createObjectURL(blob);
      const filename = generateFileName("xlsx");

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      recordHistory(filename, "Excel", filteredData.length);
      toast.success(`Exported ${filteredData.length} records to ${filename}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate Excel file.");
    } finally {
      setIsExporting(false);
    }
  };

  // 3. Export PDF
  const handleExportPDF = async () => {
    if (!checkEmptyValidation()) return;
    setIsExporting(true);
    try {
      const filename = generateFileName("pdf");
      const printWindow = window.open("", "_blank");

      let titleCategory = "Appointments";
      if (exportType === "patients") titleCategory = "Patients Directory";
      if (exportType === "requests") titleCategory = "Appointment Requests";

      let tableHeadersHtml = "";
      let tableRowsHtml = "";

      if (exportType === "appointments") {
        tableHeadersHtml = `
          <tr>
            <th>Patient Name</th>
            <th>Phone</th>
            <th>Treatment</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th>Created Date</th>
          </tr>
        `;
        tableRowsHtml = filteredData.map(a => `
          <tr>
            <td><strong>${a.patientName}</strong></td>
            <td>${a.phoneNumber}</td>
            <td>${a.treatment}</td>
            <td>${a.date}</td>
            <td>${a.time}</td>
            <td>${a.status}</td>
            <td>${a.createdAt}</td>
          </tr>
        `).join("");
      } else if (exportType === "patients") {
        tableHeadersHtml = `
          <tr>
            <th>Patient Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Visits</th>
            <th>First Visit</th>
            <th>Latest Visit</th>
          </tr>
        `;
        tableRowsHtml = filteredData.map(p => `
          <tr>
            <td><strong>${p.patientName}</strong></td>
            <td>${p.phoneNumber}</td>
            <td>${p.email}</td>
            <td>${p.visitCount}</td>
            <td>${p.firstVisit}</td>
            <td>${p.latestVisit}</td>
          </tr>
        `).join("");
      } else {
        tableHeadersHtml = `
          <tr>
            <th>Patient Name</th>
            <th>Phone</th>
            <th>Treatment</th>
            <th>Requested Date</th>
            <th>Requested Time</th>
            <th>Status</th>
          </tr>
        `;
        tableRowsHtml = filteredData.map(r => `
          <tr>
            <td><strong>${r.patientName}</strong></td>
            <td>${r.phoneNumber}</td>
            <td>${r.treatment}</td>
            <td>${r.date}</td>
            <td>${r.time}</td>
            <td>${r.status}</td>
          </tr>
        `).join("");
      }

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${titleCategory} Export Report</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 24px; color: #0f172a; }
            .header { border-bottom: 3px solid #0E2A6D; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
            .title { font-size: 24px; font-weight: 800; color: #0E2A6D; }
            .subtitle { font-size: 13px; color: #64748b; margin-top: 4px; font-weight: 600; }
            .meta { font-size: 11px; color: #475569; margin-bottom: 20px; background: #f8fafc; padding: 12px 16px; border-radius: 12px; border: 1px solid #e2e8f0; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 11px; }
            th, td { border: 1px solid #cbd5e1; padding: 10px 12px; text-align: left; }
            th { background-color: #0E2A6D; color: #ffffff; font-weight: 700; text-transform: uppercase; font-size: 10px; tracking: 0.5px; }
            tr:nth-child(even) { background-color: #f8fafc; }
            .footer { margin-top: 36px; font-size: 10px; text-align: center; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 12px; font-weight: 500; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="title">Kavuturu Dental Clinic</div>
              <div class="subtitle">${titleCategory} — Official Clinic Report</div>
            </div>
          </div>
          <div class="meta">
            <strong>Generated Date:</strong> ${new Date().toLocaleString()} | 
            <strong>Total Records:</strong> ${filteredData.length} | 
            <strong>Filter Status:</strong> ${filters.status}
          </div>
          <table>
            <thead>
              ${tableHeadersHtml}
            </thead>
            <tbody>
              ${tableRowsHtml}
            </tbody>
          </table>
          <div class="footer">
            Kavuturu Dental Clinic — Confidential Patient & Operational Record
          </div>
        </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);

      recordHistory(filename, "PDF", filteredData.length);
      toast.success(`Generated PDF report: ${filename}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF report.");
    } finally {
      setIsExporting(false);
    }
  };

  const isLoading = loadingApts || loadingPatients || loadingRequests;

  return (
    <div className="space-y-6 font-sans select-none w-full min-w-0 pb-12">
      
      {/* 1. Filter Controls */}
      <ExportFilters
        exportType={exportType}
        onExportTypeChange={(type) => {
          setExportType(type);
          setFilters((prev) => ({ ...prev, status: "All" }));
        }}
        datePreset={datePreset}
        onDatePresetChange={handleDatePresetChange}
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />

      {/* 2. Download Buttons Strip */}
      <ExportButtons
        onExportCSV={handleExportCSV}
        onExportExcel={handleExportExcel}
        onExportPDF={handleExportPDF}
        isExporting={isExporting}
      />

      {/* 3. Live Preview & Records Area */}
      <div className="bg-white rounded-[24px] border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Table className="w-5 h-5 text-[#0E2A6D]" />
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Export Records Preview ({filteredData.length})
            </h3>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {exportType.toUpperCase()}
          </span>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-400 text-xs font-medium animate-pulse">
            Loading export records from database...
          </div>
        ) : filteredData.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={FileSpreadsheet}
              title="No Data Available"
              description="There is currently no data available to export. Once appointments, patients, or other records are added, they will appear here and can be exported."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {exportType === "appointments" && (
                    <>
                      <th className="py-4 px-6">Patient Name</th>
                      <th className="py-4 px-6">Phone Number</th>
                      <th className="py-4 px-6">Treatment</th>
                      <th className="py-4 px-6">Appointment Date</th>
                      <th className="py-4 px-6">Time</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6">Created Date</th>
                    </>
                  )}
                  {exportType === "patients" && (
                    <>
                      <th className="py-4 px-6">Patient Name</th>
                      <th className="py-4 px-6">Phone Number</th>
                      <th className="py-4 px-6">Email Address</th>
                      <th className="py-4 px-6 text-center">Visits</th>
                      <th className="py-4 px-6">First Visit</th>
                      <th className="py-4 px-6">Latest Visit</th>
                    </>
                  )}
                  {exportType === "requests" && (
                    <>
                      <th className="py-4 px-6">Patient Name</th>
                      <th className="py-4 px-6">Phone Number</th>
                      <th className="py-4 px-6">Treatment</th>
                      <th className="py-4 px-6">Requested Date</th>
                      <th className="py-4 px-6">Time</th>
                      <th className="py-4 px-6">Status</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {filteredData.map((row, idx) => (
                  <tr key={row.id || idx} className="hover:bg-slate-50/50 transition-colors">
                    {exportType === "appointments" && (
                      <>
                        <td className="py-4 px-6 font-bold text-slate-900">{row.patientName}</td>
                        <td className="py-4 px-6 font-mono text-slate-600">{row.phoneNumber}</td>
                        <td className="py-4 px-6">{row.treatment}</td>
                        <td className="py-4 px-6 font-medium">{formatDisplayDate(row.date)}</td>
                        <td className="py-4 px-6 font-medium">{row.time}</td>
                        <td className="py-4 px-6"><StatusBadge status={row.status} /></td>
                        <td className="py-4 px-6 text-slate-500">{row.createdAt}</td>
                      </>
                    )}
                    {exportType === "patients" && (
                      <>
                        <td className="py-4 px-6 font-bold text-slate-900">{row.patientName}</td>
                        <td className="py-4 px-6 font-mono text-slate-600">{row.phoneNumber}</td>
                        <td className="py-4 px-6 text-slate-500">{row.email}</td>
                        <td className="py-4 px-6 text-center font-bold text-[#0E2A6D]">{row.visitCount}</td>
                        <td className="py-4 px-6">{row.firstVisit}</td>
                        <td className="py-4 px-6">{row.latestVisit}</td>
                      </>
                    )}
                    {exportType === "requests" && (
                      <>
                        <td className="py-4 px-6 font-bold text-slate-900">{row.patientName}</td>
                        <td className="py-4 px-6 font-mono text-slate-600">{row.phoneNumber}</td>
                        <td className="py-4 px-6">{row.treatment}</td>
                        <td className="py-4 px-6 font-medium">{formatDisplayDate(row.date)}</td>
                        <td className="py-4 px-6 font-medium">{row.time}</td>
                        <td className="py-4 px-6"><StatusBadge status={row.status} /></td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. Recent History Log */}
      <ExportHistory history={history} />

    </div>
  );
}
