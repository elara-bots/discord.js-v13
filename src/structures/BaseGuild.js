'use strict';

const Base = require('./Base');
const SnowflakeUtil = require('../util/SnowflakeUtil');
const { Routes } = require('discord-api-types/v9');

/**
 * The base class for {@link Guild}, {@link OAuth2Guild} and {@link InviteGuild}.
 * @extends {Base}
 * @abstract
 */
class BaseGuild extends Base {
  constructor(client, data) {
    super(client);

    /**
     * The guild's id
     * @type {Snowflake}
     */
    this.id = data.id;

    /**
     * The name of this guild
     * @type {string}
     */
    this.name = data.name;

    /**
     * The icon hash of this guild
     * @type {?string}
     */
    this.icon = data.icon;

    /**
     * An array of features available to this guild
     * @type {Features[]}
     */
    this.features = data.features;
  }

  /**
   * The timestamp this guild was created at
   * @type {number}
   * @readonly
   */
  get createdTimestamp() {
    return SnowflakeUtil.timestampFrom(this.id);
  }

  /**
   * The time this guild was created at
   * @type {Date}
   * @readonly
   */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  /**
   * The acronym that shows up in place of a guild icon
   * @type {string}
   * @readonly
   */
  get nameAcronym() {
    return this.name
      .replace(/'s /g, ' ')
      .replace(/\w+/g, e => e[0])
      .replace(/\s/g, '');
  }

  /**
   * The URL to this guild's icon.
   * @param {ImageURLOptions} [options={}] Options for the Image URL
   * @returns {?string}
   */
  iconURL({ format, size, dynamic } = {}) {
    if (!this.icon) return null;
    return this.client.rest.cdn.Icon(this.id, this.icon, format, size, dynamic);
  }

  /**
   * Fetches this guild.
   * @returns {Promise<Guild>}
   */
  async fetch() {
    const data = await this.client.rest.get(Routes.guild(this.id), { query: { with_counts: true } })
    return this.client.guilds._add(data);
  }

  /**
   * When concatenated with a string, this automatically returns the guild's name instead of the Guild object.
   * @returns {string}
   */
  toString() {
    return this.name;
  }
}

module.exports = BaseGuild;
