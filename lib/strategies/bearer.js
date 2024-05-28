// let R = require('ramda');
// let Strategy = require('./strategy');

import * as R from 'ramda';
import Strategy from './strategy.js';

/**
 * `BearerStrategy` class.
 *
 * @api public
 */
class BearerStrategy extends Strategy {
    constructor(token) {
        super();

        if (R.isNil(token)) {
            throw new Error('Missing "token"');
        }

        this.name = 'Bearer';
        this.token = token;
    }

    /**
     * Gets the bearer authorization header
     *
     * The authorization header is generated using the token.
     *
     * @param {Object} [options] Strategy-specific options.
     * @api public
     */
    getAuthorization(options) {
        return `Bearer ${this.token}`;
    }
}

/**
     * Expose `BearerStrategy`.
     */
// module.exports = BearerStrategy;
export default BearerStrategy;