'use strict';

const GuildChannel = require('./GuildChannel');
const GuildForumThreadManager = require('../managers/GuildForumThreadManager');

/**
 * Represents a channel that only contains threads
 * @extends {GuildChannel}
 */
class GuildForumChannel extends GuildChannel {
  constructor(guild, data, client) {
    super(guild, data, client, false);

    /**
     * A manager of the threads belonging to this channel
     * @type {GuildForumThreadManager}
     */
    this.threads = new GuildForumThreadManager(this);
    
    this._patch(data);
  }

  _patch(data) {
    super._patch(data);
    if ('available_tags' in data) {
      /**
       * The set of tags that can be used in this channel.
       * @type {GuildForumTag[]}
       */
      this.availableTags = data.available_tags.map(tag => transformGuildForumTag(tag));
    } else {
      this.availableTags ??= [];
    }

    if ('default_reaction_emoji' in data) {
      /**
       * The emoji to show in the add reaction button on a thread in a guild forum channel
       * @type {?DefaultReaction}
       */
      this.defaultReactionEmoji = data.default_reaction_emoji
        ? transformGuildDefaultReaction(data.default_reaction_emoji)
        : null;
    } else {
      this.defaultReactionEmoji ??= null;
    }

    if ('default_thread_rate_limit_per_user' in data) {
      /**
       * The initial rate_limit_per_user to set on newly created threads in a channel.
       * @type {?number}
       */
      this.defaultThreadRateLimitPerUser = data.default_thread_rate_limit_per_user;
    } else {
      this.defaultThreadRateLimitPerUser ??= null;
    }
  }
}

module.exports = GuildForumChannel;

/**
 * Transforms an API guild forum tag to camel-cased guild forum tag.
 * @param {GuildForumTag} tag The tag to transform
 * @returns {GuildForumTag}
 */
function transformGuildForumTag(tag) {
  return {
    id: tag.id,
    name: tag.name,
    moderated: tag.moderated,
    emojiId: tag.emoji_id,
    emojiName: tag.emoji_name,
  };
}

/**
 * Transforms an API guild forum default reaction object to a
 * camel-cased guild forum default reaction object.
 * @param {APIDefaultReaction} defaultReaction The default reaction to transform
 * @returns {DefaultReaction}
 */
function transformGuildDefaultReaction(defaultReaction) {
  return {
    emojiId: defaultReaction.emoji_id,
    emojiName: defaultReaction.emoji_name,
  };
}