import {observer} from "mobx-react";
import React, {Component} from "react";
import Grid from "@material-ui/core/Grid";
import {Field, Form, Formik} from "formik";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import FormLabel from "@material-ui/core/FormLabel";
import {applicationContext} from "../../service/ApplicationContext";
import {KeyboardDatePicker} from "@material-ui/pickers";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import moment from "moment";
import {isEmpty} from "lodash/lang";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import {capitalize} from "lodash/string";
import {pickBy} from "lodash/object";

const service = applicationContext.priceCalculationsService;
const uiService = applicationContext.uiService;

@observer
class Dashboard extends Component {
    componentDidMount() {
        this.loadQueryLog();
    }

    render() {
        let initialValues = {
            periodStart: moment(),
            periodEnd: moment(),
            customerType: "MINING",
            productTypes: {
                "ENERGY": true
            },
        };

        const currentCalculation = service.currentCalculation;
        const queryLog = service.queryLog;

        return <>
            <Formik
                initialValues={initialValues}
                onSubmit={this.handleSubmit}
                validateOnBlur={false}
            >
                {({isSubmitting, handleSubmit}) => (
                    <Form noValidate onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Field name="periodStart">
                                    {({field, form}) => (<KeyboardDatePicker
                                        label="Start period"
                                        value={field.value}
                                        onChange={(date) => {
                                            form.setFieldValue(field.name, date);
                                        }}
                                        format="DD.MM.YYYY"
                                    />)}
                                </Field>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Field name="periodEnd">
                                    {({field, form}) => (<KeyboardDatePicker
                                        label="End period"
                                        value={field.value}
                                        onChange={(date) => {
                                            form.setFieldValue(field.name, date);
                                        }}
                                        format="DD.MM.YYYY"
                                    />)}
                                </Field>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl component="fieldset">
                                    <FormLabel component="legend">Customer type</FormLabel>
                                    <Field name="customerType">
                                        {({field}) => (<RadioGroup name={field.name} value={field.value} onChange={field.onChange}>
                                            <FormControlLabel value="MINING" control={<Radio/>} label="Mining" disabled={isSubmitting}/>
                                            <FormControlLabel value="INDUSTRIAL" control={<Radio/>} label="Industrial" disabled={isSubmitting}/>
                                            <FormControlLabel value="COMMERCIAL" control={<Radio/>} label="Commercial" disabled={isSubmitting}/>
                                        </RadioGroup>)}
                                    </Field>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl component="fieldset">
                                    <FormLabel component="legend">Customer type</FormLabel>
                                    <FormGroup>
                                        <Field name="productTypes[ENERGY]" type="checkbox">
                                            {({field}) => (<FormControlLabel
                                                control={<Checkbox checked={field.checked} onChange={field.onChange} name={field.name}/>}
                                                label="Energy"
                                            />)}
                                        </Field>
                                        <Field name="productTypes[LGC]" type="checkbox">
                                            {({field}) => (<FormControlLabel
                                                control={<Checkbox checked={field.checked} onChange={field.onChange} name={field.name}/>}
                                                label="LGC"
                                            />)}
                                        </Field>
                                    </FormGroup>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Button
                                    type="submit"
                                    color="primary"
                                    variant="contained"
                                    disabled={isSubmitting}
                                >
                                    Calculate
                                </Button>
                            </Grid>
                        </Grid>
                    </Form>
                )}
            </Formik>
            <Grid container spacing={3}>
                {!isEmpty(currentCalculation) && <Grid item xs={12} md={6}>
                    <Typography variant="h3" gutterBottom>Results</Typography>
                    <Typography>Summary price: {currentCalculation.priceTotal.toFixed(2)}</Typography>
                    <List>
                        {!isEmpty(currentCalculation.productPrices) && currentCalculation.productPrices.map(({type, price}) => (
                            <ListItem key={type} alignItems="flex-start">
                                <ListItemText
                                    primary={`Product type: ${type}`}
                                    secondary={`Product price: ${price.toFixed(2)}`}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Grid>}
                {!isEmpty(queryLog) && <Grid item xs={12}>
                    <Typography variant="h3" gutterBottom>Query log</Typography>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Executed at</TableCell>
                                <TableCell>Period start</TableCell>
                                <TableCell>Period end</TableCell>
                                <TableCell>Selected customer</TableCell>
                                <TableCell>Selected products</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {queryLog.map(({id, createdAt, periodStart, periodEnd, customerType, productTypes}) => (
                                <TableRow key={id}>
                                    <TableCell>{new Date(createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell>{new Date(periodStart).toLocaleDateString()}</TableCell>
                                    <TableCell>{new Date(periodEnd).toLocaleDateString()}</TableCell>
                                    <TableCell>{capitalize(customerType)}</TableCell>
                                    <TableCell>{capitalize(productTypes.join(", "))}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Grid>}
            </Grid>
        </>
    }

    handleSubmit = async (values, {setSubmitting}) => {
        try {
            const req = {
                ...values,
                productTypes: Object.keys(pickBy(values.productTypes))
            };

            await service.calculatePrices(req);
            uiService.showSuccessSnackbar({message: "Price successfully calculated!"});
            this.loadQueryLog();
        } catch (e) {
            uiService.showErrorSnackbar({message: "There was a problem while trying to calculate price!"});
            console.error(e);
        } finally {
            setSubmitting(false);
        }
    };

    loadQueryLog = async () => {
        try {
            await service.loadQueryLog();
        } catch (e) {
            uiService.showErrorSnackbar({message: "There was a problem while trying to fetch the query log!"});
            console.error(e);
        }
    }
}

export default Dashboard;
