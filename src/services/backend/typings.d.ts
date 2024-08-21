declare namespace API {
  type BaseResponse = {
    code?: number;
    data?: Record<string, any>;
    msg?: string;
  };

  type BaseResponseBoolean_ = {
    code?: number;
    data?: boolean;
    msg?: string;
  };

  type BaseResponseListUserVO_ = {
    code?: number;
    data?: UserVO[];
    msg?: string;
  };

  type BaseResponseLong_ = {
    code?: number;
    data?: number;
    msg?: string;
  };

  type BaseResponsePageUserVO_ = {
    code?: number;
    data?: PageUserVO_;
    msg?: string;
  };

  type BaseResponseString_ = {
    code?: number;
    data?: string;
    msg?: string;
  };

  type BaseResponseUser_ = {
    code?: number;
    data?: User;
    msg?: string;
  };

  type BaseResponseUserVO_ = {
    code?: number;
    data?: UserVO;
    msg?: string;
  };

  type callbackUsingPOSTParams = {
    /** threadId */
    threadId: number;
  };

  type cancelUsingPOSTParams = {
    /** procId */
    procId: string;
  };

  type DeleteRequest = {
    id?: number;
  };

  type getUserByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type listUserByPageUsingGETParams = {
    createTime?: string;
    current?: number;
    gender?: number;
    id?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    updateTime?: string;
    userAccount?: string;
    userAvatar?: string;
    userName?: string;
    userRole?: string;
  };

  type listUserUsingGETParams = {
    createTime?: string;
    current?: number;
    gender?: number;
    id?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    updateTime?: string;
    userAccount?: string;
    userAvatar?: string;
    userName?: string;
    userRole?: string;
  };

  type ModelAndView = {
    empty?: boolean;
    model?: Record<string, any>;
    modelMap?: Record<string, any>;
    reference?: boolean;
    status?:
      | 'ACCEPTED'
      | 'ALREADY_REPORTED'
      | 'BAD_GATEWAY'
      | 'BAD_REQUEST'
      | 'BANDWIDTH_LIMIT_EXCEEDED'
      | 'CHECKPOINT'
      | 'CONFLICT'
      | 'CONTINUE'
      | 'CREATED'
      | 'DESTINATION_LOCKED'
      | 'EXPECTATION_FAILED'
      | 'FAILED_DEPENDENCY'
      | 'FORBIDDEN'
      | 'FOUND'
      | 'GATEWAY_TIMEOUT'
      | 'GONE'
      | 'HTTP_VERSION_NOT_SUPPORTED'
      | 'IM_USED'
      | 'INSUFFICIENT_SPACE_ON_RESOURCE'
      | 'INSUFFICIENT_STORAGE'
      | 'INTERNAL_SERVER_ERROR'
      | 'I_AM_A_TEAPOT'
      | 'LENGTH_REQUIRED'
      | 'LOCKED'
      | 'LOOP_DETECTED'
      | 'METHOD_FAILURE'
      | 'METHOD_NOT_ALLOWED'
      | 'MOVED_PERMANENTLY'
      | 'MOVED_TEMPORARILY'
      | 'MULTIPLE_CHOICES'
      | 'MULTI_STATUS'
      | 'NETWORK_AUTHENTICATION_REQUIRED'
      | 'NON_AUTHORITATIVE_INFORMATION'
      | 'NOT_ACCEPTABLE'
      | 'NOT_EXTENDED'
      | 'NOT_FOUND'
      | 'NOT_IMPLEMENTED'
      | 'NOT_MODIFIED'
      | 'NO_CONTENT'
      | 'OK'
      | 'PARTIAL_CONTENT'
      | 'PAYLOAD_TOO_LARGE'
      | 'PAYMENT_REQUIRED'
      | 'PERMANENT_REDIRECT'
      | 'PRECONDITION_FAILED'
      | 'PRECONDITION_REQUIRED'
      | 'PROCESSING'
      | 'PROXY_AUTHENTICATION_REQUIRED'
      | 'REQUESTED_RANGE_NOT_SATISFIABLE'
      | 'REQUEST_ENTITY_TOO_LARGE'
      | 'REQUEST_HEADER_FIELDS_TOO_LARGE'
      | 'REQUEST_TIMEOUT'
      | 'REQUEST_URI_TOO_LONG'
      | 'RESET_CONTENT'
      | 'SEE_OTHER'
      | 'SERVICE_UNAVAILABLE'
      | 'SWITCHING_PROTOCOLS'
      | 'TEMPORARY_REDIRECT'
      | 'TOO_EARLY'
      | 'TOO_MANY_REQUESTS'
      | 'UNAUTHORIZED'
      | 'UNAVAILABLE_FOR_LEGAL_REASONS'
      | 'UNPROCESSABLE_ENTITY'
      | 'UNSUPPORTED_MEDIA_TYPE'
      | 'UPGRADE_REQUIRED'
      | 'URI_TOO_LONG'
      | 'USE_PROXY'
      | 'VARIANT_ALSO_NEGOTIATES';
    view?: View;
    viewName?: string;
  };

  type OrderItem = {
    asc?: boolean;
    column?: string;
  };

  type PageUserVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: UserVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type TaskAgreeDTO = {
    action?: string;
    actionName?: string;
    bpmVar?: string;
    chooseNode?: string;
    chooseNodeUser?: string;
    formData?: string;
    formType?: string;
    monitor?: boolean;
    nodeIndex?: number;
    nodeType?: string;
    opinion?: string;
    priority?: number;
    taskId?: string;
    taskName?: string;
    taskTitle?: string;
    threadId?: number;
    type?: string;
    url?: string;
  };

  type TaskRejectDTO = {
    newActivityId?: string;
    operate?: string;
    option?: string;
    priority?: string;
    taskId?: string;
    taskTitle?: string;
    threadId?: number;
    type?: string;
    url?: string;
    userId?: string;
  };

  type TaskTransferDTO = {
    option?: string;
    taskId?: string;
    threadId?: number;
    type?: string;
    url?: string;
    usersInfo?: UcUser;
  };

  type UcUser = {
    fullname?: string;
    userNo?: string;
  };

  type User = {
    createTime?: string;
    gender?: number;
    id?: number;
    isDelete?: number;
    token?: string;
    updateTime?: string;
    userAccount?: string;
    userAvatar?: string;
    userName?: string;
    userPassword?: string;
    userRole?: string;
  };

  type UserAddRequest = {
    gender?: number;
    userAccount?: string;
    userAvatar?: string;
    userName?: string;
    userPassword?: string;
    userRole?: string;
  };

  type UserLoginRequest = {
    userAccount?: string;
    userPassword?: string;
  };

  type UserRegisterRequest = {
    checkPassword?: string;
    userAccount?: string;
    userPassword?: string;
  };

  type UserUpdateRequest = {
    gender?: number;
    id?: number;
    userAccount?: string;
    userAvatar?: string;
    userName?: string;
    userPassword?: string;
    userRole?: string;
  };

  type UserVO = {
    createTime?: string;
    gender?: number;
    id?: number;
    updateTime?: string;
    userAccount?: string;
    userAvatar?: string;
    userName?: string;
    userRole?: string;
  };

  type UserQueryRequest = {
    id? : number;
    userName?: string;
    userAccount?: string
    userAvatar?: string
    gender?: number
    userRole?: string
    createTime?: string
    updateTime?: string
  }

  type View = {
    contentType?: string;
  };

  type TodoTaskQueryDTO = {
    endTime? :string
    startTime? :string
    limit?: number
    page?: number
  }

  type waitList = {
    id?: string
    name?: string
    createTime?: string
    processDefinitionId?: string
    processInstanceId?: string
    title?: string
  }

  type CommuReveiverQueryDTO = {
    name?: string
    title?: string
    status: string
    whereSql: string
    typeKey :string
    limit?: number
    page?: number
  }

  type BaseResponseReadList_ = {
    code?: number;
    data?: string;
    msg?: string;
  };
  // 流程待阅
  type waitReadList = {
    id?: string
    notice?: string
    opinion?: string
    procId?: string
    title?: string
    taskId?: string
    receiver?: string
    receiverId?: string
  }

  type changeAlready = {
    taskId?: string
  }
}
