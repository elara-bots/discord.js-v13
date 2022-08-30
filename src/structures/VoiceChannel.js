'use strict';

const BaseGuildVoiceChannel = require('./BaseGuildVoiceChannel');
const TextBasedChannel = require('./interfaces/TextBasedChannel');
const MessageManager = require('../managers/MessageManager');
const { VideoQualityModes } = require('../util/Constants');
const Permissions = require('../util/Permissions');

/**
 * Represents a guild voice channel on Discord.
 * @extends {BaseGuildVoiceChannel}
 * @implements {TextBasedChannel}
 */
class VoiceChannel extends BaseGuildVoiceChannel {
  constructor(guild, data, client) {
    super(guild, data, client, false);

    /**
     * A manager of the messages sent to this channel
     * @type {MessageManager}
     */
    this.messages = new MessageManager(this);

    /**
     * If the guild considers this channel NSFW
     * @type {boolean}
     */
    this.nsfw = Boolean(data.nsfw);

    this._patch(data);
  }

  _patch(data) {
    super._patch(data);

    if ('video_quality_mode' in data) {
      /**
       * The camera video quality mode of the channel.
       * @type {?VideoQualityMode}
       */
      this.videoQualityMode = VideoQualityModes[data.video_quality_mode];
    } else {
      this.videoQualityMode ??= null;
    }

    if ('messages' in data) {
      for (const message of data.messages) this.messages._add(message);
    }

    if ('rate_limit_per_user' in data) {
      /**
       * The rate limit per user (slowmode) for this channel in seconds
       * @type {number}
       */
      this.rateLimitPerUser = data.rate_limit_per_user;
    }

    if ('nsfw' in data) {
      this.nsfw = data.nsfw;
    }
  }

  /**
   * Whether the channel is editable by the client user
   * @type {boolean}
   * @readonly
   */
  get editable() {
    return this.manageable;
  }

  /**
   * Whether the channel is joinable by the client user
   * @type {boolean}
   * @readonly
   */
  get joinable() {
    if (!super.joinable) return false;
    if (this.full && !this.permissionsFor(this.client.user).has(Permissions.FLAGS.MOVE_MEMBERS, false)) return false;
    return true;
  }

  /**
   * Checks if the client has permission to send audio to the voice channel
   * @type {boolean}
   * @readonly
   */
  get speakable() {
    const permissions = this.permissionsFor(this.client.user);
    if (!permissions) return false;
    // This flag allows speaking even if timed out
    if (permissions.has(Permissions.FLAGS.ADMINISTRATOR, false)) return true;

    return (
      this.guild.me.communicationDisabledUntilTimestamp < Date.now() && permissions.has(Permissions.FLAGS.SPEAK, false)
    );
  }

  // These are here only for documentation purposes - they are implemented by TextBasedChannel
  /* eslint-disable no-empty-function */
  // eslint-disable-next-line getter-return
  send() {}
  sendTyping() {}
  createMessageCollector() {}
  awaitMessages() {}
  createMessageComponentCollector() {}
  awaitMessageComponent() {}
  bulkDelete() {}
  fetchWebhooks() {}
  createWebhook() {}
}

TextBasedChannel.applyToClass(VoiceChannel, true);

module.exports = VoiceChannel;
