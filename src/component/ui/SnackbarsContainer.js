import Box from "@material-ui/core/Box";
import Snackbar from "@material-ui/core/Snackbar/Snackbar";
import {SNACKBAR_DURATION, SNACKBAR_POSITION} from "../../configuration/ui";
import Alert from "@material-ui/lab/Alert/Alert";
import React, {Component} from "react";
import {applicationContext} from "../../service/ApplicationContext";
import {observer} from "mobx-react";

const uiService = applicationContext.uiService;

@observer
class SnackbarsContainer extends Component {
    render() {
        return <Box>
            {uiService.snackbars.map(snackbar => {
                const onExited = () => uiService.removeSnackbar(snackbar.id);
                const onClose = () => uiService.hideSnackbar(snackbar.id);

                return <Snackbar
                    key={snackbar.id}
                    anchorOrigin={SNACKBAR_POSITION}
                    open={snackbar.open}
                    autoHideDuration={SNACKBAR_DURATION}
                    onClose={onClose}
                    onExited={onExited}
                >
                    <Alert elevation={6} variant="filled" onClose={onClose} severity={snackbar.type}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            })}
        </Box>
    }
}

export default SnackbarsContainer;
