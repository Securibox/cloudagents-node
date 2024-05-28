// let R = require('ramda');
// let Strategy = require('./strategy');
import * as R from 'ramda';
import Strategy from './strategy.js';

/**
 * `BasicStrategy` class.
 *
 * @api public
 */
class BasicStrategy extends Strategy {
    constructor(username, secret) {
        super();

        if (R.isNil(username)) {
            throw new Error('Missing "username"');
        }

        if (R.isNil(secret)) {
            throw new Error('Missing "secret"');
        }

        this.name = 'Basic';
        this.username = username;
        this.secret = secret;
    }

    /**
     * Gets the basic authorization header
     *
     * The authorization header is generated using the username and password
     * in base64 encoding of id and password joined by a colon.
     *
     * @param {Object} [options] Strategy-specific options.
     * @api public
     */
    getAuthorization(options) {
        return `Basic ${Buffer.from(`${this.username}:${this.secret}`).toString('base64')}`;
    }
}

/**
 * Expose `BasicStrategy`.
 */
// module.exports = BasicStrategy;
export default BasicStrategy;