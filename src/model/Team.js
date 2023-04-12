/**
 * @classdesc Team class
 * @property {number} id - Team ID
 * @property {string} title - Team title
 * @property {string} body - Team description
 * @property {Array<User>} users - Team users Array
 */

export default class Team {
    id;
    title;
    body;
    users;

    constructor(item) {
        this.id = item?.id ?? null;
        this.title = item?.title ?? null;
        this.body = item?.body ?? null;
        this.users = item?.users ?? [];
    }
}
