'use strict';

const BaseGuildVoiceChannel = require('./BaseGuildVoiceChannel');

/**
 * Represents a guild stage channel on Discord.
 * @extends {BaseGuildVoiceChannel}
 */
class StageChannel extends BaseGuildVoiceChannel {
  _patch(data) {
    super._patch(data);

    if ('topic' in data) {
      /**
       * The topic of the stage channel
       * @type {?string}
       */
      this.topic = data.topic;
    }
  }

  /**
   * The stage instance of this stage channel, if it exists
   * @type {?StageInstance}
   * @readonly
   */
  get stageInstance() {
    return this.guild.stageInstances.cache.find(stageInstance => stageInstance.channelId === this.id) ?? null;
  }

  /**
   * Creates a stage instance associated with this stage channel.
   * @param {StageInstanceCreateOptions} options The options to create the stage instance
   * @returns {Promise<StageInstance>}
   */
  createStageInstance(options) {
    return this.guild.stageInstances.create(this.id, options);
  }
  
}

module.exports = StageChannel;
