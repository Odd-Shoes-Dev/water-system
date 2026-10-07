// Sample sites, tanks, stakeholders and activities. Coordinates and names are
// placeholders for the demo, to be replaced with real pilot data.
import type {
  Activity,
  GreywaterUnit,
  RiverReport,
  Stakeholder,
  Tank,
  WaitlistEntry,
} from '@/lib/data/types'

export const SITES = ['Kampala', 'Mbarara', 'Gulu'] as const

export const sampleTanks: Tank[] = [
  { id: 'tank-kawempe-school', name: 'Kawempe school tank', site: 'Kampala', latitude: 0.3667, longitude: 32.5597, capacityLitres: 10000, roofAreaM2: 220 },
  { id: 'tank-nakawa-home', name: 'Nakawa household tank', site: 'Kampala', latitude: 0.3307, longitude: 32.6246, capacityLitres: 5000, roofAreaM2: 120 },
  { id: 'tank-mbarara-house', name: 'Mbarara riverside house', site: 'Mbarara', latitude: -0.6072, longitude: 30.6545, capacityLitres: 5000, roofAreaM2: 110 },
  { id: 'tank-gulu-centre', name: 'Gulu community centre tank', site: 'Gulu', latitude: 2.7746, longitude: 32.299, capacityLitres: 15000, roofAreaM2: 340 },
]

export const sampleGreywaterUnits: GreywaterUnit[] = [
  { id: 'gw-kawempe-school', name: 'Kawempe school greywater unit', site: 'Kampala', status: 'ok', latitude: 0.3667, longitude: 32.5597 },
  { id: 'gw-mbarara-house', name: 'Mbarara household greywater unit', site: 'Mbarara', status: 'filter_due', latitude: -0.6072, longitude: 30.6545 },
]

export const sampleActivities: Omit<Activity, 'id'>[] = [
  { kind: 'training', title: 'Youth rainwater harvesting training', occurredOn: '2026-08-12', youthCount: 45, householdsReached: 0, facilitiesCount: 2, treesPlanted: 0, participants: 45 },
  { kind: 'clean_up', title: 'Rwizi riverbank clean-up', occurredOn: '2026-08-20', youthCount: 30, householdsReached: 0, facilitiesCount: 0, treesPlanted: 0, participants: 40 },
  { kind: 'restoration', title: 'Riverbank tree planting', occurredOn: '2026-09-05', youthCount: 25, householdsReached: 0, facilitiesCount: 1, treesPlanted: 120, participants: 35 },
  { kind: 'household_adoption', title: 'Household tank installation drive', occurredOn: '2026-09-18', youthCount: 0, householdsReached: 60, facilitiesCount: 0, treesPlanted: 0, participants: 60 },
  { kind: 'clean_up', title: 'Drainage clearing in Gulu', occurredOn: '2026-09-27', youthCount: 20, householdsReached: 35, facilitiesCount: 1, treesPlanted: 0, participants: 28 },
]

export const sampleStakeholders: Omit<Stakeholder, 'id'>[] = [
  { name: 'District water office', organisationType: 'government', role: 'Permits and water quality oversight', influence: 5, interest: 3, latitude: -0.6167, longitude: 30.65 },
  { name: 'Youth environment group', organisationType: 'community', role: 'Runs reporting and clean-ups', influence: 2, interest: 5, latitude: 0.3476, longitude: 32.5825 },
  { name: 'Partner primary school', organisationType: 'school', role: 'Hosts a tank and greywater unit', influence: 2, interest: 4, latitude: 0.3667, longitude: 32.5597 },
  { name: 'Implementing NGO', organisationType: 'ngo', role: 'Project delivery and training', influence: 4, interest: 5, latitude: 0.3476, longitude: 32.5825 },
  { name: 'Local hardware supplier', organisationType: 'business', role: 'Supplies tanks and filters', influence: 2, interest: 2, latitude: 2.7746, longitude: 32.299 },
  { name: 'Development funder', organisationType: 'funder', role: 'Funds pilot phase', influence: 5, interest: 3, latitude: null, longitude: null },
]

// Placeholder phone numbers and names for the demo; real entries are never listed
// back out to the app, only counted, since this is personal data.
export const sampleWaitlist: Omit<WaitlistEntry, 'id' | 'createdAt'>[] = [
  { name: 'Sample applicant 1', place: 'Kampala', phone: '+256700000001', email: 'applicant1@example.com', photoUrl: null, audioUrl: null },
  { name: 'Sample applicant 2', place: 'Mbarara', phone: '+256700000002', email: null, photoUrl: null, audioUrl: null },
  { name: 'Sample applicant 3', place: 'Gulu', phone: '+256700000003', email: 'applicant3@example.com', photoUrl: null, audioUrl: null },
  { name: 'Sample applicant 4', place: 'Mbarara', phone: '+256700000004', email: null, photoUrl: null, audioUrl: null },
  { name: 'Sample applicant 5', place: 'Kampala', phone: '+256700000005', email: 'applicant5@example.com', photoUrl: null, audioUrl: null },
]

export const sampleReports: Omit<RiverReport, 'id' | 'createdAt' | 'locationDescription'>[] = [
  { category: 'illegal_dumping', description: 'Household waste dumped on the bank near the bridge.', latitude: -0.6081, longitude: 30.6502, photoUrls: [], reporterName: 'Sample reporter', status: 'open' },
  { category: 'pollution_hotspot', description: 'Discoloured water coming from an outflow pipe.', latitude: -0.6115, longitude: 30.6538, photoUrls: [], reporterName: 'Sample reporter', status: 'verified' },
  { category: 'blocked_drainage', description: 'Drain blocked with plastic, water pooling on the road.', latitude: -0.6049, longitude: 30.6571, photoUrls: [], reporterName: null, status: 'open' },
  { category: 'riverbank_degradation', description: 'Bank collapsing after heavy rain.', latitude: -0.6138, longitude: 30.6467, photoUrls: [], reporterName: 'Sample reporter', status: 'open' },
  { category: 'clean_up', description: 'Youth group cleared the riverbank.', latitude: -0.6093, longitude: 30.6525, photoUrls: [], reporterName: 'Sample reporter', status: 'resolved' },
  { category: 'restoration', description: 'Trees planted along the bank.', latitude: -0.6127, longitude: 30.6489, photoUrls: [], reporterName: null, status: 'resolved' },
]
