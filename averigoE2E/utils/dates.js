// AveriGo/Odoo QA instance uses US date format.
const pad = (n) => String(n).padStart(2, '0');

function usDate(d = new Date()) {
  return `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${d.getFullYear()}`;
}

function addDays(days, from = new Date()) {
  const d = new Date(from);
  d.setDate(d.getDate() + days);
  return d;
}

const today = () => usDate();
const firstOfMonth = () => usDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1));

module.exports = { usDate, addDays, today, firstOfMonth };
