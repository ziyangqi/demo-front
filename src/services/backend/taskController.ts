/**
 * 流程引擎有关任务的
 */


// @ts-ignore
import { request } from '@umijs/max';

export async function waitListPost(body: API.TodoTaskQueryDTO, options?: { [key: string]: any }) {
  return request<API.BaseResponseString_>('api/flow/queryTaskList', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}


export async function waitReadListPost(body: API.BaseResponseReadList_, options?: { [p: string]: any }) {
  return request<API.BaseResponseString_>('/engine/task/wait/read/list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/**
 * 把待阅变成已阅
 * @param body
 * @param options
 */
export async function readByAlreadyGet(
  body: API.changeAlready,
  options?: { [key: string]: any },
) {
  const id = body.id
  const url = `engine/task/read/${id}`;
  return request<API.BaseResponseBoolean_>(url, {
    method: 'Get',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/**
 * 获取任务当前进度的列表
 * @param body
 * @param options
 */
export async function getSpeedListGet(
  body: API.getSpeedList,
  options?: { [key: string]: any },
) {
  const prcoId = body.taskId
  const url = `engine/task/progress/list/${prcoId}`;
  return request<API.BaseResponseBoolean_>(url, {
    method: 'Get',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

  /**
   * 获取流程进度
   * @param body
   * @param options
   */
  export async function getSpeedGet(
    body: API.getSpeedList,
    options?: { [key: string]: any },
  ) {
    const taskId = body.taskId
    const url = `engine/task/progress/${taskId}`;
    return request<API.BaseResponseBoolean_>(url, {
      method: 'Get',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    });
  }

