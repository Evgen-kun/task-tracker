import { expect, test } from 'vitest'
import { AnsQueryAPI } from '@/api/answerAPI';

const userUID = 'd3688667-dafe-400f-bd23-a2aaa5a1f913';

test('getAnswers query is defined', async () => {
    const res = await AnsQueryAPI.getAnswers();
    expect(res).toBeDefined();
    expect(Object.prototype.hasOwnProperty.call(res, 'data')).toBeTruthy();
    expect(Object.prototype.hasOwnProperty.call(res, 'errors')).toBeFalsy();
});

test('getMyAnswers query is defined', async () => {
    const res = await AnsQueryAPI.getMyAnswers(userUID);
    expect(res).toBeDefined();
    expect(Object.prototype.hasOwnProperty.call(res, 'data')).toBeTruthy();
    expect(Object.prototype.hasOwnProperty.call(res, 'errors')).toBeFalsy();
});
