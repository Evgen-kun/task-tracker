/**
 * @classdesc Team class
 * @property {number} id - Team ID
 * @property {string} title - Team title
 * @property {string} body - Team description
 * @property {Array<string>} usersID - Team users UID
 * @property {Map<Object>} users - Team users
 */

export default class Team {
    id;
    title;
    body;
    usersID;
    users;

    constructor(item) {
        this.id = item?.id ?? null;
        this.title = item?.title ?? null;
        this.body = item?.body ?? null;
        this.usersID = item?.usersID ?? [];
        this.users = item?.users ?? new Map();
    }
}
