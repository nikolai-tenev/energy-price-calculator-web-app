import {action, observable} from "mobx";

export class BaseService {

    /**
     * Holds reference to the application context. Used to access other services, etc.
     */
    applicationContext;

    /**
     * Whether or not something is loading.
     * @type {boolean}
     */
    @observable
    loading = false;

    constructor(applicationContext) {
        this.applicationContext = applicationContext;
    }

    /**
     * Constructors can't be async, so here we are...
     * @returns {Promise<void>}
     */
    async init() {}

    @action
    setLoading = (loading) => {
        this.loading = loading;
    };
}
