"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toUserLoginCreds = void 0;
const helpers_1 = require("./helpers");
const parseUsername = (name) => {
    if (!name || !(0, helpers_1.isString)(name)) {
        throw new helpers_1.ParseError("Malformatted or missing username " + name);
    }
    return name;
};
const parsePassword = (name) => {
    if (!name || !(0, helpers_1.isString)(name)) {
        throw new helpers_1.ParseError("Malformatted or missing password");
    }
    return name;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toUserLoginCreds = (object) => {
    const newUser = {
        username: parseUsername(object.username),
        password: parsePassword(object.password),
    };
    return newUser;
};
exports.toUserLoginCreds = toUserLoginCreds;
