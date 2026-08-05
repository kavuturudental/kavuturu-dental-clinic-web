// src/templates/appointmentConfirmationTemplate.js

const appointmentConfirmationTemplate = ({
    patientName,
    appointmentNumber,
    appointmentDate,
    appointmentTime,
    treatment,
}) => {
    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Appointment Confirmation</title>
</head>

<body style="margin:0;padding:0;background:#f5f7fb;font-family:Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center">

<table width="650" cellpadding="0" cellspacing="0" style="background:#ffffff;margin:30px auto;border-radius:10px;overflow:hidden;">

<tr>
<td style="background:#0E2A6D;padding:30px;text-align:center;">

<h1 style="color:#ffffff;margin:0;">
Kavuturu Dental Clinic
</h1>

<p style="color:#ffffff;margin-top:10px;">
Your Smile, Our Responsibility
</p>

</td>
</tr>

<tr>
<td style="padding:35px;">

<h2 style="color:#0E2A6D;">
Appointment Confirmed
</h2>

<p>
Dear <strong>${patientName}</strong>,
</p>

<p>
Thank you for booking your appointment with
<b>Kavuturu Dental Clinic.</b>
</p>

<table width="100%" cellpadding="10" cellspacing="0" style="margin-top:20px;border-collapse:collapse;">

<tr style="background:#f7f7f7;">
<td><strong>Appointment No</strong></td>
<td>${appointmentNumber}</td>
</tr>

<tr>
<td><strong>Date</strong></td>
<td>${appointmentDate}</td>
</tr>

<tr style="background:#f7f7f7;">
<td><strong>Time</strong></td>
<td>${appointmentTime}</td>
</tr>

<tr>
<td><strong>Treatment</strong></td>
<td>${treatment}</td>
</tr>

</table>

<p style="margin-top:30px;">
If you need to reschedule your appointment,
please contact us.
</p>

<hr>

<h3 style="color:#0E2A6D;">
Clinic Details
</h3>

<p>

Kavuturu Dental Clinic

<br>

📍 Tirupati

<br>

📞 +91 XXXXX XXXXX

<br>

✉️ doctor@kavuturudental.com

</p>

<p style="margin-top:30px;">
We look forward to seeing you.
</p>

</td>
</tr>

<tr>
<td style="background:#0E2A6D;padding:18px;text-align:center;color:#ffffff;">

© 2026 Kavuturu Dental Clinic

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;
};

module.exports = appointmentConfirmationTemplate;