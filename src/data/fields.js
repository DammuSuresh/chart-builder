// Single source of truth for the field picker, search, grouping and chart logic.
// Every field used anywhere in the app is defined once, here.

export const ATTRIBUTE_GROUP_ORDER = [
  'Geography',
  'Customer Profile',
  'Product',
  'Sales & Deal',
  'Marketing',
  'Account & Support',
]

export const MEASURE_GROUP_ORDER = ['Revenue & Volume', 'Customer & Ops Health']

export const FIELDS = [
  // --- Attributes: Geography ---
  {
    id: 'region',
    label: 'Region',
    type: 'attribute',
    group: 'Geography',
    description: 'The broad geographic territory (e.g., North America, EMEA, APAC) a record belongs to.',
  },
  {
    id: 'country',
    label: 'Country',
    type: 'attribute',
    group: 'Geography',
    description: 'The country associated with the customer or deal.',
  },
  {
    id: 'city',
    label: 'City',
    type: 'attribute',
    group: 'Geography',
    description: 'The city associated with the customer or deal.',
  },

  // --- Attributes: Customer Profile ---
  {
    id: 'customerSegment',
    label: 'Customer Segment',
    type: 'attribute',
    group: 'Customer Profile',
    description: 'The broad market segment a customer belongs to, e.g. Enterprise, Mid-Market, SMB.',
  },
  {
    id: 'customerTier',
    label: 'Customer Tier',
    type: 'attribute',
    group: 'Customer Profile',
    description: "A ranking of a customer's plan level or value, e.g. Platinum, Gold, Silver.",
  },
  {
    id: 'industry',
    label: 'Industry',
    type: 'attribute',
    group: 'Customer Profile',
    description: 'The industry or vertical a customer operates in.',
  },
  {
    id: 'companySize',
    label: 'Company Size',
    type: 'attribute',
    group: 'Customer Profile',
    description: "A bucket for how large a customer's company is, usually by employee count.",
  },
  {
    id: 'signupCohort',
    label: 'Signup Cohort',
    type: 'attribute',
    group: 'Customer Profile',
    description: 'The period a customer first signed up in, used to compare groups of customers over time.',
    timeLike: true,
  },

  // --- Attributes: Product ---
  {
    id: 'productCategory',
    label: 'Product Category',
    type: 'attribute',
    group: 'Product',
    description: 'The top-level grouping a product belongs to.',
  },
  {
    id: 'productSubcategory',
    label: 'Product Subcategory',
    type: 'attribute',
    group: 'Product',
    description: 'A more specific grouping within a product category.',
  },

  // --- Attributes: Sales & Deal ---
  {
    id: 'salesRep',
    label: 'Sales Rep',
    type: 'attribute',
    group: 'Sales & Deal',
    description: 'The individual salesperson who owns or worked this account or deal.',
  },
  {
    id: 'accountOwner',
    label: 'Account Owner',
    type: 'attribute',
    group: 'Sales & Deal',
    description: 'The internal person or team responsible for the account after the sale closes.',
  },
  {
    id: 'orderChannel',
    label: 'Order Channel',
    type: 'attribute',
    group: 'Sales & Deal',
    description: 'How the order was placed, e.g. direct sales, self-serve, or a partner/reseller.',
  },
  {
    id: 'dealStage',
    label: 'Deal Stage',
    type: 'attribute',
    group: 'Sales & Deal',
    description: 'Where a deal currently sits in the sales pipeline, e.g. Prospecting, Negotiation, Closed Won.',
  },
  {
    id: 'contractType',
    label: 'Contract Type',
    type: 'attribute',
    group: 'Sales & Deal',
    description: 'The kind of agreement a customer is on, e.g. monthly, annual, or multi-year.',
  },

  // --- Attributes: Marketing ---
  {
    id: 'leadSource',
    label: 'Lead Source',
    type: 'attribute',
    group: 'Marketing',
    description: 'Where the lead originally came from, e.g. organic search, referral, or paid ads.',
  },
  {
    id: 'campaignName',
    label: 'Campaign Name',
    type: 'attribute',
    group: 'Marketing',
    description: 'The specific marketing campaign a lead or deal is attributed to.',
  },

  // --- Attributes: Account & Support ---
  {
    id: 'paymentMethod',
    label: 'Payment Method',
    type: 'attribute',
    group: 'Account & Support',
    description: 'How the customer pays, e.g. credit card, ACH, or invoice.',
  },
  {
    id: 'renewalDate',
    label: 'Renewal Date',
    type: 'attribute',
    group: 'Account & Support',
    description: "The upcoming quarter a customer's current contract is due to renew.",
    timeLike: true,
  },
  {
    id: 'supportTier',
    label: 'Support Tier',
    type: 'attribute',
    group: 'Account & Support',
    description: 'The level of customer support a customer is entitled to, e.g. Standard or Premium.',
  },

  // --- Measures: Revenue & Volume ---
  {
    id: 'revenue',
    label: 'Revenue',
    type: 'measure',
    group: 'Revenue & Volume',
    description: 'Total money earned from sales in a given period.',
    agg: 'sum',
    unit: 'currency',
  },
  {
    id: 'unitsSold',
    label: 'Units Sold',
    type: 'measure',
    group: 'Revenue & Volume',
    description: 'The total count of product units sold.',
    agg: 'sum',
    unit: 'count',
  },
  {
    id: 'grossMargin',
    label: 'Gross Margin',
    type: 'measure',
    group: 'Revenue & Volume',
    description: 'The percentage of revenue left after subtracting the cost of goods sold.',
    agg: 'mean',
    unit: 'percent',
  },
  {
    id: 'mrr',
    label: 'MRR',
    type: 'measure',
    group: 'Revenue & Volume',
    description: 'Monthly Recurring Revenue — predictable subscription revenue collected each month.',
    agg: 'sum',
    unit: 'currency',
  },

  // --- Measures: Customer & Ops Health ---
  {
    id: 'churnRate',
    label: 'Churn Rate',
    type: 'measure',
    group: 'Customer & Ops Health',
    description: 'The percentage of customers who canceled or stopped buying in a given period.',
    agg: 'mean',
    unit: 'percent',
  },
  {
    id: 'supportTickets',
    label: 'Support Tickets',
    type: 'measure',
    group: 'Customer & Ops Health',
    description: 'The number of customer support requests logged.',
    agg: 'sum',
    unit: 'count',
  },
  {
    id: 'npsScore',
    label: 'NPS Score',
    type: 'measure',
    group: 'Customer & Ops Health',
    description: 'Net Promoter Score — how likely customers are to recommend you, from -100 to 100.',
    agg: 'mean',
    unit: 'score',
  },
  {
    id: 'daysToClose',
    label: 'Days to Close',
    type: 'measure',
    group: 'Customer & Ops Health',
    description: 'How many days it took to move a deal from opened to won.',
    agg: 'mean',
    unit: 'days',
  },
]

export const FIELDS_BY_ID = Object.fromEntries(FIELDS.map((f) => [f.id, f]))
