import { QueryAPIInstance, PostQueryAPIInstance } from "@/api";
import store from "@/plugins/store";

export const AnsQueryAPI = {
    /**
     * 
     * @param {string} userUID
     * @returns {Promise<AxiosResponse<any>>}
     */
    getAnswers() {
        const url = `http://localhost/drupal/web/jsonapi/comment/answer?include=field_file`;
        return QueryAPIInstance.get(url);
    },

    getMyAnswers(userUID) {
        const url = `http://localhost/drupal/web/jsonapi/comment/answer?include=field_file&filter[uid.id]=${userUID}`;
        return QueryAPIInstance.get(url);
    },

    async createAnswer(title, body, progressUID, taskUID, files = []) {
        const url = `http://localhost/drupal/web/jsonapi/comment/answer`;
        console.log('Files: ' + files);
        const data = { 
            data: {
                type: "comment--answer",
                attributes: {
                    subject: title,
                    field_name: {
                        value:"field_answer"
                    },
                    entity_type: {
                        value:"node"
                    },
                    comment_body: {
                        value: body,
                        format: "plain_text"
                    }
                },
                relationships: {
                    entity_id: {
                        data: {
                            type: "node--task",
                            id: taskUID
                        }
                    },
                    field_progress: {
                        data: {
                            type: "taxonomy_term--progress",
                            id: progressUID
                        }
                    }
                    // field_file: {
                    //     data: files
                    // }
                }
            }
        };
        PostQueryAPIInstance.defaults.headers['X-CSRF-Token'] = await store.getters['authM/getToken'];
        PostQueryAPIInstance.defaults.headers['Content-Type'] = 'application/vnd.api+json';
        PostQueryAPIInstance.defaults.headers['Accept'] = 'application/vnd.api+json';
        PostQueryAPIInstance.defaults.headers['Authorization'] = `Basic ${await store.getters['authM/getBasicToken']}`;
        console.log(PostQueryAPIInstance.defaults.headers['X-CSRF-Token']);
        console.log(PostQueryAPIInstance.defaults.headers['Authorization']);
        return PostQueryAPIInstance.post(url, data);
    },

    async createFile(fileName, fileBody) {
        const url = `http://localhost/drupal/web/jsonapi/file/file`;
        const data = {
            data: {
                type: "file--file",
                meta: {
                    description: ""
                }
            }
        };
        const data1 = Buffer.from(fileBody, 'binary');
        PostQueryAPIInstance.defaults.headers['Accept'] = 'application/vnd.api+json';
        PostQueryAPIInstance.defaults.headers['Content-Type'] = 'application/octet-stream';
        PostQueryAPIInstance.defaults.headers['Content-Disposition'] = 'file; filename="' + fileName + '"';
        PostQueryAPIInstance.defaults.headers['Authorization'] = `Basic ${await store.getters['authM/getBasicToken']}`;
        PostQueryAPIInstance.defaults.headers['X-CSRF-Token'] = await store.getters['authM/getToken'];
        return PostQueryAPIInstance.post(url, data1);
    },

}