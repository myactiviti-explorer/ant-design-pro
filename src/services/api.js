import { stringify } from 'qs';
import request from '../utils/request';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function listDeployed(params) {
  return request(`/api/listDeployed?${stringify(params)}`,{
    method: 'POST',
  });
}

export async function listDesigning(params) {
  return request(`/api/listDesigning?${stringify(params)}`,{
    method: 'POST',
  });
}

export async function doStart(params) {
  return request(`/api/doStart?${stringify(params)}`,{
    method: 'POST',
  });
}

export async function doDeploy(params) {
  return request(`/api/doDeploy?${stringify(params)}`,{
    method: 'POST',
  });
}

export async function doCopy(params) {
  return request(`/api/copyProcess?${stringify(params)}`,{
    method: 'POST',
  });
}

export async function doDelete(params) {
  return request(`/api/deleteModel?${stringify(params)}`,{
    method: 'POST',
  });
}

export async function loginCheckEmail(params) {
  return request(`/api/loginCheckEmail?${stringify(params)}`,{
    method: 'POST',
  });
}

export async function registerCheckEmail(params) {
  return request(`/api/registerCheckEmail?${stringify(params)}`,{
    method: 'POST',
  });
}

export async function registerSubmit(params) {
  return request(`/api/sendRegisterEmail?${stringify(params)}`,{
    method: 'POST',
  });
}

export async function accountLogin(params) {
  return request(`/api/accountLogin?${stringify(params)}`,{
    method: 'POST',
  });
}

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}
