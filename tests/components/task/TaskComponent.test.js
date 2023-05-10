import { mount } from "@vue/test-utils";
import vuetify from "@/plugins/vuetify";
import store from "@/plugins/store";
import TaskComponent from "@/components/task/TaskComponent.vue";
import { describe, expect, it, vitest } from "vitest";
import Task from "@/model/Task";
import Project from "@/model/Project";
import User from "@/model/User";

window.ResizeObserver =
    window.ResizeObserver ||
    vitest.fn().mockImplementation(() => ({
        disconnect: vitest.fn(),
        observe: vitest.fn(),
        unobserve: vitest.fn(),
    }));

const task = new Task({
    id: '123',
    title: "Test Task",
    body: "Test Task Body",
    status: "Выполняется",
    progress: 10,
    project: new Project({
        id: '1',
        title: "Test Project",
        body: "Test Project Body",
        team: {}
    }),
    difficulty: "Легко",
    beginDate: "2023-04-20T00:00:00+03:00",
    dueDate: "2023-05-10T00:00:00+03:00",
    answers: []
});

const author = new User({
    uid: '13',
    id: 1,
    name: "Test Author",
    picture: { url: "@/assets/logo.png" }
});

const executor = new User({
    uid: '12',
    id: 2,
    name: "Test Executor",
    picture: { url: "@/assets/logo.png" }
});

describe('TaskComponent.vue', () => {
    it('correct line-task view for executor', async () => {
        const wrapper = mount(TaskComponent, {
            props: {
                task: task,
                user: author,
                subtitle: "Автор"
            },
            global: {
                plugins: [store, vuetify],
                mocks: {
                    $route: { name: 'dashboard' },
                },
            },
        });
        const taskCard = wrapper.find('.line-task');
        expect(taskCard.exists()).toBe(true);
        expect(taskCard.find('.open-task').exists()).toBe(false);
        expect(taskCard.find('.line-task-progress-circular').exists()).toBe(true);
        expect(taskCard.find('.line-task-title').exists()).toBe(true);
        expect(taskCard.find('.line-task-user-name').text()).toBe(author.name);
        expect(taskCard.find('.line-task-user-avatar').exists()).toBe(true);
    });

    it('correct open-task view for executor', async () => {
        const wrapper = mount(TaskComponent, {
            props: {
                task: task,
                user: author,
                subtitle: "Автор"
            },
            global: {
                plugins: [store, vuetify],
                mocks: {
                    $route: { name: 'dashboard' },
                },
            },
        });
        await wrapper.find('.line-task').trigger('click');
        const taskCard = wrapper.find('.open-task');
        expect(taskCard.exists()).toBe(true);
        expect(wrapper.find('.line-task').exists()).toBe(false);
        expect(taskCard.find('.open-task-progress-circular').exists()).toBe(true);
        expect(taskCard.find('.open-task-title').exists()).toBe(true);
        expect(taskCard.find('.open-task-subtitle').text()).toBe("Автор");
        expect(taskCard.find('.open-task-user-name').text()).toBe(author.name);
        expect(taskCard.find('.open-task-user-avatar').exists()).toBe(true);
    });

    it('correct line-task view for author', async () => {
        const wrapper = mount(TaskComponent, {
            props: {
                task: task,
                user: executor,
                subtitle: "Исполнитель"
            },
            global: {
                plugins: [store, vuetify],
                mocks: {
                    $route: { name: 'dashboard' },
                },
            },
        });
        const taskCard = wrapper.find('.line-task');
        expect(taskCard.exists()).toBe(true);
        expect(taskCard.find('.open-task').exists()).toBe(false);
        expect(taskCard.find('.line-task-progress-circular').exists()).toBe(true);
        expect(taskCard.find('.line-task-title').exists()).toBe(true);
        expect(taskCard.find('.line-task-user-name').text()).toBe(executor.name);
        expect(taskCard.find('.line-task-user-avatar').exists()).toBe(true);
    });

    it('correct open-task view for author', async () => {
        const wrapper = mount(TaskComponent, {
            props: {
                task: task,
                user: executor,
                subtitle: "Исполнитель"
            },
            global: {
                plugins: [store, vuetify],
                mocks: {
                    $route: { name: 'dashboard' },
                },
            },
        });
        await wrapper.find('.line-task').trigger('click');
        const taskCard = wrapper.find('.open-task');
        expect(taskCard.exists()).toBe(true);
        expect(wrapper.find('.line-task').exists()).toBe(false);
        expect(taskCard.find('.open-task-progress-circular').exists()).toBe(true);
        expect(taskCard.find('.open-task-title').exists()).toBe(true);
        expect(taskCard.find('.open-task-subtitle').text()).toBe("Исполнитель");
        expect(taskCard.find('.open-task-user-name').text()).toBe(executor.name);
        expect(taskCard.find('.open-task-user-avatar').exists()).toBe(true);
    });
});