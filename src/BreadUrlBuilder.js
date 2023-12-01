const SelectExcludeErrorMessage = "Calls to select() and exclude() are exclusive - make sure to call only select() or exclude()";
const removeNullAndUndefinedStrings = ([k, v]) => k != "undefined" && k != "null" && v != "undefined" && v != "null";
const removeLeadingAndTrailingSlash = (s) => String(s).replace(/^\/+|\/+$/g, "");
const { isArray } = Array;

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
  static ASC = Symbol("asc");
  /**
   * Used as $order argument for {@link sort} method
   * @memberof BreadUrlBuilder
   * @type {symbol}
   * @static
   */
  static DESC = Symbol("desc");
  /**
   * Set protocol to https://
   * Used as argument for {@link protocol} method
   * @memberof BreadUrlBuilder
   * @type {symbol}
   * @static
   */
  static HTTPS = Symbol("https");
  /**
   * Enforce protocol to http://
   * Used as argument for {@link protocol} method
   * @memberof BreadUrlBuilder
   * @type {symbol}
   * @static
   */
  static FORCE_HTTP = Symbol("http");

  #baseUrl;
  #protocol = BreadUrlBuilder.HTTPS;
  #endpoint = "";
  #hash = "";
  #paths = new Array();
  #parameters = new Map();

  #_selectCalled = false;
  #_excludeCalled = false;
  #_compare = {
    value: undefined,
    history: new Set(),
    invert: false,
  };
  /**
   * Creates an instance of BreadUrlBuilder.
   * @constructor
   * @param {string} $baseUrl - sets the shortest URL to be generated
   */
  constructor($baseUrl) {
    if (typeof $baseUrl != "string")
      throw new Error("invalid argument - expected String - @BreadUrlBuilder()");
    this.#baseUrl = this.#extractHash($baseUrl);
  }
  /**
   * Extract the fragment from URL and store it in private field #hash
   * @private
   * @method
   * @param {string} $url - URL to extract fragment from
   * @returns {string} - the $url without fragment
   */
  #extractHash($url) {
    if (!$url.includes("#")) return $url;
    return $url.replace(/#.*$/, (hash) => {
      this.#hash = hash;
      return "";
    });
  }
  /**
   * Mutates the protocol of baseUrl
   * @private
   * @method
   */
  #applyProtocol() {
    const baseUrl = new URL(this.#baseUrl);
    if (!baseUrl.protocol.includes("https")) {
      const forceHTTP = this.#protocol === BreadUrlBuilder.FORCE_HTTP
      const newProtocol = forceHTTP ? "http:" : "https:";
      this.#baseUrl = baseUrl.href.replace(baseUrl.protocol, newProtocol);
    }
  }
  /**
   * Adds comparision key value pair to parameters
   * @private
   * @method
   * @returns {BreadUrlBuilder}
   */
  #addCompare($value, $options) {
    if (!this.#_compare.value) return this;
    this.#_compare.invert = false;
    this.#parameters.set(
      `${this.#_compare.value}[${$options.comparison}]`,
      $value
    );
    return this;
  }
  /**
   * BreadUrlBuilder defaults the URL protocol to https:// unless enforced by BreadUrlBuilder.FORCE_HTTP
   * @param {symbol} $protocol - Must be a value of BreadUrlBuilder.{@link FORCE_HTTP} or BreadUrlBuilder.{@link HTTPS}
   * @returns {BreadUrlBuilder}
   */
  protocol($protocol) {
    const allowedProtocols = [
      BreadUrlBuilder.FORCE_HTTP,
      BreadUrlBuilder.HTTPS,
    ];
    if (!allowedProtocols.includes($protocol))
      throw new Error(
        `invalid argument - expected BreadUrlBuilder.FORCE_HTTP|BreadUrlBuilder.HTTPS - @protocol()`
      );
    this.#protocol = $protocol;
    return this;
  }
  /**
   * Set the port number of the URL
   * @param {number} $port - Port to be set
   * @returns {BreadUrlBuilder}
   */
  port($port) {
    if (typeof $port != "number")
      throw new Error("invalid argument - expected Number - @port()");
    const baseUrl = new URL(this.#baseUrl);
    if ($port != Number(baseUrl.port)) {
      this.#baseUrl = baseUrl.href.replace(
        baseUrl.host,
        `${baseUrl.hostname}:${$port}`
      );
    }
    return this;
  }
  /**
   * Adds endpoint as fallback value for resets
   * @param {string} $endpoint - will be appended to baseUrl
   * @returns {BreadUrlBuilder}
   */
  endpoint($endpoint) {
    if (typeof $endpoint != "string")
      throw new Error("invalid argument - expected String - @endpoint()");
    this.#endpoint = this.#extractHash($endpoint);
    return this;
  }
  /**
   * Set the URL fragment
   * @param {string} $hash - new fragment value
   * @returns {BreadUrlBuilder}
   */
  hash($hash) {
    if (typeof $hash != "string")
      throw new Error("invalid argument - expected String - @hash()");
    this.#hash = $hash.startsWith("#") ? $hash : `#${$hash}`;
    return this;
  }
  /**
   * Reset the URL to baseUrl or baseUrl + endpoint and append $path
   * @param {string} $path - new first path segment
   * @returns {BreadUrlBuilder}
   */
  setPath($path) {
    return this.clearPath().addPath($path)
  }
  /**
   * Append provided $path as URL segment
   * @param {string|number} $path - path segment to append
   * @returns {BreadUrlBuilder}
   */
  addPath($path) {
    if (!$path.toString)
      throw new Error("invalid argument - expected stringifyable - @addPath()");
    this.#paths.push($path);
    return this;
  }
  /**
   * Append provided $path as URL segment
   * @param {string|number} $path - path segment to append
   * @returns {BreadUrlBuilder}
   */
  addToPath($path) {
    return this.addPath($path);
  }
  /**
   * Add URL query parameter as key value pair
   * @param {string} $parameter - GET query key 
   * @param {string|number} $value - GET query value 
   * @returns {BreadUrlBuilder}
   */
  addParameter($parameter, $value) {
    if (!$parameter || !$value) return this;
    if (
      typeof $parameter != "string" ||
      !["string", "number"].includes(typeof $value)
    )
      throw new Error("invalid argument - expected String - @addParameter()");
    this.#parameters.set($parameter, $value);
    return this;
  }
  /**
   * Shorthand for addParameter("lean", $lean)
   * @param {boolean} $lean 
   * @returns {BreadUrlBuilder}
   */
  lean($lean = true) {
    this.#parameters.set("lean", !!$lean);
    return this;
  }
  /**
   * Shorthand for addParameter("leanWithId", $leanWithid)
   * @param {boolean} $leanWithId
   * @returns {BreadUrlBuilder}
   */
  leanWithId($leanWithId = true) {
    this.#parameters.set("leanWithId", !!$leanWithId);
    return this;
  }
  /**
   * Shorthand for addParameter("leanWithout_id", $leanWithout_id)
   * @param {boolean} $leanWithout_id
   * @returns {BreadUrlBuilder}
   */
  leanWithout_id($leanWithout_id = true) {
    this.#parameters.set("leanWithout_id", !!$leanWithout_id);
    return this;
  }
  /**
   * Shorthand for addParameter("search", $search)
   * @param {string} $search - search term to query the resultset
   * @returns {BreadUrlBuilder}
   */
  search($search) {
    if (!$search) {
      this.#parameters.delete("search");
      return this;
    }
    if (typeof $search != "string")
      throw new Error("invalid argument - expected String - @search()");
    this.#parameters.set("search", $search);
    return this;
  }
  /**
   * Shorthand for addParameter("limit", $limit)
   * @param {string} $limit - max size of resultset
   * @returns {BreadUrlBuilder}
   */
  limit($limit) {
    if (typeof $limit != "number")
      throw new Error("invalid argument - expected Number - @limit()");
    this.#parameters.set("limit", $limit);
    return this;
  }
  /**
   * Shorthand for addParameter("page", $page)
   * @param {string} $page - select page in paginated resultset
   * @returns {BreadUrlBuilder}
   */
  page($page) {
    if (typeof $page != "number")
      throw new Error("invalid argument - expected Number - @page()");
    this.#parameters.set("page", $page);
    return this;
  }
  /**
   * Shorthand for addParameter("sort", $sort)
   * @param {string} $sort - add field to sort resultset by
   * @param {symbol} $order - Must be a value of BreadUrlBuilder.{@link ASC} or BreadUrlBuilder.{@link DESC}
   * @returns {BreadUrlBuilder}
   */
  addSort($sort, $order) {
    if (!this.#parameters.has("sort"))
      return this.sort($sort, $order);

    const { ASC, DESC } = BreadUrlBuilder;
    if (!$sort)
      throw new Error("invalid argument 'sort' - expected String - @addSort()");

    if (!($order == ASC || $order == DESC))
      throw new Error("invalid argument 'order' - expected BreadUrlBuilder.ASC|BreadUrlBuilder.DESC - @addSort()");

    const existingSort = new Set(this.#parameters.get("sort").split(" "))

    $sort = $sort
      .trim()
      .split(" ")
      .map(s => s.replace(/-/g, ""))

    $sort.forEach(s => {
      existingSort.delete(s)
      existingSort.delete(`-${s}`)
    })

    $sort = $sort.map(s => ($order === DESC) ? `-${s}` : s)
    const uniqueFields = [...new Set($sort)]
    this.#parameters.set("sort", [...existingSort, ...uniqueFields].join(" "));
    return this;
  }
  /**
   * Shorthand for addParameter("sort", $sort)
   * @param {string} $sort - add field to sort resultset by
   * @param {symbol} $order - Must be a value of BreadUrlBuilder.{@link ASC} or BreadUrlBuilder.{@link DESC}
   * @returns {BreadUrlBuilder}
   */
  addToSort($sort, $order) {
    return this.addSort($sort, $order)
  }
  /**
   * Resets sort query parameter and replaces it with field name to sort by 
   * @param {string} $sort - set field to sort resultset by
   * @param {symbol} $order - Must be a value of BreadUrlBuilder.{@link ASC} or BreadUrlBuilder.{@link DESC}
   * @returns {BreadUrlBuilder}
   */
  sort($sort, $order) {
    const { ASC, DESC } = BreadUrlBuilder;

    if (!$sort)
      throw new Error("invalid argument 'sort' - expected String - @sort()");

    if (!($order == ASC || $order == DESC))
      throw new Error("invalid argument 'order' - expected BreadUrlBuilder.ASC|BreadUrlBuilder.DESC - @sort()");

    $sort = $sort
      .trim()
      .split(" ")
      .map(s => s.replace(/-/g, ""))
      .map(s => ($order === DESC) ? `-${s}` : s)

    const uniqueFields = [...new Set($sort)]
    this.#parameters.set("sort", uniqueFields.join(" "));

    return this;
  }
  /**
   * Limit the fields of the resultset to provided $fields
   * @param {Array<string>|string} $fields - space separated string will be parsed to Array<string>
   * @returns {BreadUrlBuilder}
   */
  select($fields = "") {
    if (this.#_excludeCalled) throw new Error(SelectExcludeErrorMessage);
    this.#_selectCalled = true;
    if (typeof $fields === "string") $fields = $fields.split(" ");
    if (!isArray($fields))
      throw new Error("invalid argument - expected String|Array - @select()");
    $fields = $fields.map((field) => field.replace(/-/g, "")).join(" ");
    this.#parameters.set("select", $fields);
    return this;
  }
  /**
   * Remove the provided $fields from the resultset
   * @param {Array<string>|string} $fields - space separated string will be parsed to Array<string>
   * @returns {BreadUrlBuilder}
   */
  exclude($fields = "") {
    if (this.#_selectCalled) throw new Error(SelectExcludeErrorMessage);
    this.#_excludeCalled = true;
    if (typeof $fields === "string") $fields = $fields.split(" ");
    if (!isArray($fields))
      throw new Error("invalid argument - expected String|Array - @exclude()");
    $fields = $fields.map((field) => `-${(field.replace(/-/g), "")}`).join(" ");
    this.#parameters.set("select", $fields);
    return this;
  }
  /**
   * Shorthand for addParameter("projection", JSON.stringify($projection))
   * @param {Object} $projection - mongoose projection object
   * @returns {BreadUrlBuilder}
   */
  projection($projection) {
    if (typeof $projection != "object")
      throw new Error("invalid argument - expected Object - @projection()");
    this.#parameters.set("projection", JSON.stringify($projection));
    return this;
  }
  /**
   * Shorthand for addParameter("query", JSON.stringify($query))
   * @param {Object} $query - mongoose query object
   * @returns {BreadUrlBuilder}
   */
  query($query) {
    if (typeof $query != "object")
      throw new Error("invalid argument - expected Object - @query()");
    this.#parameters.set("query", JSON.stringify($query));
    return this;
  }
  /**
   * Shorthand for addParameter("populate", JSON.stringify($populate))
   * @param {Object} $populate - mongoose populate object
   * @returns {BreadUrlBuilder}
   */
  populate($populate) {
    if (!(typeof $populate == "object" || isArray($populate)))
      throw new Error("invalid argument - expected Object|Array - @populate()");
    this.#parameters.set("populate", JSON.stringify($populate));
    return this;
  }
  // --------- COMPARE FNS -------------
  /**
   * Adds key for compare query parameter
   * @example url.with('price').greaterThan(500)
   * @param {string} $key 
   * @returns {BreadUrlBuilder}
   */
  with($key) {
    if (typeof $key != "string")
      throw new Error("invalid argument - expected String - @with()");
    this.#_compare.history.add($key);
    this.#_compare.value = $key;
    return this;
  }
  /**
   * Removes key from comparison query parameters
   * @example url.without('price')
   * @param {string} $key 
   * @returns {BreadUrlBuilder}
   */
  without($key) {
    if (!(this.#parameters.has($key) || this.#_compare.history.has($key)))
      return this;
    if (typeof $key != "string")
      throw new Error("invalid argument - expected String - @withOut()");
    const params = Array.from(this.#parameters).filter(
      ([key]) => !key.startsWith($key)
    );
    this.#parameters = new URLSearchParams(params);
    this.#_compare.history.delete($key);
    return this;
  }
  /**
   * Adds comparison value for preceding with()
   * @param {string|number} $value 
   * @returns {BreadUrlBuilder}
   */
  greaterThan($value) {
    return this.#addCompare($value, {
      at: "greaterThan",
      comparison: "gt",
    });
  }
  /**
   * Adds comparison value for preceding with()
   * @param {string|number} $value 
   * @returns {BreadUrlBuilder}
   */
  lessThan($value) {
    return this.#addCompare($value, {
      at: "lessThan",
      comparison: "lt",
    });
  }
  /**
   * Adds comparison value for preceding with()
   * @param {string|number} $value 
   * @returns {BreadUrlBuilder}
   */
  greaterThanEqual($value) {
    return this.#addCompare($value, {
      at: "greaterThanEqual",
      comparison: "gte",
    });
  }
  /**
   * Adds comparison value for preceding with()
   * @param {string|number} $value 
   * @returns {BreadUrlBuilder}
   */
  lessThanEqual($value) {
    return this.#addCompare($value, {
      at: "lessThanEqual",
      comparison: "lte",
    });
  }
  /**
   * Adds comparison value for preceding with()
   * @param {string|number} $value 
   * @returns {BreadUrlBuilder}
   */
  equalTo($value) {
    return this.#addCompare($value, {
      at: "equalTo",
      comparison: this.#_compare.invert ? "ne" : "eq",
    });
  }
  /**
   * @param {string|number} $value 
   * @returns {BreadUrlBuilder}
   */
  gt($value) {
    return this.greaterThan($value);
  }
  /**
   * @param {string|number} $value 
   * @returns {BreadUrlBuilder}
   */
  lt($value) {
    return this.lessThan($value);
  }
  /**
   * @param {string|number} $value 
   * @returns {BreadUrlBuilder}
   */
  eq($value) {
    return this.equalTo($value);
  }
  /**
   * @param {string|number} $value 
   * @returns {BreadUrlBuilder}
   */
  ne($value) {
    return this.not.equalTo($value);
  }
  /**
   * @param {string|number} $value 
   * @returns {BreadUrlBuilder}
   */
  gte($value) {
    return this.greaterThanEqual($value);
  }
  /**
   * @param {string|number} $value 
   * @returns {BreadUrlBuilder}
   */
  lte($value) {
    return this.lessThanEqual($value);
  }
  /**
   * Getter for expressive chaining
   * @example url.with('visitors').to.be.equalTo('attending')
   * @readonly
   * @returns {BreadUrlBuilder}
   */
  get to() {
    return this;
  }
  /**
   * Getter for expressive chaining
   * @example url.with('visitors').to.be.equalTo('attending')
   * @readonly
   * @returns {BreadUrlBuilder}
   */
  get be() {
    return this;
  }
  /**
   * Getter for expressive chaining
   * @example url.with('price').greaterThanEqual(500).and.lessThan(100)
   * @readonly
   * @returns {BreadUrlBuilder}
   */
  get and() {
    return this;
  }
  /**
   * Getter for expressive chaining
   * @example url.with('price').greaterThanEqual(500).but.lessThan(100)
   * @readonly
   * @returns {BreadUrlBuilder}
   */
  get but() {
    return this;
  }
  /**
   * Invert the next comparison
   * @example url.with('visitors').not.equalTo('attending')
   * @readonly
   * @returns {BreadUrlBuilder}
   */
  get not() {
    this.#_compare.invert = !this.#_compare.invert;
    return this;
  }
  // --------- RESET & CLEAR  -----------
  /**
   * Clears endpoint paths parameters and fragment
   * @returns {BreadUrlBuilder}
   */
  resetToBaseUrl() {
    this.#endpoint = "";
    this.#paths = new Array();
    this.#parameters = new Map();
    this.#hash = "";
    return this;
  }
  /**
   * Clears paths parameters and fragment
   * @returns {BreadUrlBuilder}
   */
  resetToEndpoint() {
    this.#paths = new Array();
    this.#parameters = new Map();
    this.#hash = "";
    return this;
  }
  /**
   * Clears paths and search parameter
   * @returns {BreadUrlBuilder}
   */
  clearPath() {
    this.#paths = new Array();
    this.search(false)
    return this;
  }
  /**
   * Clears parameters
   * @returns {BreadUrlBuilder}
   */
  clearParameter() {
    this.#parameters = new Map();
    return this;
  }
  /**
   * Clears fragment
   * @returns {BreadUrlBuilder}
   */
  clearHash() {
    this.#hash = "";
    return this;
  }
  // --------- GETTER  -----------
  /**
   * Access to currently set parameter stored for $key
   * @param {string} $key - key to read
   * @returns {string|number|undefined}
   */
  getParameter($key) { return this.#parameters.get($key) }
  /**
   * @returns {string|number|undefined}
   */
  getLean() { return this.#parameters.get("lean") }
  /**
   * @returns {string|number|undefined}
   */
  getLeanWithId() { return this.#parameters.get("leanWithId") }
  /**
   * @returns {string|number|undefined}
   */
  getLeanWithout_id() { return this.#parameters.get("leanWithout_id") }
  /**
   * @returns {string|number|undefined}
   */
  getSearch() { return this.#parameters.get("search") }
  /**
   * @returns {string|number|undefined}
   */
  getLimit() { return this.#parameters.get("limit") }
  /**
   * @returns {string|number|undefined}
   */
  getPage() { return this.#parameters.get("page") }
  /**
   * @returns {string|number|undefined}
   */
  getSort() { return this.#parameters.get("sort") }
  /**
   * @returns {string|number|undefined}
   */
  getSelect() { return this.#parameters.get("select") }
  /**
   * @returns {string|number|undefined}
   */
  getProjection() { return this.#parameters.get("projection") }
  /**
   * @returns {string|number|undefined}
   */
  getQuery() { return this.#parameters.get("query") }
  /**
   * @returns {string|number|undefined}
   */
  getPopulate() { return this.#parameters.get("populate") }
  /**
   * Gets the configured URL as URL Object
   * @returns {URL}
   */
  getURL() { return this.get(); }
  /**
   * Gets the configured URL as URL Object
   * @returns {URL}
   */
  get() {
    this.#applyProtocol();
    const endpoint = [this.#endpoint, ...this.#paths]
      .map(removeLeadingAndTrailingSlash)
      .join("/");
    const url = new URL(endpoint, this.#baseUrl);
    Array.from(this.#parameters)
      .filter(removeNullAndUndefinedStrings)
      .forEach(([key, value]) => url.searchParams.append(key, value));

    return new URL(url.href.concat(this.#hash));
  }
  /**
   * Gets the configured URL as string
   * @returns {string}
   */
  toUrlString() {
    return this.toString();
  }
  /**
   * Gets the configured URL as string - will be called if used by template strings or json conversion
   * @example `${url}` == url.toString()
   * @returns {string}
   */
  toString() {
    return this.get().href;
  }
}

export default BreadUrlBuilder