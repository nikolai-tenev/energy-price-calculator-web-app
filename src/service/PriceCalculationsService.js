import {action, observable} from "mobx";
import {BaseService} from "./BaseService";
import {API_URL, PRICE_CALCULATIONS_URL} from "../configuration/api-urls";
import {isPlainObject} from "lodash/lang";

export class PriceCalculationsService extends BaseService {

    resourceUrl;

    /**
     * Current calculation if any.
     * @type {Object}
     */
    @observable
    currentCalculation = {};

    /**
     * Query log items.
     * @type {Array}
     */
    @observable
    queryLog = [];

    /**
     * Sets the url for the resource this service works with.
     * @param applicationContext
     */
    constructor(applicationContext) {
        super(applicationContext);

        this.resourceUrl = PRICE_CALCULATIONS_URL;
    }

    @action
    setCurrentCalculation = (currentCalculation) => {
        this.currentCalculation = currentCalculation;
    };

    @action
    setQueryLog = (queryLog) => {
        this.queryLog = queryLog;
    };

    /**
     * Load query log items.
     * @returns {Promise<void>}
     */
    loadQueryLog = async () => {
        this.setLoading(true);

        try {
            const response = await this.fetchResource(this.resourceUrl);
            const results = await response.json();

            this.setQueryLog(results);
        } finally {
            this.setLoading(false);
        }
    };

    /**
     * Query the price calculation service.
     * @param values
     * @returns {Promise<any>}
     */
    calculatePrices = async (values) => {
        this.setLoading(true);

        try {
            const response = await this.fetchResource(this.resourceUrl, {
                method: "POST",
                body: values,
            });
            const results = await response.json();

            this.setCurrentCalculation(results);
        } finally {
            this.setLoading(false);
        }
    };

    /**
     * Perform http request.
     * @param url
     * @param opts
     * @returns {Promise<Response>}
     */
    fetchResource = async (url, opts = {}) => {
        if (!opts.headers) {
            opts.headers = {};
        }

        if (isPlainObject(opts.body)) {
            if (!opts.headers["Content-Type"]) {
                opts.headers["Content-Type"] = "application/json;charset=utf-8";
            }

            opts.body = JSON.stringify(opts.body);
        }

        opts.mode = 'cors';

        const result = await fetch(`${API_URL}${url}`, opts);

        if (result.ok) {
            return result;
        } else {
            throw new Error(await result.json());
        }
    };
}
