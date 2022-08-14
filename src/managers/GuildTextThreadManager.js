'use strict';

const { ChannelType, Routes } = require('discord-api-types/v10');
const ThreadManager = require('./ThreadManager');
const { TypeError } = require('../errors');
const { resolveAutoArchiveMaxLimit } = require('../util/Util');

/**
 * Manages API methods for {@link ThreadChannel} objects and stores their cache.
 * @extends {CachedManager}
 */
class GuildTextThreadManager extends ThreadManager {
  /**
   * Options for creating a thread. <warn>Only one of `startMessage` or `type` can be defined.</warn>
   * @typedef {StartThreadOptions} ThreadCreateOptions
   * @property {MessageResolvable} [startMessage] The message to start a thread from. <warn>If this is defined then type
   * of thread gets automatically defined and cannot be changed. The provided `type` field will be ignored</warn>
   * @property {ThreadChannelTypes|number} [type] The type of thread to create.
   * Defaults to {@link ChannelType.GuildPublicThread} if created in a {@link TextChannel}
   * <warn>When creating threads in a {@link NewsChannel} this is ignored and is always
   * {@link ChannelType.GuildNewsThread}</warn>
   * @property {boolean} [invitable] Whether non-moderators can add other non-moderators to the thread
   * <info>Can only be set when type will be {@link ChannelType.GuildPrivateThread}</info>
   */

  /**
   * Creates a new thread in the channel.
   * @param {ThreadCreateOptions} [options] Options to create a new thread
   * @returns {Promise<ThreadChannel>}
   * @example
   * // Create a new public thread
   * channel.threads
   *   .create({
   *     name: 'food-talk',
   *     autoArchiveDuration: 60,
   *     reason: 'Needed a separate thread for food',
   *   })
   *   .then(threadChannel => console.log(threadChannel))
   *   .catch(console.error);
   * @example
   * // Create a new private thread
   * channel.threads
   *   .create({
   *      name: 'mod-talk',
   *      autoArchiveDuration: 60,
   *      type: ChannelType.GuildPrivateThread,
   *      reason: 'Needed a separate thread for moderation',
   *    })
   *   .then(threadChannel => console.log(threadChannel))
   *   .catch(console.error);
   */
  async create({
    name,
    autoArchiveDuration = this.channel.defaultAutoArchiveDuration,
    startMessage,
    type,
    invitable,
    reason,
    rateLimitPerUser,
  } = {}) {
    if (type && typeof type !== 'string' && typeof type !== 'number') {
      throw new TypeError('INVALID_TYPE', 'type', 'ThreadChannelType or Number');
    }
    let resolvedType =
      this.channel.type === ChannelType.GuildNews ? ChannelType.GuildNewsThread : ChannelType.GuildPublicThread;
    let startMessageId;
    if (startMessage) {
      startMessageId = this.channel.messages.resolveId(startMessage);
      if (!startMessageId) throw new TypeError('INVALID_TYPE', 'startMessage', 'MessageResolvable');
    } else if (this.channel.type !== ChannelType.GuildNews) {
      resolvedType = type ?? resolvedType;
    }

    if (autoArchiveDuration === 'MAX') autoArchiveDuration = resolveAutoArchiveMaxLimit(this.channel.guild);

    const data = await this.client.rest.post(Routes.threads(this.channel.id, startMessageId), {
      body: {
        name,
        auto_archive_duration: autoArchiveDuration,
        type: resolvedType,
        invitable: resolvedType === ChannelType.GuildPrivateThread ? invitable : undefined,
        rate_limit_per_user: rateLimitPerUser,
      },
      reason,
    });

    return this.client.actions.ThreadCreate.handle(data).thread;
  }
}

module.exports = GuildTextThreadManager;