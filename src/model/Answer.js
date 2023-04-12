/**
 * @classdesc Answer class
 * @property {string} uid - Answer UID
 * @property {number} id - Answer ID
 * @property {string} title - Answer title
 * @property {string} body - Answer description
 * @property {string} progress - Answer progress
 * @property {User} author - Answer author
 * @property {Array<File>} files - Answer files
 */

export default class Answer {
    uid;
    id;
    title;
    body;
    progress;
    author;
    files;

    constructor(item) {
        this.uid = item?.uid ?? null;
        this.id = item?.id ?? null;
        this.title = item?.title ?? null;
        this.body = item?.body ?? null;
        this.progress = item?.progress ?? null;
        this.author = item?.author ?? null;
        this.files = item?.files ?? [];
    }
}
