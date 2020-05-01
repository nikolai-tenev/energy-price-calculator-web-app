import {UiService} from "./UiService";
import {PriceCalculationsService} from "./PriceCalculationsService";

class ApplicationContext {

    constructor() {
        this.uiService = new UiService(this);
        this.priceCalculationsService = new PriceCalculationsService(this);
    }
}

const applicationContext = new ApplicationContext();

export {applicationContext};
