// Deterministic synthetic dataset so the chart preview can plot ANY combination
// of the 28 fields, not just a couple of hardcoded demo pairs. Seeded RNG keeps
// the numbers stable across renders instead of reshuffling on every keystroke.

const CATEGORY_VALUES = {
  region: ['North America', 'EMEA', 'APAC', 'LATAM'],
  country: ['United States', 'United Kingdom', 'Germany', 'India', 'Brazil', 'Australia'],
  city: ['New York', 'London', 'Berlin', 'Bengaluru', 'São Paulo', 'Sydney', 'Chicago', 'Toronto'],
  customerSegment: ['Enterprise', 'Mid-Market', 'SMB'],
  customerTier: ['Platinum', 'Gold', 'Silver', 'Bronze'],
  industry: ['Software', 'Financial Services', 'Retail', 'Healthcare', 'Manufacturing', 'Education'],
  companySize: ['1-50', '51-200', '201-1000', '1000+'],
  signupCohort: ['2025-Q1', '2025-Q2', '2025-Q3', '2025-Q4', '2026-Q1', '2026-Q2', '2026-Q3'],
  productCategory: ['Analytics', 'Platform', 'Add-Ons'],
  productSubcategory: ['Dashboards', 'Connectors', 'AI Insights', 'Governance', 'Mobile App'],
  salesRep: ['A. Johnson', 'B. Patel', 'C. Novak', 'D. Kim', 'E. García', 'F. Dubois'],
  accountOwner: ['Team Atlas', 'Team Nova', 'Team Orion', 'Team Vega'],
  orderChannel: ['Direct Sales', 'Self-Serve', 'Partner/Reseller'],
  dealStage: ['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'],
  contractType: ['Monthly', 'Annual', 'Multi-Year'],
  leadSource: ['Organic Search', 'Referral', 'Paid Ads', 'Event', 'Outbound'],
  campaignName: ['Spring Launch', 'Summer Push', 'Data Summit', 'Always-On Search', 'Partner Bundle'],
  paymentMethod: ['Credit Card', 'ACH', 'Invoice', 'Wire Transfer'],
  renewalDate: ['2026-Q4', '2027-Q1', '2027-Q2', '2027-Q3'],
  supportTier: ['Standard', 'Premium', 'Premium Plus'],
}

const MEASURE_RANGES = {
  revenue: [1000, 50000],
  unitsSold: [1, 500],
  grossMargin: [30, 85],
  churnRate: [0, 15],
  mrr: [200, 8000],
  supportTickets: [0, 40],
  npsScore: [-100, 100],
  daysToClose: [5, 120],
}

// mulberry32 — small, fast, deterministic PRNG so the dataset is stable across
// re-renders and between sessions without shipping a large fixed data blob.
function createRng(seed) {
  let a = seed
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function pick(rng, values) {
  return values[Math.floor(rng() * values.length)]
}

function range(rng, [min, max]) {
  return min + rng() * (max - min)
}

function generateRows(count = 150, seed = 42) {
  const rng = createRng(seed)
  const rows = []
  for (let i = 0; i < count; i += 1) {
    const row = { _id: i }
    for (const [fieldId, bounds] of Object.entries(MEASURE_RANGES)) {
      row[fieldId] = range(rng, bounds)
    }
    for (const [fieldId, values] of Object.entries(CATEGORY_VALUES)) {
      row[fieldId] = pick(rng, values)
    }
   
    rows.push(row)
  }
  return rows
}

export const SAMPLE_ROWS = generateRows()
