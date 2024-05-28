class Strategy {
    /**
     * Can not create an instance of `Strategy` as it is a Abstract class.
     *
     * This abstract class should be the base class for its subclasses.
     * 
     * @constructor
     * @api public
     */
    constructor() {
        if (new.target === Strategy) {
            throw new Error('Abstract class "AbstractClass" cannot be instantiated directly.');
        }
    }

    /**
     * Get Authorization header
     *
     * This function must be overridden by subclasses. In abstract form, it always
     * throws an exception.
     *
     * @param {Object} [options] Strategy-specific options.
     * @api public
     */
    getAuthorization(options) {
        throw new Error('Strategy#getAuthorization must be overridden by subclass');
    }
}

/**
 * Expose `Strategy`.
 */
// module.exports = Strategy;
export default Strategy;