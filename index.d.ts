declare module "BreadUrlBuilder" {
    export default BreadUrlBuilder;
    /**
     * Chainable expressive URL Builder for mongoose-bread
     * @class
     */
    class BreadUrlBuilder {
        /**
         * Used as $order argument for {@link sort} method
         * @memberof BreadUrlBuilder
         * @type {symbol}
         * @static
         */
        static ASC: symbol;
        /**
         * Used as $order argument for {@link sort} method
         * @memberof BreadUrlBuilder
         * @type {symbol}
         * @static
         */
        static DESC: symbol;
        /**
         * Set protocol to https://
         * Used as argument for {@link protocol} method
         * @memberof BreadUrlBuilder
         * @type {symbol}
         * @static
         */
        static HTTPS: symbol;
        /**
         * Enforce protocol to http://
         * Used as argument for {@link protocol} method
         * @memberof BreadUrlBuilder
         * @type {symbol}
         * @static
         */
        static FORCE_HTTP: symbol;
        /**
         * Creates an instance of BreadUrlBuilder.
         * @constructor
         * @param {string} $baseUrl - sets the shortest URL to be generated
         */
        constructor($baseUrl: string);
        /**
         * BreadUrlBuilder defaults the URL protocol to https:// unless enforced by BreadUrlBuilder.FORCE_HTTP
         * @param {symbol} $protocol - Must be a value of BreadUrlBuilder.{@link FORCE_HTTP} or BreadUrlBuilder.{@link HTTPS}
         * @returns {BreadUrlBuilder}
         */
        protocol($protocol: symbol): BreadUrlBuilder;
        /**
         * Set the port number of the URL
         * @param {number} $port - Port to be set
         * @returns {BreadUrlBuilder}
         */
        port($port: number): BreadUrlBuilder;
        /**
         * Adds endpoint as fallback value for resets
         * @param {string} $endpoint - will be appended to baseUrl
         * @returns {BreadUrlBuilder}
         */
        endpoint($endpoint: string): BreadUrlBuilder;
        /**
         * Set the URL fragment
         * @param {string} $hash - new fragment value
         * @returns {BreadUrlBuilder}
         */
        hash($hash: string): BreadUrlBuilder;
        /**
         * Reset the URL to baseUrl or baseUrl + endpoint and append $path
         * @param {string} $path - new first path segment
         * @returns {BreadUrlBuilder}
         */
        setPath($path: string): BreadUrlBuilder;
        /**
         * Append provided $path as URL segment
         * @param {string|number} $path - path segment to append
         * @returns {BreadUrlBuilder}
         */
        addPath($path: string | number): BreadUrlBuilder;
        /**
         * Append provided $path as URL segment
         * @param {string|number} $path - path segment to append
         * @returns {BreadUrlBuilder}
         */
        addToPath($path: string | number): BreadUrlBuilder;
        /**
         * Add URL query parameter as key value pair
         * @param {string} $parameter - GET query key
         * @param {string|number} $value - GET query value
         * @returns {BreadUrlBuilder}
         */
        addParameter($parameter: string, $value: string | number): BreadUrlBuilder;
        /**
         * Shorthand for addParameter("lean", $lean)
         * @param {boolean} $lean
         * @returns {BreadUrlBuilder}
         */
        lean($lean?: boolean): BreadUrlBuilder;
        /**
         * Shorthand for addParameter("leanWithId", $leanWithid)
         * @param {boolean} $leanWithId
         * @returns {BreadUrlBuilder}
         */
        leanWithId($leanWithId?: boolean): BreadUrlBuilder;
        /**
         * Shorthand for addParameter("leanWithout_id", $leanWithout_id)
         * @param {boolean} $leanWithout_id
         * @returns {BreadUrlBuilder}
         */
        leanWithout_id($leanWithout_id?: boolean): BreadUrlBuilder;
        /**
         * Shorthand for addParameter("search", $search)
         * @param {string} $search - search term to query the resultset
         * @returns {BreadUrlBuilder}
         */
        search($search: string): BreadUrlBuilder;
        /**
         * Shorthand for addParameter("limit", $limit)
         * @param {string} $limit - max size of resultset
         * @returns {BreadUrlBuilder}
         */
        limit($limit: string): BreadUrlBuilder;
        /**
         * Shorthand for addParameter("page", $page)
         * @param {string} $page - select page in paginated resultset
         * @returns {BreadUrlBuilder}
         */
        page($page: string): BreadUrlBuilder;
        /**
         * Shorthand for addParameter("sort", $sort)
         * @param {string} $sort - add field to sort resultset by
         * @param {symbol} $order - Must be a value of BreadUrlBuilder.{@link ASC} or BreadUrlBuilder.{@link DESC}
         * @returns {BreadUrlBuilder}
         */
        addSort($sort: string, $order: symbol): BreadUrlBuilder;
        /**
         * Shorthand for addParameter("sort", $sort)
         * @param {string} $sort - add field to sort resultset by
         * @param {symbol} $order - Must be a value of BreadUrlBuilder.{@link ASC} or BreadUrlBuilder.{@link DESC}
         * @returns {BreadUrlBuilder}
         */
        addToSort($sort: string, $order: symbol): BreadUrlBuilder;
        /**
         * Resets sort query parameter and replaces it with field name to sort by
         * @param {string} $sort - set field to sort resultset by
         * @param {symbol} $order - Must be a value of BreadUrlBuilder.{@link ASC} or BreadUrlBuilder.{@link DESC}
         * @returns {BreadUrlBuilder}
         */
        sort($sort: string, $order: symbol): BreadUrlBuilder;
        /**
         * Limit the fields of the resultset to provided $fields
         * @param {Array<string>|string} $fields - space separated string will be parsed to Array<string>
         * @returns {BreadUrlBuilder}
         */
        select($fields?: Array<string> | string): BreadUrlBuilder;
        /**
         * Remove the provided $fields from the resultset
         * @param {Array<string>|string} $fields - space separated string will be parsed to Array<string>
         * @returns {BreadUrlBuilder}
         */
        exclude($fields?: Array<string> | string): BreadUrlBuilder;
        /**
         * Shorthand for addParameter("projection", JSON.stringify($projection))
         * @param {Object} $projection - mongoose projection object
         * @returns {BreadUrlBuilder}
         */
        projection($projection: any): BreadUrlBuilder;
        /**
         * Shorthand for addParameter("query", JSON.stringify($query))
         * @param {Object} $query - mongoose query object
         * @returns {BreadUrlBuilder}
         */
        query($query: any): BreadUrlBuilder;
        /**
         * Shorthand for addParameter("populate", JSON.stringify($populate))
         * @param {Object} $populate - mongoose populate object
         * @returns {BreadUrlBuilder}
         */
        populate($populate: any): BreadUrlBuilder;
        /**
         * Adds key for compare query parameter
         * @example url.with('price').greaterThan(500)
         * @param {string} $key
         * @returns {BreadUrlBuilder}
         */
        with($key: string): BreadUrlBuilder;
        /**
         * Removes key from comparison query parameters
         * @example url.without('price')
         * @param {string} $key
         * @returns {BreadUrlBuilder}
         */
        without($key: string): BreadUrlBuilder;
        /**
         * Adds comparison value for preceding with()
         * @param {string|number} $value
         * @returns {BreadUrlBuilder}
         */
        greaterThan($value: string | number): BreadUrlBuilder;
        /**
         * Adds comparison value for preceding with()
         * @param {string|number} $value
         * @returns {BreadUrlBuilder}
         */
        lessThan($value: string | number): BreadUrlBuilder;
        /**
         * Adds comparison value for preceding with()
         * @param {string|number} $value
         * @returns {BreadUrlBuilder}
         */
        greaterThanEqual($value: string | number): BreadUrlBuilder;
        /**
         * Adds comparison value for preceding with()
         * @param {string|number} $value
         * @returns {BreadUrlBuilder}
         */
        lessThanEqual($value: string | number): BreadUrlBuilder;
        /**
         * Adds comparison value for preceding with()
         * @param {string|number} $value
         * @returns {BreadUrlBuilder}
         */
        equalTo($value: string | number): BreadUrlBuilder;
        /**
         * @param {string|number} $value
         * @returns {BreadUrlBuilder}
         */
        gt($value: string | number): BreadUrlBuilder;
        /**
         * @param {string|number} $value
         * @returns {BreadUrlBuilder}
         */
        lt($value: string | number): BreadUrlBuilder;
        /**
         * @param {string|number} $value
         * @returns {BreadUrlBuilder}
         */
        eq($value: string | number): BreadUrlBuilder;
        /**
         * @param {string|number} $value
         * @returns {BreadUrlBuilder}
         */
        ne($value: string | number): BreadUrlBuilder;
        /**
         * @param {string|number} $value
         * @returns {BreadUrlBuilder}
         */
        gte($value: string | number): BreadUrlBuilder;
        /**
         * @param {string|number} $value
         * @returns {BreadUrlBuilder}
         */
        lte($value: string | number): BreadUrlBuilder;
        /**
         * Getter for expressive chaining
         * @example url.with('visitors').to.be.equalTo('attending')
         * @readonly
         * @returns {BreadUrlBuilder}
         */
        readonly get to(): BreadUrlBuilder;
        /**
         * Getter for expressive chaining
         * @example url.with('visitors').to.be.equalTo('attending')
         * @readonly
         * @returns {BreadUrlBuilder}
         */
        readonly get be(): BreadUrlBuilder;
        /**
         * Getter for expressive chaining
         * @example url.with('price').greaterThanEqual(500).and.lessThan(100)
         * @readonly
         * @returns {BreadUrlBuilder}
         */
        readonly get and(): BreadUrlBuilder;
        /**
         * Getter for expressive chaining
         * @example url.with('price').greaterThanEqual(500).but.lessThan(100)
         * @readonly
         * @returns {BreadUrlBuilder}
         */
        readonly get but(): BreadUrlBuilder;
        /**
         * Invert the next comparison
         * @example url.with('visitors').not.equalTo('attending')
         * @readonly
         * @returns {BreadUrlBuilder}
         */
        readonly get not(): BreadUrlBuilder;
        /**
         * Clears endpoint paths parameters and fragment
         * @returns {BreadUrlBuilder}
         */
        resetToBaseUrl(): BreadUrlBuilder;
        /**
         * Clears paths parameters and fragment
         * @returns {BreadUrlBuilder}
         */
        resetToEndpoint(): BreadUrlBuilder;
        /**
         * Clears paths and search parameter
         * @returns {BreadUrlBuilder}
         */
        clearPath(): BreadUrlBuilder;
        /**
         * Clears parameters
         * @returns {BreadUrlBuilder}
         */
        clearParameter(): BreadUrlBuilder;
        /**
         * Clears fragment
         * @returns {BreadUrlBuilder}
         */
        clearHash(): BreadUrlBuilder;
        /**
         * Access to currently set parameter stored for $key
         * @param {string} $key - key to read
         * @returns {string|number|undefined}
         */
        getParameter($key: string): string | number | undefined;
        /**
         * @returns {string|number|undefined}
         */
        getLean(): string | number | undefined;
        /**
         * @returns {string|number|undefined}
         */
        getLeanWithId(): string | number | undefined;
        /**
         * @returns {string|number|undefined}
         */
        getLeanWithout_id(): string | number | undefined;
        /**
         * @returns {string|number|undefined}
         */
        getSearch(): string | number | undefined;
        /**
         * @returns {string|number|undefined}
         */
        getLimit(): string | number | undefined;
        /**
         * @returns {string|number|undefined}
         */
        getPage(): string | number | undefined;
        /**
         * @returns {string|number|undefined}
         */
        getSort(): string | number | undefined;
        /**
         * @returns {string|number|undefined}
         */
        getSelect(): string | number | undefined;
        /**
         * @returns {string|number|undefined}
         */
        getProjection(): string | number | undefined;
        /**
         * @returns {string|number|undefined}
         */
        getQuery(): string | number | undefined;
        /**
         * @returns {string|number|undefined}
         */
        getPopulate(): string | number | undefined;
        /**
         * Gets the configured URL as URL Object
         * @returns {URL}
         */
        getURL(): URL;
        /**
         * Gets the configured URL as URL Object
         * @returns {URL}
         */
        get(): URL;
        /**
         * Gets the configured URL as string
         * @returns {string}
         */
        toUrlString(): string;
        /**
         * Gets the configured URL as string - will be called if used by template strings or json conversion
         * @example `${url}` == url.toString()
         * @returns {string}
         */
        toString(): string;
        #private;
    }
}
