"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaginationData = void 0;
const getPaginationData = ({ page, pageSize, }) => {
    const take = pageSize ?? 10;
    const skip = ((page ?? 1) - 1) * take;
    return { skip, take };
};
exports.getPaginationData = getPaginationData;
