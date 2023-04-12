import { expect, test } from 'vitest'
import { UsersQueryAPI } from '@/api/usersAPI';

test('getUsers query is defined', async () => {
    expect((await UsersQueryAPI.getUsers())).toBeDefined();
});

test('getTasks query is type of object', async () => {
    expect(await UsersQueryAPI.getUsersNames()).toBeTypeOf('object');
});
