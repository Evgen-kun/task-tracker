/**
 * @classdesc User class
 * @property {string} uid - User UID
 * @property {number} id - User ID
 * @property {string} name - User name
 * @property {string} email - User email
 * @property {string} pictureID - User picture ID
 * @property {string} picture - User picture link
 * @property {Array<string>} roles - User roles
 */

export default class User {
    uid;
    id;
    name;
    email;
    pictureID;
    picture;
    roles;

    constructor(item) {
        this.uid = item?.uid ?? null;
        this.id = item?.id ?? null;
        this.name = item?.name ?? null;
        this.email = item?.email ?? null;
        this.pictureID = item?.pictureID ?? null;
        this.picture = item?.picture ?? null;
        this.roles = item?.roles ?? [];
    }
}
