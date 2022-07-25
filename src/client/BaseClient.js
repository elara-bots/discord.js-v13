'use strict';

const EventEmitter = require('node:events');
const { REST } = require("@discordjs/rest");
const Options = require('../util/Options');
const Util = require('../util/Util');

/**
 * The base class for all clients.
 * @extends {EventEmitter}
 */
class BaseClient extends EventEmitter {
  constructor(options = {}) {
    super();

    /**
     * The options the client was instantiated with
     * @type {ClientOptions}
     */
    this.options = Util.mergeDefault(Options.createDefault(), options);

    /**
     * The REST manager of the client
     * @type {REST}
     * @private
     */
    this.rest = new REST({
      offset: this.options.restTimeOffset,
      timeout: this.options.restRequestTimeout,
      globalRequestsPerSecond: this.options.restGlobalRateLimit,
      handlerSweepInterval: this.options.restSweepInterval,
      retries: this.options.retryLimit,
      cdn: this.options.http?.cdn,
      agent: this.options.http.agent,
      headers: this.options.http?.headers,
      version: this.options.http?.version,
      api: this.options.http?.api,
      invalidRequestWarningInterval: this.options.invalidRequestWarningInterval,
      userAgentAppendix: this.options.userAgentSuffix,
      rejectOnRateLimit: this.options.rejectOnRateLimit
    });
  }


  get api() {
    return this.rest;
  }

  /**
   * Destroys all assets used by the base client.
   * @returns {void}
   */
  destroy() {
    this.rest.requestManager.clearHashSweeper();
    this.rest.requestManager.clearHandlerSweeper();
  }

  /**
   * Increments max listeners by one, if they are not zero.
   * @private
   */
  incrementMaxListeners() {
    const maxListeners = this.getMaxListeners();
    if (maxListeners !== 0) {
      this.setMaxListeners(maxListeners + 1);
    }
  }

  /**
   * Decrements max listeners by one, if they are not zero.
   * @private
   */
  decrementMaxListeners() {
    const maxListeners = this.getMaxListeners();
    if (maxListeners !== 0) {
      this.setMaxListeners(maxListeners - 1);
    }
  }

  toJSON(...props) {
    return Util.flatten(this, { domain: false }, ...props);
  }
}

module.exports = BaseClient;

/**
 * Emitted for general debugging information.
 * @event BaseClient#debug
 * @param {string} info The debug information
 */
