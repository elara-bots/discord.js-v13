'use strict';

const BitField = require('./BitField');

/**
 * @extends {BitField}
 */
class RoleFlags extends BitField {
  /**
   * Bitfield of the packed bits
   * @type {bigint}
   * @name RoleFlags#bitfield
   */

  /**
   * Data that can be resolved to give a role tag number. This can be:
   * * A string (see {@link RoleFlags.FLAGS})
   * * A role tag number
   * * An instance of Roles
   * * An Array of RoleTagsResolvable
   * @typedef {string|bigint|RoleFlags|RoleTagsResolvable[]} RoleTagsResolvable
   */

  /**
   * Gets all given bits that are missing from the bitfield.
   * @param {BitFieldResolvable} bits Bit(s) to check for
   * @returns {string[]}
   */
  missing(bits) {
    return super.missing(bits);
  }

  /**
   * Checks whether the bitfield has a role tag, or any of multiple role tags.
   * @param {RoleTagsResolvable} tags Role tag(s) to check for
   * @returns {boolean}
   */
  any(tags) {
    return super.any(tags);
  }

  /**
   * Checks whether the bitfield has a role tag, or multiple role tags.
   * @param {RoleTagsResolvable} tags Tags(s) to check for
   * @returns {boolean}
   */
  has(tags) {
    return super.has(tags);
  }

  /**
   * Gets an {@link Array} of bitfield names based on the role flags available.
   * @returns {string[]}
   */
  toArray() {
    return super.toArray(false);
  }
}

/**
 * Numeric role flags. All available properties:
 * * `IN_PROMPT` 
 * @type {Object<string, bigint>}
 */
RoleFlags.FLAGS = {
    IN_PROMPT: 1n << 0n,
};

/**
 * Bitfield representing every role tags combined
 * @type {bigint}
 */
RoleFlags.ALL = Object.values(RoleFlags.FLAGS).reduce((all, p) => all | p, 0n);

RoleFlags.defaultBit = BigInt(0);

module.exports = RoleFlags;
