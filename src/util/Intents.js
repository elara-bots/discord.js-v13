'use strict';
const BitField = require('./BitField');
const { GatewayIntentBits } = require("discord-api-types/v10");

/**
 * Data structure that makes it easy to calculate intents.
 * @extends {BitField}
 */
class Intents extends BitField {}

/**
 * @name Intents
 * @kind constructor
 * @memberof Intents
 * @param {IntentsResolvable} [bits=0] Bit(s) to read from
 */

/**
 * Data that can be resolved to give a permission number. This can be:
 * * A string (see {@link Intents.FLAGS})
 * * An intents flag
 * * An instance of Intents
 * * An array of IntentsResolvable
 * @typedef {string|number|Intents|IntentsResolvable[]} IntentsResolvable
 */

/**
 * Numeric WebSocket intents. All available properties:
 * * `GUILDS`
 * * `GUILD_MEMBERS`
 * * `GUILD_BANS`
 * * `GUILD_EMOJIS_AND_STICKERS`
 * * `GUILD_INTEGRATIONS`
 * * `GUILD_WEBHOOKS`
 * * `GUILD_INVITES`
 * * `GUILD_VOICE_STATES`
 * * `GUILD_PRESENCES`
 * * `GUILD_MESSAGES`
 * * `GUILD_MESSAGE_REACTIONS`
 * * `GUILD_MESSAGE_TYPING`
 * * `DIRECT_MESSAGES`
 * * `DIRECT_MESSAGE_REACTIONS`
 * * `DIRECT_MESSAGE_TYPING`
 * * `GUILD_SCHEDULED_EVENTS`
 * * `MESSAGE_CONTENT`
 * * `AUTO_MODERATION_CONFIGURATION`
 * * `AUTO_MODERATION_EXECUTION`
 * @type {Object}
 * @see {@link https://discord.com/developers/docs/topics/gateway#list-of-intents}
 */
Intents.FLAGS = {
  GUILDS: GatewayIntentBits.Guilds,
  GUILD_MEMBERS: GatewayIntentBits.GuildMembers,
  GUILD_BANS: GatewayIntentBits.GuildBans,
  GUILD_EMOJIS_AND_STICKERS: GatewayIntentBits.GuildEmojisAndStickers,
  GUILD_INTEGRATIONS: GatewayIntentBits.GuildIntegrations,
  GUILD_WEBHOOKS: GatewayIntentBits.GuildWebhooks,
  GUILD_INVITES: GatewayIntentBits.GuildInvites,
  GUILD_VOICE_STATES: GatewayIntentBits.GuildVoiceStates,
  GUILD_PRESENCES: GatewayIntentBits.GuildPresences,
  GUILD_MESSAGES: GatewayIntentBits.GuildMessages,
  GUILD_MESSAGE_REACTIONS: GatewayIntentBits.GuildMessageReactions,
  GUILD_MESSAGE_TYPING: GatewayIntentBits.GuildMessageTyping,
  DIRECT_MESSAGES: GatewayIntentBits.DirectMessages,
  DIRECT_MESSAGE_REACTIONS: GatewayIntentBits.DirectMessageReactions,
  DIRECT_MESSAGE_TYPING: GatewayIntentBits.DirectMessageTyping,
  GUILD_SCHEDULED_EVENTS: GatewayIntentBits.GuildScheduledEvents,
  MESSAGE_CONTENT: GatewayIntentBits.MessageContent,
  AUTO_MODERATION_CONFIGURATION: 1 << 20,
  AUTO_MODERATION_EXECUTION: 1 << 21,
};

module.exports = Intents;
