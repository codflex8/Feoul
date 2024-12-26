"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericResponse = void 0;
class GenericResponse {
    constructor(page, pageSize, count, items) {
        this.page = page;
        this.pageSize = pageSize;
        this.count = count;
        this.items = items;
        const size = pageSize ?? 10;
        this.page = page ? page : 1;
        this.pageSize = Number(size);
        this.count = count;
        this.pages = Math.ceil(count / size);
        this.items = items;
    }
}
exports.GenericResponse = GenericResponse;
