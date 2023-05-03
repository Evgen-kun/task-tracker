import { expect, test } from 'vitest'
import { UsersQueryAPI } from '@/api/usersAPI';

const userUID = 'd3688667-dafe-400f-bd23-a2aaa5a1f913';

test('getUser query is defined', async () => {
    const res = await UsersQueryAPI.getUser(userUID);
    expect(res).toBeDefined();
    expect(Object.prototype.hasOwnProperty.call(res, 'data')).toBeTruthy();
    expect(Object.prototype.hasOwnProperty.call(res, 'errors')).toBeFalsy();
});

test('getFilteredUsers query is defined', async () => {
    const res = await UsersQueryAPI.getFilteredUsers([userUID]);
    expect(res).toBeDefined();
    expect(Object.prototype.hasOwnProperty.call(res, 'data')).toBeTruthy();
    expect(Object.prototype.hasOwnProperty.call(res, 'errors')).toBeFalsy();
});

test('getUserUID query is defined', async () => {
    const res = await UsersQueryAPI.getUserUID();
    expect(res).toBeDefined();
    expect(Object.prototype.hasOwnProperty.call(res, 'data')).toBeTruthy();
    expect(Object.prototype.hasOwnProperty.call(res, 'errors')).toBeFalsy();
});

test('getUsers query is defined', async () => {
    const res = await UsersQueryAPI.getUsers();
    expect(res).toBeDefined();
    expect(Object.prototype.hasOwnProperty.call(res, 'data')).toBeTruthy();
    expect(Object.prototype.hasOwnProperty.call(res, 'errors')).toBeFalsy();
});

test('getUsersNames query is type of object', async () => {
    const res = await UsersQueryAPI.getUsersNames(); 
    expect(res).toBeDefined();
    expect(Object.prototype.hasOwnProperty.call(res, 'data')).toBeTruthy();
    expect(Object.prototype.hasOwnProperty.call(res, 'errors')).toBeFalsy();
});

test('getUsersWithPictures query is type of object', async () => {
    const res = await UsersQueryAPI.getUsersWithPictures(); 
    expect(res).toBeDefined();
    expect(Object.prototype.hasOwnProperty.call(res, 'data')).toBeTruthy();
    expect(Object.prototype.hasOwnProperty.call(res, 'errors')).toBeFalsy();
});
