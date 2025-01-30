import { fakerEN_GB as faker } from '@faker-js/faker'

import schools from '../datasets/schools.js'
import { Record } from '../models/record.js'

import { generateChild } from './child.js'

/**
 * Generate fake record
 *
 * @returns {Record} - Record
 */
export function generateRecord() {
  const child = generateChild()

  // Pending changes
  const pendingChanges = {}
  const hasPendingChanges = faker.datatype.boolean(0.1)
  if (hasPendingChanges) {
    // Adjust date of birth
    const newDob = new Date(child.dob)
    newDob.setFullYear(newDob.getFullYear() - 2)
    pendingChanges.dob = newDob

    // Move school
    const primarySchools = Object.values(schools).filter(
      (school) => school.phase === 'Primary'
    )
    const secondarySchools = Object.values(schools).filter(
      (school) => school.phase === 'Secondary'
    )
    const newUrn =
      schools[child.school_urn]?.phase === 'Primary'
        ? faker.helpers.arrayElement(primarySchools).urn
        : faker.helpers.arrayElement(secondarySchools).urn
    pendingChanges.school_urn = newUrn
  }

  return new Record({
    ...child,
    pendingChanges
  })
}
