import React from 'react';
import ReactDOM from 'react-dom';
import Application from './component/Application';
import {configure} from "mobx";

configure({
    enforceActions: "always"
});

ReactDOM.render(<Application/>,
    document.getElementById('root')
);
