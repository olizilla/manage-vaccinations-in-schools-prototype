import { fakerEN_GB as faker } from '@faker-js/faker'

import { formatOther, formatParent, stringToBoolean } from '../utils/string.js'

/**
 * @readonly
 * @enum {string}
 */
export const ContactPreference = {
  None: 'No preference',
  Text: 'Text message',
  Call: 'Voice call',
  Other: 'Other'
}

/**
 * @readonly
 * @enum {string}
 */
export const ParentalRelationship = {
  Mum: 'Mum',
  Dad: 'Dad',
  Guardian: 'Guardian',
  Other: 'Other',
  Unknown: 'Unknown'
}

/**
 * @readonly
 * @enum {string}
 */
export const EmailStatus = {
  Delivered: 'Delivered',
  Permanent: 'Email address does not exist',
  Temporary: 'Inbox not accepting messages right now',
  Technical: 'Technical failure'
}

/**
 * @readonly
 * @enum {string}
 */
export const SmsStatus = {
  Delivered: 'Delivered',
  Permanent: 'Not delivered',
  Temporary: 'Phone not accepting messages right now',
  Technical: 'Technical failure'
}

/**
 * @class Parent
 * @param {object} options - Options
 * @param {object} [context] - Context
 * @property {object} [context] - Context
 * @property {string} uuid - UUID
 * @property {string} [fullName] - Full name
 * @property {ParentalRelationship} [relationship] - Relationship to child
 * @property {string} [relationshipOther] - Other relationship to child
 * @property {boolean} [hasParentalResponsibility] - Has parental responsibility
 * @property {boolean} notify - Notify about consent and vaccination events
 * @property {string} tel - Phone number
 * @property {string} email - Email address
 * @property {EmailStatus} emailStatus - Email status
 * @property {boolean} sms - Update via SMS
 * @property {SmsStatus} smsStatus - SMS status
 * @property {ContactPreference} [contactPreference] - Preferred contact method
 * @property {string} [contactPreferenceOther] - Other contact method
 */
export class Parent {
  constructor(options, context) {
    this.context = context
    this.uuid = options?.uuid || faker.string.uuid()
    this.fullName = options.fullName || ''
    this.relationship = options.relationship || ParentalRelationship.Unknown
    this.relationshipOther =
      this?.relationship === ParentalRelationship.Other
        ? options?.relationshipOther
        : undefined
    this.hasParentalResponsibility =
      this.relationship === ParentalRelationship.Other
        ? stringToBoolean(options.hasParentalResponsibility)
        : undefined
    this.notify = stringToBoolean(options?.notify)
    this.tel = options.tel || ''
    this.email = options.email
    this.emailStatus = this?.email && options?.emailStatus
    this.sms = stringToBoolean(options.sms) || false
    this.smsStatus = this?.sms && options?.smsStatus
    this.contactPreference = options?.contactPreference
    this.contactPreferenceOther =
      this.contactPreference === ContactPreference.Other
        ? options?.contactPreferenceOther
        : undefined
    this.patient_nhsn = options?.patient_nhsn
  }

  /**
   * Get formatted values
   *
   * @returns {object} - Formatted values
   */
  get formatted() {
    return {
      contactPreference: formatOther(
        this.contactPreferenceOther,
        this.contactPreference
      ),
      fullName: this.fullName || 'Name unknown',
      fullNameAndRelationship: formatParent(this, false),
      relationship: formatOther(this.relationshipOther, this.relationship)
    }
  }

  /**
   * Get namespace
   *
   * @returns {string} - Namespace
   */
  get ns() {
    return 'parent'
  }

  /**
   * Read all
   *
   * @param {object} context - Context
   * @returns {Array<Parent>|undefined} Parents
   * @static
   */
  static readAll(context) {
    return Object.values(context.parents).map(
      (parent) => new Parent(parent, context)
    )
  }

  /**
   * Read
   *
   * @param {string} uuid - Parent UUID
   * @param {object} context - Context
   * @returns {Parent|undefined} Record
   * @static
   */
  static read(uuid, context) {
    if (context?.parents) {
      return new Parent(context.parents[uuid], context)
    }
  }

  /**
   * Create
   *
   * @param {Parent} parent - Parent
   * @param {object} context - Context
   */
  create(parent, context) {
    parent = new Parent(parent)

    // Update context
    context.parents = context.parents || {}
    context.parents[parent.uuid] = parent
  }
}
