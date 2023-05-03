import { mount } from "@vue/test-utils";
import vuetify from "@/plugins/vuetify";
import store from "@/plugins/store";
import ProjectComponent from "@/components/projects/ProjectComponent";
import { describe, expect, it } from "vitest";
import Project from "@/model/Project";
import User from "@/model/User";
import Team from "@/model/Team";


const user = new User({ uid: '123', name: "Test John", roles: [] });

const allTeams = [
    new Team({ id: '1', title: "Team 1", body: "Team 1 body", users: [] }),
    new Team({ id: '2', title: "Team 2", body: "Team 2 body", users: [user] }),
    new Team({ id: '3', title: "Team 3", body: "Team 3 body", users: [] })
];

const project = new Project({
    id: '123',
    title: "Test Project",
    body: "Test Body",
    team: allTeams[1],
    inProgressRestriction: 5
});

describe('ProjectComponent.vue', () => {
    

    it('correct project-card view', async () => {
        const wrapper = mount(ProjectComponent, {
            props: {
                project: project,
                allTeams: allTeams,
                currentUser: new User({ uid: '123', name: "Test John", roles: ['manager'] })
            },
            global: {
                plugins: [store, vuetify],
            },
        });

        const projectCard = wrapper.find('.project-card');
        expect(projectCard.exists()).toBe(true);
        expect(projectCard.find('.project-card-title').text()).toBe(project.title);
        expect(projectCard.find('.project-card-subtitle').text()).toBe(project.body);
        expect(projectCard.find('.project-card-menu-btn').exists()).toBe(true);
    });

    it('correct project-card-menu-btn view for administrator', async () => {
        const wrapper = mount(ProjectComponent, {
            props: {
                project: project,
                allTeams: allTeams,
                currentUser: new User({ uid: '123', name: "Test John", roles: ['administrator'] })
            },
            global: {
                plugins: [store, vuetify],
            },
        });

        expect(wrapper.find('.project-card-menu-btn').exists()).toBeTruthy();
        expect(wrapper.find('.project-card-menu-btn').isDisabled()).toBeFalsy();
        // expect(wrapper.find('.project-card-menu-list-item-edit').exists()).toBeFalsy();
        // await wrapper.find('.project-card-menu-btn').trigger('click');
        // expect(wrapper.find('.project-card-menu-list-item-edit').exists()).toBeTruthy();
    });

    it('correct project-card-menu-btn view for manager', async () => {
        const wrapper = mount(ProjectComponent, {
            props: {
                project: project,
                allTeams: allTeams,
                currentUser: new User({ uid: '123', name: "Test John", roles: ['manager'] })
            },
            global: {
                plugins: [store, vuetify],
            },
        });

        expect(wrapper.find('.project-card-menu-btn').exists()).toBeTruthy();
        expect(wrapper.find('.project-card-menu-btn').isDisabled()).toBeFalsy();
    });

    it('correct project-card-menu-btn view for developer', async () => {
        const wrapper = mount(ProjectComponent, {
            props: {
                project: project,
                allTeams: allTeams,
                currentUser: new User({ uid: '123', name: "Test John", roles: ['developer'] })
            },
            global: {
                plugins: [store, vuetify],
            },
        });

        expect(wrapper.find('.project-card-menu-btn').exists()).toBeFalsy();
    });
});