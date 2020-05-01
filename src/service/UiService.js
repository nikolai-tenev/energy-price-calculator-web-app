import {action, observable} from "mobx";
import {uniqueId} from "lodash/util";
import {BaseService} from "./BaseService";

export class UiService extends BaseService {

    @observable
    snackbars = [];

    @action
    setLoading = (loading) => {
        this.loading = loading;
    };

    @action
    hideSnackbar = (id) => {
        const snackbar = this.snackbars.find((el) => {
            return el.id === id;
        });

        snackbar.open = false;
    };

    @action
    removeSnackbar = (id) => {
        const index = this.snackbars.findIndex((el) => {
            return el.id !== id;
        });

        this.snackbars.splice(index, 1);
    };

    showSuccessSnackbar = (snackbar) => {
        this.showSnackbar({...snackbar, type: "success"});
    };

    showErrorSnackbar = (snackbar) => {
        this.showSnackbar({...snackbar, type: "error"});
    };

    @action
    showSnackbar = (snackbar) => {
        this.snackbars.push({
            ...snackbar,
            open: true,
            id: uniqueId().toString()
        });
    };
}
