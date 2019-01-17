/**
 * Creates an instance of `Strategy`.
 *
 * @constructor
 * @api public
 */
function Strategy() {
}

/**
 * Get Authorization header
 *
 * This function must be overridden by subclasses.  In abstract form, it always
 * throws an exception.
 *
 * @param {Object} [options] Strategy-specific options.
 * @api public
 */
Strategy.prototype.getAuthorization = function(options) {
    throw new Error('Strategy#getAuthorization must be overridden by subclass');
};

/**
 * Expose `Strategy`.
 */
module.exports = Strategy;