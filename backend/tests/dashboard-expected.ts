// Independently enumerated IDs for the accepted fixed-date synthetic baseline.
export const ownerIds = {
  total_properties: ['P001', 'P002', 'P003', 'P004'],
  total_resources: [
    'R101',
    'R102',
    'R103',
    'R104',
    'R201',
    'R202',
    'R203',
    'R301',
    'R302',
    'R303',
    'R401',
  ],
  occupied_resources: ['R101', 'R102', 'R104', 'R201', 'R301'],
  available_resources: ['R103', 'R202', 'R203', 'R302', 'R303', 'R401'],
  current_tenants: ['TEN001', 'TEN002', 'TEN003', 'TEN004', 'TEN005', 'TEN006'],
  upcoming_contract_starts: ['C007'],
  upcoming_contract_ends: ['C006'],
  unpaid_rent_periods: ['OBL002', 'OBL003', 'OBL004', 'OBL006', 'OBL007'],
  contracts_expiring: ['C002', 'C006'],
};
export const managerIds = {
  ...ownerIds,
  total_properties: ['P001', 'P002'],
  total_resources: ['R101', 'R102', 'R103', 'R104', 'R201', 'R202', 'R203'],
  occupied_resources: ['R101', 'R102', 'R104', 'R201'],
  available_resources: ['R103', 'R202', 'R203'],
  current_tenants: ['TEN001', 'TEN002', 'TEN003', 'TEN005', 'TEN006'],
  unpaid_rent_periods: ['OBL002', 'OBL003', 'OBL006', 'OBL007'],
};
export const viewerIds = {
  ...managerIds,
  total_properties: ['P001'],
  total_resources: ['R101', 'R102', 'R103', 'R104'],
  occupied_resources: ['R101', 'R102', 'R104'],
  available_resources: ['R103'],
  current_tenants: ['TEN001', 'TEN002', 'TEN005', 'TEN006'],
  unpaid_rent_periods: ['OBL002', 'OBL006', 'OBL007'],
};
