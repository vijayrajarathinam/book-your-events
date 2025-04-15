import React from "react";
import { TextEncoder, TextDecoder } from "util";
import "@testing-library/jest-dom";

globalThis.React = React;
globalThis.TextEncoder = TextEncoder;
globalThis.TextDecoder = TextDecoder;
