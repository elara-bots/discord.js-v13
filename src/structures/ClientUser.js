'use strict';

const User = require('./User');
const DataResolver = require('../util/DataResolver');
const { Routes } = require('discord-api-types/v9');

/**
 * Represents the logged in client's Discord user.
 * @extends {User}
 */
class ClientUser extends User {
  _patch(data) {
    super._patch(data);

    if ('verified' in data) {
      /**
       * Whether or not this account has been verified
       * @type {boolean}
       */
      this.verified = data.verified;
    }

    if ('mfa_enabled' in data) {
      /**
       * If the bot's {@link ClientApplication#owner Owner} has MFA enabled on their account
       * @type {?boolean}
       */
      this.mfaEnabled = typeof data.mfa_enabled === 'boolean' ? data.mfa_enabled : null;
    } else {
      this.mfaEnabled ??= null;
    }

    if ('token' in data) this.client.token = data.token;
  }

  /**
   * Represents the client user's presence
   * @type {ClientPresence}
   * @readonly
   */
  get presence() {
    return this.client.presence;
  }

  /**
   * Data used to edit the logged in client
   * @typedef {Object} ClientUserEditData
   * @property {string} [username] The new username
   * @property {?(BufferResolvable|Base64Resolvable)} [avatar] The new avatar
   */

  /**
   * Edits the logged in client.
   * @param {ClientUserEditData} data The new data
   * @returns {Promise<ClientUser>}
   */
  async edit(data) {
    if (typeof data.avatar !== 'undefined') data.avatar = await DataResolver.resolveImage(data.avatar);
    const newData = await this.client.rest.patch(Routes.user(), { body: data });
    this.client.token = newData.token;
    const { updated } = this.client.actions.UserUpdate.handle(newData);
    return updated ?? this;
  }

  /**
   * Options for setting activities
   * @typedef {Object} ActivitiesOptions
   * @property {string} [name] Name of the activity
   * @property {ActivityType|number} [type] Type of the activity
   * @property {string} [url] Twitch / YouTube stream URL
   */

  /**
   * Data resembling a raw Discord presence.
   * @typedef {Object} PresenceData
   * @property {PresenceStatusData} [status] Status of the user
   * @property {boolean} [afk] Whether the user is AFK
   * @property {ActivitiesOptions[]} [activities] Activity the user is playing
   * @property {number|number[]} [shardId] Shard id(s) to have the activity set on
   */

  /**
   * Sets the full presence of the client user.
   * @param {PresenceData} data Data for the presence
   * @returns {ClientPresence}
   * @example
   * // Set the client user's presence
   * client.user.setPresence({ activities: [{ name: 'with discord.js' }], status: 'idle' });
   */
  setPresence(data) {
    return this.client.presence.set(data);
  }

  /**
   * Options for setting an activity.
   * @typedef {Object} ActivityOptions
   * @property {string} [name] Name of the activity
   * @property {string} [url] Twitch / YouTube stream URL
   * @property {ActivityType|number} [type] Type of the activity
   * @property {number|number[]} [shardId] Shard Id(s) to have the activity set on
   */

  /**
   * Sets the activity the client user is playing.
   * @param {string|ActivityOptions} [name] Activity being played, or options for setting the activity
   * @param {ActivityOptions} [options] Options for setting the activity
   * @returns {ClientPresence}
   * @example
   * // Set the client user's activity
   * client.user.setActivity('discord.js', { type: 'WATCHING' });
   */
  setActivity(name, options = {}) {
    if (!name) return this.setPresence({ activities: [], shardId: options.shardId });

    const activity = Object.assign({}, options, typeof name === 'object' ? name : { name });
    return this.setPresence({ activities: [activity], shardId: activity.shardId });
  }

}

module.exports = ClientUser;
