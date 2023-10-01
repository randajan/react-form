import React from "react";
import { createRoot } from 'react-dom/client';

import { info, log } from "@randajan/simple-lib/web";
import jet from "@randajan/jet-core";


import "./index.css";

import App from "./App";


const root = document.getElementById("root");
//screen.watch("", _=>root.setAttribute("data-screen", screen.getList().join(" ")), true);

createRoot(root).render(<App/>);

window.jet = jet;