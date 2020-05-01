import React, {Component} from 'react';
import {createMuiTheme, CssBaseline, responsiveFontSizes, withStyles} from "@material-ui/core";
import {ThemeProvider} from "@material-ui/styles";
import {MuiPickersUtilsProvider} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import SnackbarsContainer from "./ui/SnackbarsContainer";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Dashboard from "./price-calculation/Dashboard";

let theme = createMuiTheme({
    overrides: {
        MuiFormControl: {
            root: {
                display: "flex"
            }
        }
    }
});
theme = responsiveFontSizes(theme);

const css = (theme) => ({
    container: {
        padding: theme.spacing(2),
        display: "flex",
        flexDirection: "column",
        [theme.breakpoints.up('md')]: {
            padding: theme.spacing(4),
        },
    },
    contentPaper: {
        padding: theme.spacing(4),
    }
});

@withStyles(css)
class Application extends Component {
    render() {
        const {classes} = this.props;

        return <ThemeProvider theme={theme}>
            <CssBaseline/>
            <MuiPickersUtilsProvider utils={MomentUtils}>
                <Container className={classes.container}>
                    <Paper className={classes.contentPaper}>
                        <Dashboard/>
                    </Paper>
                </Container>
            </MuiPickersUtilsProvider>
            <SnackbarsContainer/>
        </ThemeProvider>;
    }
}

export default Application;
