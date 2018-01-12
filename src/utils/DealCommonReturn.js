import { notification, Alert } from 'antd';
import ReactDOM from 'react-dom';
function deal(mountNode,payload) {
  let type = "";
  if(payload.RetCode == null){
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
