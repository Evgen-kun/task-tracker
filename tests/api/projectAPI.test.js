import { expect, test } from 'vitest'
import { ProjectsQueryAPI } from '@/api/projectAPI';

const userUID = 'd3688667-dafe-400f-bd23-a2aaa5a1f913';
const projectID = '182119b1-629f-4fd3-b222-ea3c155f93aa';
const teamID = '40e291ae-52f1-4deb-bdc0-bbec0c36029f';

test('getProject query is defined', async () => {
    const res = await ProjectsQueryAPI.getProject(projectID);
    expect(res).toBeDefined();
    expect(Object.prototype.hasOwnProperty.call(res, 'data')).toBeTruthy();
    expect(Object.prototype.hasOwnProperty.call(res, 'errors')).toBeFalsy();
});

test('getProjectsByUserUID query is defined', async () => {
    const res = await ProjectsQueryAPI.getProjectsByUserUID(userUID);
    expect(res).toBeDefined();
    expect(Object.prototype.hasOwnProperty.call(res, 'data')).toBeTruthy();
    expect(Object.prototype.hasOwnProperty.call(res, 'errors')).toBeFalsy();
});

test('getProjectsByTeamID query is defined', async () => {
    const res = await ProjectsQueryAPI.getProjectsByTeamID(teamID);
    expect(res).toBeDefined();
    expect(Object.prototype.hasOwnProperty.call(res, 'data')).toBeTruthy();
    expect(Object.prototype.hasOwnProperty.call(res, 'errors')).toBeFalsy();
});

test('getProjectsByTeamsID query is defined', async () => {
    const res = await ProjectsQueryAPI.getProjectsByTeamsID([teamID]);
    expect(res).toBeDefined();
    expect(Object.prototype.hasOwnProperty.call(res, 'data')).toBeTruthy();
    expect(Object.prototype.hasOwnProperty.call(res, 'errors')).toBeFalsy();
});
