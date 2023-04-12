/**
 * @classdesc Picture class
 * @property {string} uid - Picture UID
 * @property {number} id - Picture ID
 * @property {string} url - Picture link
 */

export default class Picture {
    uid;
    id;
    url;

    constructor(item) {
        this.uid = item?.uid ?? null;
        this.id = item?.id ?? null;
        this.url = item?.url ?? '/drupal/web/sites/default/files/inline-images/anonym.png';
    }
}
