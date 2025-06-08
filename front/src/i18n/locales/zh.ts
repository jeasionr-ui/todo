export default {
  // 通用文本
  common: {
    // 基础操作
    save: '保存',
    cancel: '取消',
    confirm: '确认',
    edit: '编辑',
    delete: '删除',
    create: '创建',
    update: '更新',
    add: '添加',
    apply: '应用',
    reset: '重置',
    clear: '清空',
    back: '返回',
    next: '下一页',
    previous: '上一页',
    close: '关闭',
    done: '完成',
    skip: '跳过',
    saving: '保存中...',

    // 状态
    loading: '加载中...',
    success: '操作成功',
    failed: '操作失败',
    error: '操作失败',
    warning: '警告',
    info: '提示',

    // 导航
    home: '首页',
    dashboard: '仪表板',
    profile: '个人资料',
    editProfile: '编辑个人资料',
    settings: '设置',
    support: '帮助',

    // 搜索和筛选
    search: '搜索',
    searchPlaceholder: '搜索或输入命令...',
    filter: '筛选',
    sort: '排序',

    // 数据状态
    noData: '暂无数据',
    more: '更多',
    yes: '是',
    no: '否',
    due: '到期',
    view: '查看',
    to: '至',
    page: '页',
    of: '共',
    perPage: '每页',

    // 应用信息
    appDescription: 'Todo List 是一款简单易用的任务管理应用，帮助您高效管理日常任务和习惯养成。',
    welcome: '欢迎回来',
  },

  // 分页组件
  pagination: {
    showing: '显示',
    results: '条',
    items: '条',
    pageSize: '每页条数',
    previous: '上一页',
    next: '下一页',
    to: '至',
    of: '共',
  },

  // 对话框
  dialog: {
    archive: '归档',
    unarchive: '取消归档',
    archived: '已归档',
    unarchived: '未归档',
    archive_success: '归档成功',
    archive_failure: '归档失败',
    unarchive_success: '取消归档成功',
    unarchive_failure: '取消归档失败',
  },

  // 表单
  form: {
    selectDate: '选择日期',
  },

  // 认证相关
  auth: {
    signIn: '登录',
    signUp: '注册',
    signOut: '退出登录',
    forgotPassword: '忘记密码',
    resetPassword: '重置密码',
    rememberMe: '记住我',

    // 表单字段
    email: '邮箱',
    password: '密码',
    confirmPassword: '确认密码',
    phoneNumber: '手机号',
    verificationCode: '验证码',
    sendCode: '发送验证码',
    firstName: '名',
    lastName: '姓',
    nickname: '昵称',

    // 提示文本
    agreeTerms: '我已阅读并同意服务条款和隐私政策',
    alreadyHaveAccount: '已有账号？',
    noAccount: '没有账号？',
    createAccount: '创建账号',
    signInWith: '使用第三方账号登录',
    signUpWith: '使用第三方账号注册',
    or: '或',
    enterEmailPassword: '请输入邮箱和密码登录',
    enterInfoToSignUp: '请填写信息完成注册',

    // 验证信息
    passwordNotMatch: '两次输入的密码不一致',
    invalidEmail: '邮箱格式不正确',
    invalidPhone: '手机号格式不正确',
    twoFactorAuth: '两步验证',
    enterVerificationCode: '请输入验证码',
    accountSecurity: '账号安全',

    // 登录错误分类
    invalidCredentials: '用户名或密码错误',
    loginFailed: '登录失败，请稍后再试',
    serverError: '服务器异常，请稍后再试',
    networkError: '网络连接失败，请检查网络状态',
    accountLocked: '账号已被锁定，请联系管理员',
    tooManyAttempts: '登录尝试次数过多，请稍后再试',
  },

  // 用户相关
  user: {
    profile: '个人资料',
    settings: '账号设置',
    security: '安全设置',
    notifications: '通知设置',
    activity: '活动记录',
    achievements: '成就系统',

    // 个人信息
    personalInfo: '个人信息',
    address: '地址信息',
    bio: '个人简介',
    avatar: '头像',
    uploadAvatar: '上传头像',
    changeAvatar: '更换头像',

    // 地址信息
    country: '国家',
    city: '城市',
    state: '省/州',
    postalCode: '邮政编码',
    taxId: '税号',

    // 密码管理
    changePassword: '修改密码',
    currentPassword: '当前密码',
    newPassword: '新密码',
    enterNewPassword: '请输入您的新密码',
    passwordRequired: '密码不能为空',
    passwordTooShort: '密码长度不能少于6个字符',
    resetPasswordFailed: '重置密码失败，请稍后再试',
    resetPasswordSuccess: '密码重置成功，请使用新密码登录',

    // 两步验证
    twoFactorAuthentication: '两步验证',
    enable: '启用',
    disable: '禁用',

    // 历史记录
    loginHistory: '登录历史',
    deviceHistory: '设备历史',
    lastLogin: '最近登录',
    ipAddress: 'IP地址',
    device: '设备',
    browser: '浏览器',
    location: '位置',
    time: '时间',
    status: '状态',
    active: '活跃',
    inactive: '不活跃',
    online: '在线',
    offline: '离线',
    accountCreated: '账号创建于',
    accountUpdated: '账号更新于',

    // 社交账号
    socialAccounts: '社交账号',
    connect: '关联',
    disconnect: '解除关联',
    connected: '已关联',
    notConnected: '未关联',
  },

  // 菜单导航
  menu: {
    dashboard: '仪表盘',
    tasks: '任务管理',
    habits: '习惯养成',
    goals: '目标管理',
    pomodoro: '番茄钟',
    calendar: '日历视图',
    reports: '报表分析',
    settings: '系统设置',
    userManagement: '用户管理',
    roleManagement: '角色管理',
    permissionManagement: '权限管理',
    toast: '消息提示',
  },

  // 报表分析
  reports: {
    title: '报表分析',
    dateRange: '日期范围',
    startDate: '开始日期',
    endDate: '结束日期',
    export: '导出数据',
    
    // 报表类型
    productivity: '生产力',
    habits: '习惯跟踪',
    goals: '目标完成',
    timeEfficiency: '时间效率',
    taskStats: '任务统计',
    pomodoro: '番茄工作法',
    
    // 任务报表
    tasks: {
      title: '任务统计报告',
      totalTasks: '总任务数',
      completedTasks: '已完成任务',
      pendingTasks: '待处理任务',
      completionRate: '完成率',
      completionTrend: '完成趋势',
      priorityDistribution: '优先级分布',
      statusDistribution: '状态分布',
      tagUsage: '标签使用频率',
      overdueAnalysis: '逾期任务分析',
      overdueTasks: '逾期任务',
      avgDaysOverdue: '平均逾期天数',
      overdueRate: '逾期率'
    }
  },

  // 消息提示
  toast: {
    success: '成功',
    error: '错误',
    warning: '警告',
    info: '信息',
    customToast: '自定义消息',
    title: '标题',
    message: '消息内容',
    duration: '显示时长',
    variant: '类型',
    show: '显示',
    showCountdown: '显示倒计时',
    operationSuccess: '操作已成功完成',
    operationError: '操作过程中发生错误',
    operationWarning: '请注意此操作的潜在风险',
    informationMessage: '这是一条信息提示',
    pleaseEnterMessage: '请输入消息内容',
  },

  // 个人资料页面
  profile: {
    title: '个人资料',
    description: '查看和编辑您的个人资料',
    editSocialAccounts: '编辑社交账号',
    editSocialAccountsDesc: '连接您的社交账号到您的个人资料',
  },

  // 通知
  notification: {
    title: '通知',
    viewAll: '查看所有通知',
    requestPermission: '请求权限修改',
    project: '项目',
    minAgo: '分钟前',
    online: '在线',
    offline: '离线',
    user: '用户',
  },

  // 任务管理
  task: {
    title: '任务管理',
    all: '所有任务',
    create: '创建任务',
    edit: '编辑任务',
    delete: '删除任务',
    confirmDelete: '确定要删除此任务吗？',
    nameRequired: '任务名称不能为空',
    createTask: '创建任务',
    editTask: '编辑任务',
    allStatuses: '所有状态',
    allPriorities: '所有优先级',
    resetFilter: '重置筛选',
    applyFilter: '应用筛选',

    // 任务详情
    detail: '任务详情',
    name: '任务名称',
    description: '任务描述',
    status: '状态',
    priority: '优先级',
    dueDate: '截止日期',
    reminderTime: '提醒时间',
    tags: '标签',
    attachments: '附件',

    // 占位符
    selectDueDate: '选择截止日期',
    selectReminderTime: '选择提醒时间',

    // 任务状态
    todo: '待办',
    working: '进行中',
    done: '已完成',

    // 优先级
    high: '高',
    medium: '中',
    low: '低',

    // 操作
    addTag: '添加标签',
    addAttachment: '添加附件',
    filter: '筛选',
    sort: '排序',
    search: '搜索任务',
    noTasks: '暂无任务',
    createFirstTask: '创建您的第一个任务',

    // 高级功能
    estimatedTime: '预计时间',
    actualTime: '实际耗时',
    dependency: '依赖任务',
    recurring: '循环任务',
    reminder: '提醒',
    template: '任务模板',
    saveAsTemplate: '保存为模板',
    useTemplate: '使用模板',
    batchEdit: '批量编辑',
    batchDelete: '批量删除',
    batchComplete: '批量完成',
    import: '导入任务',
    export: '导出任务',

    // 状态变更
    createSuccess: '任务创建成功',
    createFailed: '任务创建失败',
    updateSuccess: '任务更新成功',
    updateFailed: '任务更新失败',
    deleteSuccess: '任务删除成功',
    deleteFailed: '任务删除失败',
  },

  // 目标管理
  goal: {
    // 基础信息
    title: '目标管理',
    all: '所有目标',
    create: '创建目标',
    edit: '编辑目标',
    view: '查看目标',
    delete: '删除目标',
    search: '搜索目标',
    filter: '筛选',

    // 表单字段
    titleField: '目标标题',
    titlePlaceholder: '请输入目标标题',
    description: '目标描述',
    descriptionPlaceholder: '请描述您的目标...',
    category: '目标类别',
    selectCategory: '选择类别',
    priority: '优先级',
    status: '状态',
    progress: '进度',
    startDate: '开始日期',
    targetDate: '目标日期',
    completedDate: '完成日期',
    parentGoal: '父目标',
    noParentGoal: '无父目标',

    // 状态
    draft: '草稿',
    planning: '规划中',
    active: '进行中',
    paused: '已暂停',
    completed: '已完成',
    cancelled: '已取消',
    allStatus: '所有状态',

    // 优先级
    high: '高',
    medium: '中',
    low: '低',
    allPriorities: '所有优先级',

    // 类别
    personal: '个人',
    career: '职业',
    health: '健康',
    education: '教育',
    finance: '财务',
    relationship: '人际',
    hobby: '兴趣',
    other: '其他',
    allCategories: '所有类别',
    allGoals: '所有目标',
    topLevelGoals: '顶级目标',

    // 基本信息
    basicInfo: '基本信息',
    subGoal: '子目标',
    averageProgress: '平均进度',
    totalGoals: '总目标数',
    activeGoals: '进行中',
    completedGoals: '已完成',

    // 里程碑
    milestones: '里程碑',
    addMilestone: '添加里程碑',
    editMilestone: '编辑里程碑',
    milestoneTitlePlaceholder: '请输入里程碑标题',
    milestoneDescriptionPlaceholder: '请描述这个里程碑...',
    order: '顺序',
    isCompleted: '已完成',
    noMilestones: '暂无里程碑',

    // 任务关联
    tasks: '关联任务',
    associatedTasks: '关联的任务',
    associateTask: '关联任务',
    dissociateTask: '取消关联',
    searchTasks: '搜索任务',
    searchTasksPlaceholder: '搜索任务名称或描述...',
    selectedTasks: '已选择 {count} 个任务',
    noAvailableTasks: '暂无可关联的任务',
    noTasks: '暂无关联任务',
    associate: '关联',

    // 回顾
    reviews: '目标回顾',
    addReview: '添加回顾',
    editReview: '编辑回顾',
    reviewDate: '回顾日期',
    reviewType: '回顾类型',
    selectReviewType: '选择回顾类型',
    reviewTypeOptions: {
      weekly: '每周回顾',
      monthly: '每月回顾',
      quarterly: '季度回顾',
      custom: '自定义回顾',
    },
    rating: '评分',
    reviewContent: '回顾内容',
    reviewContentPlaceholder: '分享您对目标进展的想法和感受...',
    lessonsLearned: '经验教训',
    lessonsLearnedPlaceholder: '记录从这个目标中学到的经验...',
    nextSteps: '下一步计划',
    nextStepsPlaceholder: '计划接下来要采取的行动...',
    noReviews: '暂无回顾记录',

    // 操作消息
    createSuccess: '目标创建成功',
    createError: '目标创建失败',
    updateSuccess: '目标更新成功',
    updateError: '目标更新失败',
    deleteSuccess: '目标删除成功',
    deleteError: '目标删除失败',
    deleteConfirm: '确定要删除目标"{title}"吗？',
    loadError: '加载目标失败',

    // 里程碑操作
    milestoneCreateSuccess: '里程碑创建成功',
    milestoneCreateError: '里程碑创建失败',
    milestoneUpdateSuccess: '里程碑更新成功',
    milestoneUpdateError: '里程碑更新失败',
    milestoneUpdated: '里程碑状态已更新',
    milestoneDeleted: '里程碑已删除',
    milestoneDeleteError: '里程碑删除失败',
    deleteMilestoneConfirm: '确定要删除这个里程碑吗？',

    // 回顾操作
    reviewCreateSuccess: '回顾创建成功',
    reviewCreateError: '回顾创建失败',
    reviewUpdateSuccess: '回顾更新成功',
    reviewUpdateError: '回顾更新失败',
    reviewDeleted: '回顾已删除',
    reviewDeleteError: '回顾删除失败',
    deleteReviewConfirm: '确定要删除这个回顾吗？',

    // 任务关联操作
    loadTasksError: '加载任务失败',
    tasksAssociated: '已关联 {count} 个任务',
    associateTasksError: '关联任务失败',
    taskDissociated: '任务关联已取消',
    taskDissociateError: '取消任务关联失败',
    dissociateTaskConfirm: '确定要取消关联这个任务吗？',

    // 其他
    noGoals: '暂无目标，开始创建您的第一个目标吧！',
  },

  // 文件操作
  file: {
    upload: '上传文件',
    uploadFiles: '上传文件',
    selectedFiles: '已选择的文件',
    uploadedFiles: '已上传的文件',
    download: '下载文件',
    downloadFile: '下载文件',
    delete: '删除文件',
    deleteFile: '删除文件',
    selectFiles: '选择文件',
    dragAndDrop: '拖拽文件到此处或点击选择',
    maxFileSize: '文件大小不能超过',
    supportedFormats: '支持的格式',
    uploadSuccess: '文件上传成功',
    uploadFailed: '文件上传失败',
    deleteSuccess: '文件删除成功',
    deleteFailed: '文件删除失败',
    downloadFailed: '文件下载失败',
  },

  // 日期时间
  datetime: {
    weekdays: {
      sunday: '日',
      monday: '一',
      tuesday: '二',
      wednesday: '三',
      thursday: '四',
      friday: '五',
      saturday: '六',
    },
    weekdaysShort: ['日', '一', '二', '三', '四', '五', '六'],
  },

  // 习惯管理
  habits: {
    title: '习惯养成',
    all: '所有习惯',
    create: '创建习惯',
    edit: '编辑习惯',
    delete: '删除习惯',
    view: '查看详情',
    confirmDelete: '确定要删除此习惯吗？',
    nameRequired: '习惯名称不能为空',
    createHabit: '创建习惯',
    editHabit: '编辑习惯',
    detail: '习惯详情',

    // 基本信息
    name: '习惯名称',
    description: '习惯描述',
    category: '分类',
    frequencyDesc: '频率',
    startDate: '开始日期',
    endDate: '结束日期',
    reminderTime: '提醒时间',
    reminderType: '提醒类型',
    reminderLocation: '提醒位置',
    color: '颜色',
    icon: '图标',
    tags: '标签',
    addTag: '添加标签',

    // 状态和操作
    complete: '打卡',
    completed: '已打卡',
    archive: '归档',
    unarchive: '取消归档',
    showArchived: '显示已归档',
    hideArchived: '隐藏已归档',

    // 扩展信息
    habits: '习惯列表',
    myHabits: '我的习惯',
    habitName: '习惯名称',
    habitDescription: '习惯描述',
    isArchived: '已归档',
    createdAt: '创建时间',
    updatedAt: '更新时间',

    // 统计数据
    streakCount: '当前连续',
    longestStreak: '最长连续',
    totalCompletions: '总完成次数',
    completionHistory: '完成历史',
    lastCompletedAt: '上次完成时间',

    // 状态
    incomplete: '未完成',
    inProgress: '进行中',
    paused: '已暂停',
    archived: '已归档',

    // 操作
    markAsCompleted: '标记为完成',
    markAsIncomplete: '标记为未完成',
    addNote: '添加备注',
    viewHistory: '查看历史',
    archiveHabit: '归档习惯',
    unarchiveHabit: '取消归档',

    // 状态变更
    create_title: '创建新习惯',
    create_success: '创建习惯成功',
    update_success: '习惯更新成功',
    create_failed: '习惯创建失败',
    update_failed: '习惯更新失败',
    delete_success: '习惯删除成功',
    delete_failed: '习惯删除失败',
    check_success: '打卡成功',
    uncheck_success: '撤销打卡',
    habitCreated: '习惯创建成功',
    habitUpdated: '习惯更新成功',
    habitDeleted: '习惯删除成功',

    // 表单验证
    nameMinLength: '习惯名称至少需要2个字符',
    nameMaxLength: '习惯名称不能超过50个字符',
    descriptionMaxLength: '描述不能超过200个字符',
    categoryRequired: '请选择分类',
    frequencyRequired: '请选择频率',
    startDateRequired: '请选择开始日期',
    invalidDateRange: '结束日期不能早于开始日期',

    // 提示信息
    noHabitsFound: '暂无习惯记录',
    noCompletionHistory: '暂无完成记录',
    habitCompletedToday: '今日已完成',
    habitNotCompletedToday: '今日未完成',
    streakBroken: '连续记录已中断',

    // 统计
    stats: {
      current_streak: '当前连续',
      longest_streak: '最长连续',
      total: '总计完成',
      completion_rate: '完成率',
      last_completed: '最近完成',
    },

    // 分类
    categories: {
      health: '健康',
      fitness: '健身',
      study: '学习',
      work: '工作',
      lifestyle: '生活方式',
      hobby: '爱好',
      social: '社交',
      personal: '个人发展',
      finance: '财务',
      mindfulness: '正念',
      creativity: '创意',
      other: '其他',
    },

    // 频率
    frequency: {
      daily: '每日',
      weekly: '每周',
      monthly: '每月',
      custom: '自定义',
    },

    // 筛选和排序
    filter: {
      title: '筛选',
      category: '分类',
      frequency: '频率',
      all_categories: '所有分类',
      all_frequencies: '所有频率',
      show_archived: '显示已归档',
      apply: '应用筛选',
      reset: '重置筛选',
    },

    sort: {
      title: '排序',
      name_asc: '名称 (A-Z)',
      name_desc: '名称 (Z-A)',
      created_asc: '创建时间 (最早)',
      created_desc: '创建时间 (最近)',
      streak_asc: '连续次数 (最少)',
      streak_desc: '连续次数 (最多)',
    },

    // 空状态
    empty: {
      title: '暂无习惯',
      description: '创建您的第一个习惯，开始养成良好的生活方式',
      create: '创建习惯',
      create_first: '创建您的第一个习惯',
    },

    // 表单
    form: {
      name: '习惯名称',
      name_placeholder: '请输入习惯名称',
      description: '习惯描述',
      description_placeholder: '请输入习惯描述（可选）',
      category: '分类',
      frequency: '频率',
      days_of_week: '每周的第几天',
      days_of_month: '每月的第几天',
      start_date: '开始日期',
      start_date_placeholder: '选择开始日期',
      end_date_placeholder: '选择结束日期',
      end_date: '结束日期',
      tags: '标签',
      tags_placeholder: '添加标签',
      reminder_type: '提醒类型',
      reminder_time: '提醒时间',
      reminder_time_placeholder: '选择提醒时间',
      reminder_location: '提醒位置',
      reminder_location_placeholder: '输入位置',
      color: '颜色',
      icon: '图标',
      icon_placeholder: '选择图标',
    },

    // 提醒类型
    reminder_types: {
      none: '无提醒',
      time: '时间提醒',
      location: '位置提醒',
    },
  },

  // 频率相关
  frequency: {
    daily: '每日',
    weekly: '每周',
    monthly: '每月',

    // 周几
    daysOfWeek: {
      0: '周日',
      1: '周一',
      2: '周二',
      3: '周三',
      4: '周四',
      5: '周五',
      6: '周六',
    },

    // 频率描述
    everyDay: '每天',
    everyWeek: '每周',
    everyMonth: '每月',
    weekdays: '工作日',
    weekends: '周末',

    // 频率设置
    selectDays: '选择日期',
    selectWeekdays: '选择工作日',
    selectDaysOfMonth: '选择每月的第几天',
  },

  // 分类
  category: {
    health: '健康',
    fitness: '健身',
    study: '学习',
    work: '工作',
    lifestyle: '生活方式',
    hobby: '爱好',
    social: '社交',
    personal: '个人发展',
    finance: '财务',
    mindfulness: '正念',
    creativity: '创意',
    other: '其他',
  },

  // 提醒相关
  reminder: {
    time: '时间提醒',
    location: '位置提醒',
    noReminder: '无提醒',
    setReminder: '设置提醒',
    reminderSet: '提醒已设置',
    reminderCanceled: '提醒已取消',
    reminderTitle: '习惯提醒',
    reminderMessage: '该完成你的习惯了：{habitName}',

    // 时间表达
    timeFormat: 'HH:mm',
    dateFormat: 'YYYY年MM月DD日',
    datetimeFormat: 'YYYY年MM月DD日 HH:mm',
  },

  // 统计页面
  statistics: {
    title: '统计',
    overview: '概览',
    todayStats: '今日统计',
    weeklyStats: '本周统计',
    monthlyStats: '本月统计',
    yearlyStats: '今年统计',

    // 统计指标
    totalHabits: '总习惯数',
    activeHabits: '活跃习惯',
    completedToday: '今日完成',
    completionRate: '完成率',
    averageStreak: '平均连续',
    bestStreak: '最佳连续',

    // 图表
    completionTrend: '完成趋势',
    categoryDistribution: '分类分布',
    weeklyPattern: '周完成模式',
    monthlyProgress: '月度进展',

    // 成就
    achievements: '成就',
    badges: '徽章',
    milestones: '里程碑',
  },

  // 日历相关
  calendar: {
    today: '今天',
    month: '月',
    week: '周',
    day: '日',
    agenda: '日程',

    // 月份
    months: {
      1: '一月',
      2: '二月',
      3: '三月',
      4: '四月',
      5: '五月',
      6: '六月',
      7: '七月',
      8: '八月',
      9: '九月',
      10: '十月',
      11: '十一月',
      12: '十二月',
    },

    // 周几简称
    weekdaysShort: ['日', '一', '二', '三', '四', '五', '六'],

    // 导航
    previousMonth: '上个月',
    nextMonth: '下个月',
    goToToday: '回到今天',
  },

  // 设置页面
  settings: {
    title: '设置',
    general: '通用设置',
    notifications: '通知设置',
    appearance: '外观设置',
    data: '数据管理',
    about: '关于',

    // 通用设置
    language: '语言',
    theme: '主题',
    startOfWeek: '一周开始',
    timeFormat: '时间格式',
    dateFormat: '日期格式',

    // 通知设置
    enableNotifications: '启用通知',
    dailyReminder: '每日提醒',
    weeklyReport: '周报告',
    achievementNotifications: '成就通知',

    // 主题
    light: '浅色模式',
    dark: '深色模式',
    system: '跟随系统',

    // 数据管理
    exportData: '导出数据',
    importData: '导入数据',
    clearData: '清空数据',
    backup: '备份',
    restore: '恢复',

    // 确认对话框
    confirmClearData: '确定要清空所有数据吗？此操作不可恢复。',
    confirmDeleteHabit: '确定要删除这个习惯吗？',
    dataCleared: '数据已清空',
    dataExported: '数据导出成功',
    dataImported: '数据导入成功',
  },

  // 错误信息
  error: {
    networkError: '网络连接错误',
    serverError: '服务器错误',
    unknownError: '未知错误',
    validationError: '验证失败',
    permissionDenied: '权限不足',
    notFound: '未找到',
    timeout: '请求超时',

    // 具体错误
    habitNotFound: '习惯不存在',
    invalidDate: '无效日期',
    invalidTime: '无效时间',
    duplicateHabit: '习惯名称已存在',
    cantDeleteCompletedHabit: '无法删除已有完成记录的习惯',
  },

  // 成功信息
  success: {
    habitCompleted: '习惯完成！',
    streakIncreased: '连续记录增加了！',
    habitCreated: '习惯创建成功',
    habitUpdated: '习惯更新成功',
    habitDeleted: '习惯删除成功',
    reminderSet: '提醒设置成功',
    dataExported: '数据导出成功',
    settingsSaved: '设置保存成功',
  },

  // 时间相关
  time: {
    now: '现在',
    today: '今天',
    yesterday: '昨天',
    tomorrow: '明天',
    thisWeek: '本周',
    thisMonth: '本月',
    thisYear: '今年',

    // 相对时间
    minutesAgo: '{minutes} 分钟前',
    hoursAgo: '{hours} 小时前',
    daysAgo: '{days} 天前',
    weeksAgo: '{weeks} 周前',
    monthsAgo: '{months} 个月前',
    yearsAgo: '{years} 年前',

    // 持续时间
    days: '{count} 天',
    weeks: '{count} 周',
    months: '{count} 个月',
    years: '{count} 年',
  },

  // 单位
  units: {
    times: '次',
    days: '天',
    weeks: '周',
    months: '月',
    years: '年',
    percent: '%',
  },

  // 空状态
  empty: {
    noHabits: '还没有创建任何习惯',
    noCompletions: '还没有完成记录',
    noReminders: '没有设置提醒',
    noData: '暂无数据',
    createFirstHabit: '创建你的第一个习惯',
    startTracking: '开始追踪你的习惯',
  },

  // 导航
  navigation: {
    dashboard: '仪表板',
    habits: '习惯',
    calendar: '日历',
    statistics: '统计',
    settings: '设置',
    profile: '个人资料',
  },

  // 按钮文本
  buttons: {
    getStarted: '开始使用',
    learnMore: '了解更多',
    tryAgain: '重试',
    goHome: '返回首页',
    viewDetails: '查看详情',
    markComplete: '标记完成',
    skip: '跳过',
    done: '完成',
    close: '关闭',
  },

  // 占位符文本
  placeholders: {
    searchHabits: '搜索习惯...',
    habitName: '输入习惯名称',
    habitDescription: '描述这个习惯...',
    addTag: '添加标签',
    selectCategory: '选择分类',
    addNote: '添加备注...',
    location: '输入地点',
  },

  // 标签
  tags: {
    morning: '晨间',
    evening: '晚间',
    weekend: '周末',
    indoor: '室内',
    outdoor: '户外',
    quick: '快速',
    challenge: '挑战',
    relaxing: '放松',
    social: '社交',
    solo: '独自',
    beginner: '初学者',
    advanced: '高级',
  },

  // 番茄钟
  pomodoro: {
    title: '番茄钟',
    timer: {
      readyToStart: '准备开始',
      focusTime: '专注时间',
      shortBreak: '短休息',
      longBreak: '长休息',
    },
    settings: {
      title: '番茄钟设置',
      templates: '模板管理',
      activeTemplate: '当前模板',
      createTemplate: '创建模板',
      editTemplate: '编辑模板',
      newTemplate: '新建模板',
      addTemplate: '添加模板',
      templateName: '模板名称',
      templateNamePlaceholder: '输入模板名称',
      description: '描述',
      descriptionPlaceholder: '输入模板描述',
      workDuration: '工作时长',
      breakDuration: '短休息时长',
      longBreakDuration: '长休息时长',
      sessionsBeforeLongBreak: '长休息前的轮次',
      duration: '工作 {work} 分钟，休息 {break} 分钟',
      autoStartBreaks: '自动开始休息',
      autoStartBreaksDescription: '工作时间结束后自动开始休息',
      setAsDefault: '设为默认模板',
      default: '默认',
      confirmDeleteTemplate: '确定要删除这个模板吗？',
      focusMode: '专注模式',
      disableNotifications: '禁用通知',
      blockWebsites: '屏蔽网站',
      showProgressInTitle: '在标题栏显示进度',
      notifications: '通知设置',
      enableNotifications: '启用通知',
      notificationsDescription: '会话结束时显示通知',
      enableSounds: '启用声音',
      soundVolume: '音量',
      soundNotifications: '声音通知',
      soundNotificationsDescription: '播放提示音',
      fullscreenMode: '全屏模式',
      fullscreenModeDescription: '专注时进入全屏模式',
    },
    stats: {
      title: '统计报告',
      thisWeek: '本周',
      thisMonth: '本月',
      thisQuarter: '本季度',
      totalSessions: '总会话数',
      completedSessions: '已完成会话',
      totalFocusTime: '总专注时长',
      avgProductivity: '平均生产力',
      dailySessions: '每日会话',
      productivityTrend: '生产力趋势',
      timeDistribution: '时间分布',
      workTime: '工作时间',
      breakTime: '休息时间',
      completionRate: '完成率',
      of: '的',
      sessionsCompleted: '会话已完成',
      recentSessions: '最近会话',
      date: '日期',
      task: '任务',
      duration: '时长',
      status: '状态',
      productivity: '生产力',
    },
    // 会话状态
    status: {
      completed: '已完成',
      cancelled: '已取消',
      paused: '已暂停',
      running: '进行中',
      pending: '待开始',
    },
    // 计时器状态
    readyToStart: '准备开始',
    focusTime: '专注时间',
    breakTime: '休息时间',
    focusSession: '专注会话',
    workingOn: '正在进行',
    remaining: '剩余时间',

    // 按钮操作
    start: '开始',
    pause: '暂停',
    resume: '继续',
    abort:'取消',
    completed: '完成',

    // 模式切换
    focusModeOn: '专注模式开启',
    focusModeOff: '专注模式关闭',

    // 统计信息
    todaySessions: '今日会话',
    focusTimeTotal: '专注时长',

    // 快速操作
    quickActions: '快速操作',
    selectTask: '选择任务',
    selectTaskOptions: {
      button: '选择任务',
      noTasks: '暂无任务',
      estimatedPomodoros: '预估 {count} 个番茄钟',
      startWithoutTask: '不选择任务开始',
    },
    templates: '模板',
    statistics: '统计',
    
    // 历史记录页面
    history: {
      title: '历史记录',
      allStatuses: '所有状态',
      totalSessions: '总会话数',
      completed: '已完成',
      totalTime: '总时长',
      avgProductivity: '平均生产力',
      sessions: '会话记录',
      showing: '显示第 {start} - {end} 条，共 {total} 条',
      date: '日期',
      task: '任务',
      template: '模板',
      duration: '时长',
      status: '状态',
      productivity: '生产力',
      actions: '操作',
      planned: '计划',
      noSessions: '暂无会话记录',
      viewTask: '查看任务',
    },

    // 任务选择对话框
    taskSelector: {
      title: '选择任务',
      noTasks: '暂无任务',
      searchPlaceholder: '搜索任务...',
      createNew: '创建新任务',
      withoutTask: '不关联任务',
    },

    // 完成会话对话框
    completeModal: {
      title: '完成会话',
      message: '恭喜完成这个番茄钟会话！',
      duration: '时长: {duration}',
      addNotes: '添加备注',
      notesPlaceholder: '记录这次会话的心得...',
      markTaskComplete: '标记任务完成',
    },

    // 会话完成相关
    complete: {
      duration: '时长: {duration}',
      productivityRating: '生产力评级',
      rating: {
        poor: '较差',
        fair: '一般',
        good: '良好',
        veryGood: '很好',
        excellent: '优秀',
      },
      notes: '会话备注',
      notesPlaceholder: '记录这次会话的心得和收获...',
      breakSuggestion: {
        title: '建议休息一下',
        message: '您已经完成了一个专注会话，建议休息5-15分钟来恢复精力。',
      },
      confirm: '确认完成',
    },

    // 取消会话对话框
    cancelModal: {
      title: '取消会话',
      message: '确定要取消当前会话吗？',
      reason: '取消原因',
      reasonPlaceholder: '请简述取消原因...',
      confirm: '确定取消',
    },

    // 取消会话相关
    cancel: {
      timeSpent: '已用时间: {duration}',
      warning: {
        title: '取消会话提醒',
        message: '取消会话将丢失当前进度，且不会记录为已完成的番茄钟。',
      },
      reason: '取消原因',
      selectReason: '请选择取消原因',
      reasons: {
        interruption: '外部干扰',
        urgentTask: '紧急任务',
        feelingUnwell: '身体不适',
        distraction: '注意力分散',
        other: '其他原因',
      },
      notes: '备注说明',
      notesPlaceholder: '请详细说明取消的原因...',
      confirm: '确认取消',
    },
  },

  // 任务相关（用于 tasks.status.* 键）
  tasks: {
    status: {
      todo: '待办',
      in_progress: '进行中',
      working: '进行中',
      done: '已完成',
      completed: '已完成',
      pending: '待处理',
    },
  },

  // 任务日历
  taskCalendar: {
    title: '任务日历',
    todayView: '今日',
    weekView: '本周',
    monthView: '本月',
    today: '今天',
    noTime: '无时间',
    moreTasks: '更多任务',
  },
  
  // Dashboard
  dashboard: {
    // Welcome section
    welcomeMessage: '今天是 {date}，让我们高效完成今天的目标吧！',
    
    // Section headers
    todayTasks: '今日任务',
    todayHabits: '今日习惯',
    activeGoals: '进行中的目标',
    pomodoroTimer: '番茄钟',
    todayStats: '今日统计',
    
    // Common actions
    more: '更多',
    noTasks: '暂无任务',
    noHabits: '暂无习惯',
    noGoals: '暂无目标',
    
    // Task related
    taskCompleted: '已完成',
    markComplete: '标记完成',
    
    // Habit related
    consecutiveDays: '连续 {count} 天',
    goalTarget: '目标: {target}',
    
    // Pomodoro states
    focusTime: '专注时间',
    shortBreak: '短休息',
    longBreak: '长休息',
    readyToStart: '准备开始',
    pause: '暂停',
    start: '开始',
    reset: '重置',
    
    // Statistics
    completedTasks: '已完成任务',
    completedHabits: '已完成习惯',
    pomodoroSessions: '番茄钟次数',
    avgGoalProgress: '目标平均进度',
    
    // Priority levels
    highPriority: '高优先级',
    mediumPriority: '中优先级',
    lowPriority: '低优先级',
    normalPriority: '普通',
    
    // Frequency types
    daily: '每日',
    weekly: '每周',
    monthly: '每月',
    custom: '自定义',
    
    // Date related
    notSet: '未设置',
    dueDate: '截止: {date}',
  },
}
