import { routerRedux } from 'dva/router';
import { fakeAccountLogin, loginCheckEmail, accountLogin } from '../services/api';
import { notification } from 'antd';
import DCR from '../utils/DealCommonReturn';
export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });
      const response = yield call(accountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      if (response.RetCode==='1') {
        // Login successfully
        // yield put(routerRedux.push('/'));
        document.location.href='/';
      }else{
        yield put({
          type: 'showMessage',
          payload: response,
        });
      }
    },
    *logout(_, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
        },
      });
      yield put(routerRedux.push('/user/login'));
    },
    *checkEmail({ payload }, { call, put }) {
      const response = yield call(loginCheckEmail, payload);
      yield put({
        type: 'loginCheckEmail',
        payload: response,
        callback: payload.callback,
      });
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      return {
        ...state,
        status: payload.status,
        type: payload.type,
        submitting: false,
      };
    },
    changeSubmitting(state, { payload }) {
      return {
        ...state,
        submitting: payload,
      };
    },
    loginCheckEmail(state, action) {
      if(action.payload.RetCode==='1'){
        action.callback();
      }else{
        action.callback(action.payload.RetVal);
      }
      return {
        ...state,
      }
    },
    showMessage(state, action) {
      DCR.deal(action.payload);
      if(action.callback!=null){
        (action.callback)()
      }
      return {
        ...state,
      }
    },
  },
};
