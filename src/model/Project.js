/**
 * @classdesc Project class
 * @property {number} id - Project ID
 * @property {string} title - Project title
 * @property {string} body - Project description
 * @property {Team} team - Project's team
 * @property {Number} inProgressRestriction - Limiting the number of tasks with the status "in progress"
 */

export default class Project {
    id;
    title;
    body;
    team;
    inProgressRestriction;

    constructor(item) {
        this.id = item?.id ?? null;
        this.title = item?.title ?? null;
        this.body = item?.body ?? null;
        this.team = item?.team ?? null;
        this.inProgressRestriction = item?.inProgressRestriction ?? null;
    }
}
