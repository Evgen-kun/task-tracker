/**
 * @classdesc Project class
 * @property {number} id - Project ID
 * @property {string} title - Project title
 * @property {string} body - Project description
 * @property {Array<string>} tasksID - Project tasks ID
 * @property {Map<Task>} tasks - Project tasks
 */

export default class Project {
    id;
    title;
    body;
    tasksID;
    tasks;

    constructor(item) {
        this.id = item?.id ?? null;
        this.title = item?.title ?? null;
        this.body = item?.body ?? null;
        this.tasksID = item?.tasksID ?? [];
        this.tasks = item?.tasks ?? new Map();
    }
}
