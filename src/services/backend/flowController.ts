// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** agree POST /api/flow/agree */
export async function agreeUsingPost(body: API.TaskAgreeDTO, options?: { [key: string]: any }) {
  return request<API.BaseResponseString_>('/api/flow/agree', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** callback POST /api/flow/callback/${param1} */
export async function callbackUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.callbackUsingPOSTParams,
  body: API.BaseResponse,
  options?: { [key: string]: any },
) {
  const { threadId: param0, uuid: param1, ...queryParams } = params;
  return request<API.BaseResponse>(`/api/flow/callback/${param1}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** cancel POST /api/flow/cancel/${param0} */
export async function cancelUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.cancelUsingPOSTParams,
  options?: { [key: string]: any },
) {
  const { procId: param0, ...queryParams } = params;
  return request<API.BaseResponse>(`/api/flow/cancel/${param0}`, {
    method: 'POST',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** reject POST /api/flow/reject */
export async function rejectUsingPost(body: API.TaskRejectDTO, options?: { [key: string]: any }) {
  return request<API.BaseResponse>('/api/flow/reject', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** transfer POST /api/flow/transfer */
export async function transferUsingPost(
  body: API.TaskTransferDTO,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponse>('/api/flow/transfer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
