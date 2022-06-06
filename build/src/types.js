"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipSlot = exports.UserType = void 0;
var UserType;
(function (UserType) {
    UserType[UserType["Normal"] = 0] = "Normal";
    UserType[UserType["Admin"] = 42] = "Admin";
})(UserType = exports.UserType || (exports.UserType = {}));
var EquipSlot;
(function (EquipSlot) {
    EquipSlot["Top"] = "Top";
    EquipSlot["Middle"] = "Middle";
    EquipSlot["Lower"] = "Lower";
    EquipSlot["Garment"] = "Garment";
    EquipSlot["Effect"] = "Effect";
})(EquipSlot = exports.EquipSlot || (exports.EquipSlot = {}));
