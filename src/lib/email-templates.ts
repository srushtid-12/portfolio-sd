const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

const shell = (inner: string) => `<!doctype html><html><body style="margin:0;background:#f5f0fc;font-family:Georgia,'Times New Roman',serif;color:#2b2242">
<div style="max-width:560px;margin:0 auto;padding:32px 20px">
<div style="background:#ffffff;border:1px solid #e4d9f7;border-radius:20px;padding:28px">${inner}</div>
<p style="text-align:center;font-size:12px;color:#8a7fa8;margin-top:16px">Sent from your portfolio contact form</p>
</div></body></html>`;

export function notificationEmail(d: { name: string; email: string; subject: string; message: string; ip: string }) {
  const subject = d.subject || "New message from your portfolio";
  const html = shell(`
<p style="font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#7c5cd6;margin:0">New message</p>
<h1 style="font-weight:400;font-style:italic;font-size:26px;margin:8px 0 20px">${esc(subject)}</h1>
<p style="margin:0 0 4px;font-size:14px"><b>From:</b> ${esc(d.name)} &lt;${esc(d.email)}&gt;</p>
<div style="margin-top:18px;padding:18px;background:#f8f4fd;border-radius:14px;font-family:Arial,sans-serif;font-size:15px;line-height:1.6;white-space:pre-wrap">${esc(d.message)}</div>
<p style="font-size:12px;color:#8a7fa8;margin-top:18px;font-family:Arial,sans-serif">Reply directly to this email to answer ${esc(d.name)}.</p>`);
  const text = `New portfolio message\n\nFrom: ${d.name} <${d.email}>\nSubject: ${subject}\n\n${d.message}`;
  return { subject: `Portfolio · ${subject}`.slice(0, 150), html, text };
}

export function confirmationEmail(d: { name: string; message: string }) {
  const html = shell(`
<h1 style="font-weight:400;font-style:italic;font-size:26px;margin:0 0 16px">Thank you, ${esc(d.name)}</h1>
<p style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6">Your message reached me, and I'll get back to you soon.</p>
<div style="margin-top:18px;padding:18px;background:#f8f4fd;border-radius:14px;font-family:Arial,sans-serif;font-size:14px;color:#6c6088;white-space:pre-wrap">${esc(d.message)}</div>
<p style="margin-top:20px;font-style:italic">Srushti</p>`);
  return { subject: "Thanks for reaching out", html, text: `Thank you, ${d.name}. Your message reached me, and I'll get back to you soon.\n\nSrushti` };
}
