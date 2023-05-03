import { expect, test } from 'vitest'
import { AuthAPI } from '@/api/authAPI';

const userUID = 'd3688667-dafe-400f-bd23-a2aaa5a1f913';

test('getToken query is defined', async () => {
    const res = await AuthAPI.getToken();
    expect(res).toBeDefined();
    expect(Object.prototype.hasOwnProperty.call(res, 'data')).toBeTruthy();
    expect(Object.prototype.hasOwnProperty.call(res, 'errors')).toBeFalsy();
});

test('getUserUID query is defined', async () => {
    const res = await AuthAPI.getUserUID(userUID);
    expect(res).toBeDefined();
    expect(Object.prototype.hasOwnProperty.call(res, 'data')).toBeTruthy();
    expect(Object.prototype.hasOwnProperty.call(res, 'errors')).toBeFalsy();
});
