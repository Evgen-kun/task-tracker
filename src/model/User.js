/**
 * @classdesc User class
 * @property {string} uid - User UID
 * @property {number} id - User ID
 * @property {string} name - User name
 * @property {string} email - User email
 * @property {Picture} picture - User picture object
 * @property {Array<string>} roles - User roles
 */

export default class User {
    uid;
    id;
    name;
    email;
    picture;
    roles;

    constructor(item) {
        this.uid = item?.uid ?? null;
        this.id = item?.id ?? null;
        this.name = item?.name ?? null;
        this.email = item?.email ?? null;
        this.picture = item?.picture ?? null;
        this.roles = item?.roles ?? [];
    }
}
