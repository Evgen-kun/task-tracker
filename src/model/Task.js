/**
 * @classdesc Task class
 * @property {number} id - Task ID
 * @property {string} title - Task title
 * @property {string} body - Task description
 * @property {string} status - Task status
 * @property {string} progress - Task progress
 * @property {User} author - Task author
 * @property {User} executor - Task executor
 * @property {Array<Answer>} answers - Task answers
 */

export default class Task {
    id;
    title;
    body;
    status;
    progress;
    author;
    executor;
    answers;

    constructor(item) {
        this.id = item?.id ?? null;
        this.title = item?.title ?? null;
        this.body = item?.body ?? null;
        this.status = item?.status ?? null;
        this.progress = item?.progress ?? null;
        this.author = item?.author ?? null;
        this.executor = item?.executor ?? null;
        this.answers = item?.answers ?? [];
    }
}
