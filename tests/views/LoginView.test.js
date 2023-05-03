import { mount } from "@vue/test-utils";
import vuetify from "@/plugins/vuetify";
import LoginView from "@/views/LoginView.vue";
import { describe, expect, it } from "vitest";

describe('LoginView.vue', () => {
    it('contains login and password field', () => {
        const wrapper = mount(LoginView, {
            global: {
                plugins: [vuetify],
            },
        });
        const loginField = wrapper.find('.loginField');
        const passwordField = wrapper.find('.passwordField');
        expect(loginField.exists()).toBe(true);
        expect(passwordField.exists()).toBe(true);
    });

    it('contains Submit button', () => {
        const wrapper = mount(LoginView, {
            global: {
                plugins: [vuetify],
            },
        });
        const button = wrapper.find('.loginButton');
        expect(button.exists()).toBe(true);
        expect(button.text()).toBe('Войти');
    });
});