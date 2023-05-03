import { expect, test } from 'vitest'
import { TeamsQueryAPI } from '@/api/teamAPI';

const userUID = 'd3688667-dafe-400f-bd23-a2aaa5a1f913';

test('getTeams query is defined', async () => {
    const res = await TeamsQueryAPI.getTeams(userUID);
    expect(res).toBeDefined();
    expect(Object.prototype.hasOwnProperty.call(res, 'data')).toBeTruthy();
    expect(Object.prototype.hasOwnProperty.call(res, 'errors')).toBeFalsy();
});

test('getTeamsWithMe query is defined', async () => {
    const res = await TeamsQueryAPI.getTeamsWithMe(userUID);
    expect(res).toBeDefined();
    expect(Object.prototype.hasOwnProperty.call(res, 'data')).toBeTruthy();
    expect(Object.prototype.hasOwnProperty.call(res, 'errors')).toBeFalsy();
});
