import { expect, test } from 'vitest'
import { QueryAPI } from '@/api/taskAPI';

const userUID = 'd3688667-dafe-400f-bd23-a2aaa5a1f913';
const projectID = '182119b1-629f-4fd3-b222-ea3c155f93aa';

test('getTasks query is defined', async () => {
    const res = await QueryAPI.getTasks(userUID);
    expect(res).toBeDefined();
    expect(Object.prototype.hasOwnProperty.call(res, 'data')).toBeTruthy();
    expect(Object.prototype.hasOwnProperty.call(res, 'errors')).toBeFalsy();
});

test('getMyTasks query is defined', async () => {
    const res = await QueryAPI.getMyTasks(userUID);
    expect(res).toBeDefined();
    expect(Object.prototype.hasOwnProperty.call(res, 'data')).toBeTruthy();
    expect(Object.prototype.hasOwnProperty.call(res, 'errors')).toBeFalsy();
});

test('getFilteredTasks query is defined', async () => {
    const res = await QueryAPI.getFilteredTasks([projectID]);
    expect(res).toBeDefined();
    expect(Object.prototype.hasOwnProperty.call(res, 'data')).toBeTruthy();
    expect(Object.prototype.hasOwnProperty.call(res, 'errors')).toBeFalsy();
});

test('getStatuses query is defined', async () => {
    const res = await QueryAPI.getStatuses();
    expect(res).toBeDefined();
    expect(Object.prototype.hasOwnProperty.call(res, 'data')).toBeTruthy();
    expect(Object.prototype.hasOwnProperty.call(res, 'errors')).toBeFalsy();
});

test('getProgress query is defined', async () => {
    const res = await QueryAPI.getProgress();
    expect(res).toBeDefined();
    expect(Object.prototype.hasOwnProperty.call(res, 'data')).toBeTruthy();
    expect(Object.prototype.hasOwnProperty.call(res, 'errors')).toBeFalsy();
});

test('getDifficulty query is type of object', async () => {
    const res = await QueryAPI.getDifficulty(); 
    expect(res).toBeDefined();
    expect(Object.prototype.hasOwnProperty.call(res, 'data')).toBeTruthy();
    expect(Object.prototype.hasOwnProperty.call(res, 'errors')).toBeFalsy();
});
