/**
 * @classdesc Project class
 * @property {number} id - Project ID
 * @property {string} title - Project title
 * @property {string} body - Project description
 * @property {Array<Task>} tasks - Project tasks array
 */

export default class Project {
    id;
    title;
    body;
    tasks;

    constructor(item) {
        this.id = item?.id ?? null;
        this.title = item?.title ?? null;
        this.body = item?.body ?? null;
        this.tasks = item?.tasks ?? [];
    }
}
