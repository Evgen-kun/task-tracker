/**
 * @classdesc File class
 * @property {string} uid - File UID
 * @property {number} id - File ID
 * @property {string} name - File link
 * @property {string} url - File link
 */

export default class File {
    uid;
    id;
    name;
    url;

    constructor(item) {
        this.uid = item?.uid ?? null;
        this.id = item?.id ?? null;
        this.name = item?.name ?? null;
        this.url = item?.url ?? null;
    }
}
