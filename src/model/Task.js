/**
 * @classdesc Task class
 * @property {number} id - Task ID
 * @property {string} title - Task title
 * @property {string} body - Task description
 * @property {string} status - Task status
 * @property {string} progress - Task progress
 * @property {string} authorUID - Task author UID
 * @property {string} author - Task author name
 * @property {string} authorPictureID - ID of author's picture
 * @property {string} authorPicture - Link to author's picture
 * @property {Array<Object>} answers - Task answers
 */

export default class Task {
    id;
    title;
    body;
    status;
    progress;
    authorUID;
    author;
    authorPictureID;
    authorPicture;
    answers;

    constructor(item) {
        this.id = item?.id ?? null;
        this.title = item?.title ?? null;
        this.body = item?.body ?? null;
        this.status = item?.status ?? null;
        this.progress = item?.progress ?? null;
        this.authorUID = item?.authorUID ?? null;
        this.author = item?.author ?? null;
        this.authorPictureID = item?.authorPictureID ?? null;
        this.authorPicture = item?.authorPicture ?? null;
        this.answers = item?.answers ?? [];
    }
}
