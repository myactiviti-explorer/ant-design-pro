import { notification, Alert } from 'antd';
import ReactDOM from 'react-dom';
function deal(payload) {
  if(payload == null || payload.RetCode == null){
    notification.error({
      message: `请求失败`,
      description: `无回调信息`,
    });
    return;
  }
  if(payload.RetCode == "1"){
    notification.success({
      message: `请求成功`,
      description: `${payload.RetVal}`,
    });
  } else if(payload.RetCode == "0" || payload.RetCode == "2"){
    notification.error({
      message: `请求失败 原因: ${payload.RetCode == "0"?"工作流内部错误":"业务逻辑错误"}`,
      description: `${payload.RetVal}`,
    });
  }
}

export default {
  deal,
};
