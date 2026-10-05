// Stakeholder matrix: influence against interest, split into four quadrants.
import type { Stakeholder } from '@/lib/data/types'

export type Quadrant = 'manage_closely' | 'keep_satisfied' | 'keep_informed' | 'monitor'

export const QUADRANT_LABELS: Record<Quadrant, string> = {
  manage_closely: 'Manage closely',
  keep_satisfied: 'Keep satisfied',
  keep_informed: 'Keep informed',
  monitor: 'Monitor',
}

const HIGH = 3

export function quadrantFor(stakeholder: Pick<Stakeholder, 'influence' | 'interest'>): Quadrant {
  const highInfluence = stakeholder.influence >= HIGH
  const highInterest = stakeholder.interest >= HIGH
  if (highInfluence && highInterest) return 'manage_closely'
  if (highInfluence) return 'keep_satisfied'
  if (highInterest) return 'keep_informed'
  return 'monitor'
}

export function groupByQuadrant(stakeholders: Stakeholder[]): Record<Quadrant, Stakeholder[]> {
  const groups: Record<Quadrant, Stakeholder[]> = {
    manage_closely: [],
    keep_satisfied: [],
    keep_informed: [],
    monitor: [],
  }
  for (const stakeholder of stakeholders) {
    groups[quadrantFor(stakeholder)].push(stakeholder)
  }
  return groups
}
