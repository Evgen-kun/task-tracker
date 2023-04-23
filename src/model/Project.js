/**
 * @classdesc Project class
 * @property {number} id - Project ID
 * @property {string} title - Project title
 * @property {string} body - Project description
 * @property {Team} team - Project's team
 */

export default class Project {
    id;
    title;
    body;
    team;

    constructor(item) {
        this.id = item?.id ?? null;
        this.title = item?.title ?? null;
        this.body = item?.body ?? null;
        this.team = item?.team ?? null;
    }
}
