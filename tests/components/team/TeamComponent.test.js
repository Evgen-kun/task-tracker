import { mount } from "@vue/test-utils";
import vuetify from "@/plugins/vuetify";
import store from "@/plugins/store";
import TeamComponent from "@/components/team/TeamComponent";
import { describe, expect, it } from "vitest";
import Team from "@/model/Team";
import User from "@/model/User";


const allUsers = [
    new User({ uid: '1', name: "Test John", roles: ['developer'] }),
    new User({ uid: '2', name: "Test John 2", roles: ['developer'] }),
    new User({ uid: '3', name: "Test John 3", roles: ['manager'] }),
];

const team = new Team({
    id: '123',
    title: "Test Team",
    body: "Test Team body",
    users: [allUsers[0], allUsers[1]]
});

describe('TeamComponent.vue', () => {
    

    it('correct team-card view', async () => {
        const wrapper = mount(TeamComponent, {
            props: {
                team: team,
                allUsers: allUsers,
                currentUser: new User({ uid: '1', name: "Test John", roles: ['manager'] })
            },
            global: {
                plugins: [store, vuetify],
            },
        });

        const teamCard = wrapper.find('.team-card');
        expect(teamCard.exists()).toBe(true);
        expect(teamCard.find('.team-card-title').text()).toBe(team.title);
        expect(teamCard.find('.team-card-subtitle').text()).toBe(team.body);
        expect(teamCard.find('.team-card-menu-btn').exists()).toBe(true);
    });

    it('correct team-card-menu-btn view for administrator', async () => {
        const wrapper = mount(TeamComponent, {
            props: {
                team: team,
                allUsers: allUsers,
                currentUser: new User({ uid: '1', name: "Test John", roles: ['administrator'] })
            },
            global: {
                plugins: [store, vuetify],
            },
        });

        expect(wrapper.find('.team-card-menu-btn').exists()).toBeTruthy();
        expect(wrapper.find('.team-card-menu-btn').isDisabled()).toBeFalsy();
        // expect(wrapper.find('.team-card-menu-list-item-edit').exists()).toBeFalsy();
        // await wrapper.find('.team-card-menu-btn').trigger('click');
        // expect(wrapper.find('.team-card-menu-list-item-edit').exists()).toBeTruthy();
    });

    it('correct team-card-menu-btn view for manager', async () => {
        const wrapper = mount(TeamComponent, {
            props: {
                team: team,
                allUsers: allUsers,
                currentUser: new User({ uid: '1', name: "Test John", roles: ['manager'] })
            },
            global: {
                plugins: [store, vuetify],
            },
        });

        expect(wrapper.find('.team-card-menu-btn').exists()).toBeTruthy();
        expect(wrapper.find('.team-card-menu-btn').isDisabled()).toBeFalsy();
    });

    it('correct team-card-menu-btn view for developer', async () => {
        const wrapper = mount(TeamComponent, {
            props: {
                team: team,
                allUsers: allUsers,
                currentUser: new User({ uid: '1', name: "Test John", roles: ['developer'] })
            },
            global: {
                plugins: [store, vuetify],
            },
        });

        expect(wrapper.find('.team-card-menu-btn').exists()).toBeFalsy();
    });
});