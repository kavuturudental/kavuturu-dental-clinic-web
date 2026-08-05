// src/controllers/exportController.js

const Appointment = require("../models/Appointment");

/**
 * Helper to build query filter from request parameters
 */
const buildExportFilter = (query) => {
  const filter = {};

  if (query.startDate || query.endDate) {
    filter.appointmentDate = {};
    if (query.startDate) {
      filter.appointmentDate.$gte = new Date(query.startDate);
    }
    if (query.endDate) {
      const end = new Date(query.endDate);
      end.setHours(23, 59, 59, 999);
      filter.appointmentDate.$lte = end;
    }
  }

  if (query.status && query.status !== "All") {
    filter.status = query.status;
  }

  if (query.treatment) {
    filter.treatment = new RegExp(query.treatment, "i");
  }

  if (query.doctor) {
    filter.doctor = new RegExp(query.doctor, "i");
  }

  return filter;
};

/**
 * Export Appointments to CSV
 * GET /api/doctor/appointment-management/export/csv
 */
const exportCSV = async (req, res, next) => {
  try {
    const filter = buildExportFilter(req.query);
    let appointments = await Appointment.find(filter)
      .populate("patient", "name phone email")
      .sort({ appointmentDate: -1 });

    if (req.query.patientName) {
      const q = req.query.patientName.toLowerCase();
      appointments = appointments.filter(
        (a) => a.patient && a.patient.name && a.patient.name.toLowerCase().includes(q)
      );
    }

    const headers = [
      "Appointment Number",
      "Patient Name",
      "Phone",
      "Email",
      "Treatment",
      "Appointment Date",
      "Appointment Time",
      "Status",
      "Created By",
      "Created At"
    ];

    let csvContent = headers.join(",") + "\n";

    appointments.forEach((apt) => {
      const row = [
        `"${apt.appointmentNumber || apt._id}"`,
        `"${apt.patient?.name || 'N/A'}"`,
        `"${apt.patient?.phone || 'N/A'}"`,
        `"${apt.patient?.email || ''}"`,
        `"${apt.treatment || ''}"`,
        `"${apt.appointmentDate ? new Date(apt.appointmentDate).toISOString().split('T')[0] : ''}"`,
        `"${apt.appointmentTime || ''}"`,
        `"${apt.status || 'Pending'}"`,
        `"${apt.createdBy || 'System'}"`,
        `"${apt.createdAt ? new Date(apt.createdAt).toISOString() : ''}"`
      ];
      csvContent += row.join(",") + "\n";
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=appointments_export_${Date.now()}.csv`);
    return res.status(200).send(csvContent);
  } catch (error) {
    return next(error);
  }
};

/**
 * Export Appointments to Excel
 * GET /api/doctor/appointment-management/export/excel
 */
const exportExcel = async (req, res, next) => {
  try {
    const filter = buildExportFilter(req.query);
    let appointments = await Appointment.find(filter)
      .populate("patient", "name phone email")
      .sort({ appointmentDate: -1 });

    if (req.query.patientName) {
      const q = req.query.patientName.toLowerCase();
      appointments = appointments.filter(
        (a) => a.patient && a.patient.name && a.patient.name.toLowerCase().includes(q)
      );
    }

    const headers = [
      "Appointment Number",
      "Patient Name",
      "Phone",
      "Email",
      "Treatment",
      "Appointment Date",
      "Appointment Time",
      "Status",
      "Created By",
      "Created At"
    ];

    let csvContent = headers.join("\t") + "\n";

    appointments.forEach((apt) => {
      const row = [
        apt.appointmentNumber || String(apt._id),
        apt.patient?.name || 'N/A',
        apt.patient?.phone || 'N/A',
        apt.patient?.email || '',
        apt.treatment || '',
        apt.appointmentDate ? new Date(apt.appointmentDate).toISOString().split('T')[0] : '',
        apt.appointmentTime || '',
        apt.status || 'Pending',
        apt.createdBy || 'System',
        apt.createdAt ? new Date(apt.createdAt).toISOString() : ''
      ];
      csvContent += row.join("\t") + "\n";
    });

    res.setHeader("Content-Type", "application/vnd.ms-excel");
    res.setHeader("Content-Disposition", `attachment; filename=appointments_export_${Date.now()}.xls`);
    return res.status(200).send(csvContent);
  } catch (error) {
    return next(error);
  }
};

/**
 * Export Appointments to PDF (HTML format for printing/saving as PDF)
 * GET /api/doctor/appointment-management/export/pdf
 */
const exportPDF = async (req, res, next) => {
  try {
    const filter = buildExportFilter(req.query);
    let appointments = await Appointment.find(filter)
      .populate("patient", "name phone email")
      .sort({ appointmentDate: -1 });

    if (req.query.patientName) {
      const q = req.query.patientName.toLowerCase();
      appointments = appointments.filter(
        (a) => a.patient && a.patient.name && a.patient.name.toLowerCase().includes(q)
      );
    }

    const generatedDate = new Date().toLocaleString();

    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Appointment Export Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; color: #1e293b; }
          .header { border-bottom: 2px solid #0E2A6D; padding-bottom: 15px; margin-bottom: 20px; }
          .clinic-title { font-size: 24px; font-weight: bold; color: #0E2A6D; }
          .report-subtitle { font-size: 14px; color: #64748b; margin-top: 4px; }
          .meta { font-size: 12px; color: #64748b; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
          th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
          th { background-color: #f1f5f9; color: #0f172a; font-weight: bold; }
          tr:nth-child(even) { background-color: #f8fafc; }
          .footer { margin-top: 30px; font-size: 11px; text-align: center; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 10px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="clinic-title">Kavuturu Dental Clinic</div>
          <div class="report-subtitle">Appointment Management Export Report</div>
        </div>
        <div class="meta">
          <strong>Generated Date:</strong> ${generatedDate} | 
          <strong>Total Records:</strong> ${appointments.length} | 
          <strong>Status Filter:</strong> ${req.query.status || 'All'}
        </div>
        <table>
          <thead>
            <tr>
              <th>Apt #</th>
              <th>Patient Name</th>
              <th>Phone</th>
              <th>Treatment</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${appointments.map(a => `
              <tr>
                <td>${a.appointmentNumber || a._id}</td>
                <td>${a.patient?.name || 'N/A'}</td>
                <td>${a.patient?.phone || 'N/A'}</td>
                <td>${a.treatment || 'General'}</td>
                <td>${a.appointmentDate ? new Date(a.appointmentDate).toISOString().split('T')[0] : ''}</td>
                <td>${a.appointmentTime || ''}</td>
                <td>${a.status || 'Pending'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="footer">
          Kavuturu Dental Clinic — Official Confidential Medical Report
        </div>
      </body>
      </html>
    `;

    res.setHeader("Content-Type", "text/html");
    res.setHeader("Content-Disposition", `inline; filename=appointments_report_${Date.now()}.html`);
    return res.status(200).send(html);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  exportCSV,
  exportExcel,
  exportPDF
};
