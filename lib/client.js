window.__ModuleLoader__.load({
  // dsh-prism：DSH Web 界面的三档模式插件（原生 / 整洁 / 白话）。单文件浏览器半体，  
  //   零构建、零依赖，纯展示层（不改模型的输入输出）。改完刷新页面即生效。
  id: "dsh-prism",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    const React = require("react");

    // ============================================================
    // 〇、国际化：跟随产品语言（ctx.locale），zh/en 双语文案。
    //   组件文案走 STR 表 + t()；规则表文案走各规则的 doingEn/doneEn
    //   与 ARG_NAME_RULES 的 labelEn（缺省回退中文）。语言由 apply
    //   从 ctx.locale 初始化并在 locale/change 时更新。
    // ============================================================
    let lang = 'zh';

    function t(key) {
      const d = lang === 'en' ? STR_EN : STR_ZH;
      return d[key] !== undefined ? d[key] : STR_ZH[key];
    }

    // 版本：只用于界面标识与排错，改版本号时同步 package.json
    const PRISM_VERSION = '1.14.1';

    const STR_ZH = {
      interfaceMode: '界面模式',
      fabTitle: '界面模式（当前：',
      fabTitleEnd: '）',
      simple: '白话',
      simpleNote: '术语换成大白话，更好懂',
      medium: '整洁',
      mediumNote: '工具流归组，行用产品原版语言',
      native: '原生',
      nativeNote: '产品完整原貌',
      simpleOptions: '简化档选项',
      hideComplex: '隐藏复杂工具',
      hintSimpleOn: '高级操作折叠成一行，点「展开」可查看',
      hintSimpleOff: '高级操作与普通工具一样完整显示',
      hintMedium: '工具调用收成一行，展开后每行按原版样式显示',
      hintNative: '此档始终完整显示，此选项不生效',
      toolsUnit: ' 个工具',
      thoughtsUnit: ' 次思考',
      thisCall: '本次调用 ',
      spanCall: '本段 ',
      expand: '展开 ▾',
      collapse: '收起 ▴',
      collapseWord: '点击收起',
      groupTitle: '本次工具调用：',
      clickToExpand: '，点击展开',
      groupNote: '每行记录一次工具调用，点行可查看脱敏后的处理详情。',
      argsLabel: '参数',
      moreLines: '还有 ',
      moreLinesTail: ' 行 · ',
      moreCharsTail: ' 字符 · ',
      showAll: '展开全部',
      collapseAll: '收起',
      resultLabel: '结果：',
      sigPrefix: '信号 ',
      exitPrefix: '退出码 ',
      copyWord: '复制',
      copiedWord: '已复制',
      noOutputWord: '（没有输出）',
      readWindowA: '共 ',
      readWindowB: ' 行',
      expandWord: '展开',
      running: '运行中',
      hadErrors: '有出错',
      nonzeroExit: '命令返回非零',
      done: '已完成',
      inProgress: '进行中',
      error: '出错',
      doingAuto: '正在执行「',
      doingAutoEnd: '」',
      argDoing: '正在',
      doneAuto: '「',
      doneAutoEnd: '」执行完毕',
      retriesUnit: ' 次重试',
      retrySummary: '重试 ',
      retryAttempts: '尝试 ',
      retryFailed: ' 次未成功',
      retryNote: '重试行由官方原样显示，这里只汇总次数。',
      thinkingDone: '思考完成',
      stepDone: '步骤完成',
      stoppedNote: '（已停止）',
      expandThought: '展开思考',
      collapseThought: '收起思考',
      thinkingLabel: '思考',
      exitCodePrefix: '退出码 ',
      busyOrdinal: '第 ',
      busyItem: ' 件 · ',
      thinkingNow: '思考中',
      imageBlockNote: '（此处有一张图片，当前环境未能渲染）',
    };

    const STR_EN = {
      interfaceMode: 'Interface mode',
      fabTitle: 'Interface mode (current: ',
      fabTitleEnd: ')',
      simple: 'Plain',
      simpleNote: 'Plain speech instead of jargon',
      medium: 'Tidy',
      mediumNote: 'Grouped tool flow, product row language',
      native: 'Native',
      nativeNote: 'The full shipped interface',
      simpleOptions: 'Simple mode options',
      hideComplex: 'Hide complex tools',
      hintSimpleOn: 'Advanced tools fold into one line; click "Expand" to view',
      hintSimpleOff: 'Advanced tools show in full like normal tools',
      hintMedium: 'Tool calls collapse into one line; expanded rows use the native row style',
      hintNative: 'This tier always shows everything; this option is inactive',
      toolsUnit: ' tools',
      thoughtsUnit: ' thoughts',
      thisCall: 'This call: ',
      spanCall: 'This span: ',
      expand: 'Expand ▾',
      collapse: 'Collapse ▴',
      collapseWord: 'Click to collapse',
      groupTitle: 'Tool calls: ',
      clickToExpand: ', click to expand',
      groupNote: 'Each row is one tool call; click a row for redacted details.',
      argsLabel: 'Arguments',
      moreLines: '',
      moreLinesTail: ' more lines · ',
      moreCharsTail: ' more chars · ',
      showAll: 'Show all',
      collapseAll: 'Collapse',
      resultLabel: 'Result: ',
      sigPrefix: 'Signal ',
      exitPrefix: 'Exit code ',
      copyWord: 'Copy',
      copiedWord: 'Copied',
      noOutputWord: '(no output)',
      readWindowA: '',
      readWindowB: ' lines',
      expandWord: 'Expand',
      running: 'Running',
      hadErrors: 'Had errors',
      nonzeroExit: 'Command exited non-zero',
      done: 'Done',
      inProgress: 'In progress',
      error: 'Error',
      doingAuto: 'Running "',
      doingAutoEnd: '"',
      argDoing: 'Running ',
      doneAuto: '"',
      doneAutoEnd: '" finished',
      retriesUnit: ' retries',
      retrySummary: 'Retries: ',
      retryAttempts: 'attempts ',
      retryFailed: ' failed',
      retryNote: 'Retry rows stay as the product renders them; this only counts them.',
      thinkingDone: 'Thinking done',
      stepDone: 'Step done',
      stoppedNote: ' (stopped)',
      expandThought: 'Show thinking',
      collapseThought: 'Hide thinking',
      thinkingLabel: 'Thinking',
      exitCodePrefix: 'exit code ',
      busyOrdinal: '',
      busyItem: ' · ',
      thinkingNow: 'Thinking',
      imageBlockNote: '(an image here could not be rendered in this environment)',
    };

    // ============================================================
    // 一、工具规则表：工具名 → 白话文案
    //   每条规则：tools 工具名；doing/done 白话文案；complex 标记
    //   「复杂工具」（简化档默认折叠成一行，可展开）；noArgs 表示不显示
    //   参数摘要；arg 声明参数摘要（完整字段说明见 README「规则表」）：
    //     pick 候选参数键（按序取第一个非空），mode 呈现方式
    //     （file=路径只留文件名 / raw=原文 / short=截断配 max /
    //     count=数组计数配 unit / wrap=（值）包裹 / fixed=固定文案），
    //     prefix 前缀，fallback 参数缺省时的文案（缺省则不显示摘要）
    //   未来新增工具：表里加一行（只写 tools 也能工作，doing/done 与
    //   参数摘要会自动生成），卡片自动注册，无需改动其他代码。
    // ============================================================
    const TOOL_RULES = [
      // —— 日常工具 ——
      { tools: ['read'], doing: '正在读取一个文件的内容', done: '文件读完了', doingEn: 'Reading a file', doneEn: 'File read', arg: { pick: ['file_path'], mode: 'file', prefix: '读取文件', prefixEn: 'Reading', fallback: '读取文件', fallbackEn: 'Reading file' } },
      { tools: ['write'], doing: '正在创建或覆盖一个文件', done: '文件写好了', doingEn: 'Writing a file', doneEn: 'File written', arg: { pick: ['file_path'], mode: 'file', prefix: '写入文件', prefixEn: 'Writing', fallback: '写入文件', fallbackEn: 'Writing file' } },
      { tools: ['edit'], doing: '正在修改文件里的某段文字', done: '修改完成', doingEn: 'Editing a file', doneEn: 'Edit done', arg: { pick: ['file_path'], mode: 'file', prefix: '修改文件', prefixEn: 'Editing', fallback: '修改文件', fallbackEn: 'Editing file' } },
      { tools: ['read_image'], doing: '正在读取一张图片', done: '图片读好了', doingEn: 'Reading an image', doneEn: 'Image read', arg: { pick: ['file_path'], mode: 'file', prefix: '读取图片', prefixEn: 'Reading', fallback: '读取图片', fallbackEn: 'Reading image' } },
      { tools: ['glob'], doing: '正在按文件名规则查找文件', done: '查找完成', doingEn: 'Finding files by pattern', doneEn: 'Search done', arg: { pick: ['pattern'], mode: 'raw', prefix: '按规则查找', prefixEn: 'Finding', fallback: '查找文件', fallbackEn: 'Finding files' } },
      { tools: ['grep'], doing: '正在文件内容里搜索关键词', done: '搜索完成', doingEn: 'Searching file contents', doneEn: 'Search done', arg: { pick: ['pattern'], mode: 'raw', prefix: '搜索内容', prefixEn: 'Searching', fallback: '搜索文件内容', fallbackEn: 'Searching file contents' } },
      { tools: ['web_search'], doing: '正在上网搜索信息', done: '搜索完成', doingEn: 'Searching the web', doneEn: 'Search done', arg: { pick: ['query'], mode: 'raw', prefix: '搜索', prefixEn: 'Searching', fallback: '上网搜索', fallbackEn: 'Web search' } },
      { tools: ['web_fetch'], doing: '正在抓取网页内容', done: '网页抓取完成', doingEn: 'Fetching a web page', doneEn: 'Page fetched', arg: { pick: ['url', 'query'], mode: 'raw', prefix: '抓取', prefixEn: 'Fetching', fallback: '抓取网页', fallbackEn: 'Fetching a page' } },
      { tools: ['skill'], doing: '正在学习一项技能的使用说明', done: '技能已学会，可以继续了', doingEn: 'Learning a skill', doneEn: 'Skill loaded', arg: { pick: ['name'], mode: 'raw', prefix: '学习技能', prefixEn: 'Learning', fallback: '学习一个技能', fallbackEn: 'Learning a skill' } },
      { tools: ['todo_write'], doing: '正在更新任务清单', done: '任务清单已更新', doingEn: 'Updating the task list', doneEn: 'Task list updated', arg: { pick: ['todos'], mode: 'count', prefix: '更新任务清单（', prefixEn: 'Task list (', unit: ' 项）', unitEn: ' items)' } },
      { tools: ['ask_user_question'], doing: '正在向您提问，等您回答', done: '等待您回答', doingEn: 'Asking you a question', doneEn: 'Waiting for your answer', arg: { pick: ['questions'], mode: 'count', prefix: '向您提 ', prefixEn: 'Asking you ', unit: ' 个问题', unitEn: ' questions' } },
      { tools: ['pwsh'], doing: '正在电脑上执行一条命令', done: '命令执行完毕', doingEn: 'Running a command', doneEn: 'Command done', arg: { pick: ['command'], mode: 'short', max: 80, prefix: '执行命令', prefixEn: 'Running', fallback: '执行一条命令', fallbackEn: 'Running a command' } },

      // —— 目标与计划（复杂）——
      { tools: ['get_goal'], doing: '正在读取当前目标', done: '目标已读取', doingEn: 'Reading the current goal', doneEn: 'Goal read', complex: true, noArgs: true },
      { tools: ['create_goal'], doing: '正在创建目标', done: '目标已创建', doingEn: 'Creating a goal', doneEn: 'Goal created', complex: true, arg: { pick: ['objective'], mode: 'short', max: 60, prefix: '目标', prefixEn: 'Goal', fallback: '创建目标', fallbackEn: 'Creating a goal' } },
      { tools: ['update_goal'], doing: '正在更新目标', done: '目标已更新', doingEn: 'Updating the goal', doneEn: 'Goal updated', complex: true, arg: { pick: ['action'], mode: 'wrap', prefix: '更新目标', prefixEn: 'Updating', fallback: '更新目标', fallbackEn: 'Updating goal' } },
      { tools: ['exit_plan_mode'], doing: '正在提交计划供您审阅', done: '计划已提交', doingEn: 'Submitting the plan for review', doneEn: 'Plan submitted', complex: true, arg: { mode: 'fixed', prefix: '提交计划，等您审阅', prefixEn: 'Plan submitted for your review' } },

      // —— 子代理与任务编排（复杂）——
      { tools: ['send_message'], doing: '正在给子代理发送消息', done: '消息已送达', doingEn: 'Sending a message to the subagent', doneEn: 'Message delivered', complex: true, arg: { pick: ['message'], mode: 'short', max: 60, prefix: '发消息', prefixEn: 'Sending', fallback: '给子代理发消息', fallbackEn: 'Sending to subagent' } },
      { tools: ['interrupt_agent'], doing: '正在打断子代理', done: '已请求打断', doingEn: 'Interrupting the subagent', doneEn: 'Interrupt requested', complex: true, arg: { pick: ['agent_id'], mode: 'raw', prefix: '打断子代理', prefixEn: 'Interrupting', fallback: '打断子代理', fallbackEn: 'Interrupting subagent' } },
      { tools: ['list_agents'], doing: '正在列出子代理', done: '列表已生成', doingEn: 'Listing subagents', doneEn: 'List ready', complex: true, noArgs: true },
      { tools: ['subagent'], doing: '正在派一个子代理去干活', done: '子代理已派出', doingEn: 'Dispatching a subagent', doneEn: 'Subagent dispatched', complex: true, arg: { pick: ['description'], mode: 'raw', prefix: '子代理任务', prefixEn: 'Subagent', fallback: '派子代理干活', fallbackEn: 'Dispatching subagent' } },
      { tools: ['subagent_fork'], doing: '正在派一个子代理继续当前工作', done: '子代理已派出', doingEn: 'Dispatching a subagent to continue', doneEn: 'Subagent dispatched', complex: true, arg: { pick: ['description'], mode: 'raw', prefix: '子代理任务', prefixEn: 'Subagent', fallback: '派子代理干活', fallbackEn: 'Dispatching subagent' } },
      { tools: ['workflow'], doing: '正在编排多个代理协作', done: '协作完成', doingEn: 'Orchestrating agents', doneEn: 'Collaboration done', complex: true, noArgs: true },
      { tools: ['ralph'], doing: '正在循环迭代推进目标', done: '迭代完成', doingEn: 'Iterating toward the goal', doneEn: 'Iteration done', complex: true, arg: { pick: ['objective'], mode: 'short', max: 60, prefix: '目标', prefixEn: 'Goal', fallback: '循环迭代', fallbackEn: 'Iterating' } },

      // —— 后台任务（复杂）——
      { tools: ['job_output'], doing: '正在读取后台任务的结果', done: '结果读取完成', doingEn: 'Reading the background job result', doneEn: 'Result read', complex: true, arg: { pick: ['job_id'], mode: 'raw', prefix: '后台任务', prefixEn: 'Job', fallback: '操作后台任务', fallbackEn: 'Operating a job' } },
      { tools: ['job_list'], doing: '正在列出后台任务', done: '任务列表已生成', doingEn: 'Listing background jobs', doneEn: 'List ready', complex: true, noArgs: true },
      { tools: ['job_kill'], doing: '正在停止一个后台任务', done: '任务已停止', doingEn: 'Stopping a background job', doneEn: 'Job stopped', complex: true, arg: { pick: ['job_id'], mode: 'raw', prefix: '后台任务', prefixEn: 'Job', fallback: '操作后台任务', fallbackEn: 'Operating a job' } },

      // —— 插件系统（复杂）——
      { tools: ['cordis_inspect_list'], doing: '正在查看可用的插件能力', done: '能力清单已获取', doingEn: 'Listing plugin capabilities', doneEn: 'Capabilities fetched', complex: true, noArgs: true },
      { tools: ['cordis_inspect_query'], doing: '正在查看某个接口的详细信息', done: '信息已获取', doingEn: 'Inspecting an interface', doneEn: 'Info fetched', complex: true, arg: { pick: ['provider'], mode: 'raw', prefix: '查看接口', prefixEn: 'Inspecting', fallback: '查看接口详情', fallbackEn: 'Inspecting interface' } },
      { tools: ['cordis_inspect_self'], doing: '正在查看自身插件的状态', done: '状态已获取', doingEn: 'Inspecting the plugin itself', doneEn: 'Status fetched', complex: true, noArgs: true },
      { tools: ['cordis_define'], doing: '正在定义一个插件', done: '插件已定义', doingEn: 'Defining a plugin', doneEn: 'Plugin defined', complex: true, arg: { pick: ['pluginId'], mode: 'raw', prefix: '插件', prefixEn: 'Plugin', fallback: '操作插件', fallbackEn: 'Operating plugin' } },
      { tools: ['cordis_run'], doing: '正在启动一个插件', done: '插件已启动', doingEn: 'Starting a plugin', doneEn: 'Plugin started', complex: true, arg: { pick: ['pluginId'], mode: 'raw', prefix: '插件', prefixEn: 'Plugin', fallback: '操作插件', fallbackEn: 'Operating plugin' } },
      { tools: ['cordis_stop'], doing: '正在停用一个插件', done: '插件已停止', doingEn: 'Stopping a plugin', doneEn: 'Plugin stopped', complex: true, arg: { pick: ['pluginId'], mode: 'raw', prefix: '插件', prefixEn: 'Plugin', fallback: '操作插件', fallbackEn: 'Operating plugin' } },
      { tools: ['cordis_undefine'], doing: '正在删除一个插件', done: '插件已删除', doingEn: 'Removing a plugin', doneEn: 'Plugin removed', complex: true, arg: { pick: ['pluginId'], mode: 'raw', prefix: '插件', prefixEn: 'Plugin', fallback: '操作插件', fallbackEn: 'Operating plugin' } },
    ];

    // ============================================================
    // 二、参数名规则：没有显式 arg 的工具（含未来新增工具）按参数名
    // 自动生成白话摘要，按顺序先命中先使用；敏感参数名永不展示。
    // ============================================================
    const ARG_NAME_RULES = [
      { keys: ['file_path', 'path', 'dir', 'directory', 'folder', 'filename'], mode: 'file', label: '文件', labelEn: 'File' },
      { keys: ['url', 'link', 'href', 'endpoint'], mode: 'raw', label: '链接', labelEn: 'Link' },
      { keys: ['query', 'question', 'search', 'keyword', 'pattern', 'glob'], mode: 'raw', label: '关键词', labelEn: 'Keyword' },
      { keys: ['command', 'cmd', 'script', 'shell'], mode: 'short', max: 80, label: '命令', labelEn: 'Command' },
      { keys: ['name', 'title', 'label'], mode: 'raw', label: '名称', labelEn: 'Name' },
      { keys: ['objective', 'goal', 'target', 'purpose', 'reason'], mode: 'short', max: 60, label: '目标', labelEn: 'Goal' },
      { keys: ['description', 'message', 'content', 'text', 'body'], mode: 'short', max: 60, label: '内容', labelEn: 'Content' },
      { keys: ['code', 'source', 'program', 'data', 'value'], mode: 'short', max: 60, label: '内容', labelEn: 'Content' },
      { keys: ['id', 'job_id', 'agent_id', 'pluginId', 'packageId', 'call_id', 'uid'], mode: 'id', label: '标识', labelEn: 'ID' },
      { keys: ['model', 'provider', 'engine'], mode: 'raw', label: '模型', labelEn: 'Model' },
    ];

    // 敏感参数名：值在任何情况下都不展示（脱敏底线）。
    const SENSITIVE_KEY = /(token|secret|password|passwd|credential|api[_-]?key|authorization|access[_-]?key|private[_-]?key)/i;

    function ruleFor(name) {
      for (var i = 0; i < TOOL_RULES.length; i++) {
        if (TOOL_RULES[i].tools.indexOf(name) !== -1) return TOOL_RULES[i];
      }
      return null;
    }

    // ============================================================
    // 四、纯函数工具
    // ============================================================
    function shorten(s, n) {
      if (typeof s !== 'string') return '';
      return s.length > n ? s.slice(0, n) + '…' : s;
    }

    function basename(p) {
      if (typeof p !== 'string') return p;
      const parts = p.split(/[\\/]/);
      return parts[parts.length - 1] || p;
    }

    // 耗时：调用时刻与结果时刻之差。产品投影里两处都给了
    //   已结算：block.callTime（调用时刻）与 block.time（结果时刻）；
    //   进行中：block.time（调用时刻）。
    function numberOrNull(v) {
      return typeof v === 'number' && isFinite(v) ? v : null;
    }

    function blockCallTime(block) {
      if (!block) return null;
      var t = numberOrNull(block.callTime);
      if (t !== null) return t;
      t = numberOrNull(block.time);
      if (t !== null) return t;
      return numberOrNull(block.call && block.call.time);
    }

    function blockResultTime(block) {
      if (!block || block.kind !== 'tool-result') return null;
      return numberOrNull(block.time);
    }

    function formatDuration(ms) {
      if (typeof ms !== 'number' || !isFinite(ms) || ms < 0) return '';
      if (ms < 1000) return '<1s';
      if (ms < 60000) return (ms / 1000).toFixed(1) + 's';
      var m = Math.floor(ms / 60000);
      var s = Math.floor((ms % 60000) / 1000);
      if (m < 60) return m + 'm' + (s < 10 ? '0' + s : s) + 's';
      return Math.floor(m / 60) + 'h' + (m % 60 < 10 ? '0' + (m % 60) : m % 60) + 'm';
    }

    // 行耗时文案：已结算取差值，进行中取「至今」。
    function durationTextOf(block, settled, nowMs) {
      var start = blockCallTime(block);
      if (start === null) return '';
      if (settled) {
        var end = blockResultTime(block) || start;
        return formatDuration(end - start);
      }
      if (typeof nowMs !== 'number') return '';
      return formatDuration(nowMs - start);
    }

    // 简化档 / 整洁档展示脱敏：常见密钥形态替换为占位符（仅影响展示，不改动数据）。
    function redact(text) {
      if (typeof text !== 'string') return text;
      return text
        .replace(/\b(sk|pk|rk)-[A-Za-z0-9_-]{16,}\b/g, '$1-••••••')
        .replace(/\b(Bearer|Authorization|X-API-Key)\s+[A-Za-z0-9._~+/=-]{12,}\b/gi, '$1 ••••')
        // URL 查询串里的凭据形态（?token= / &api_key= / &sig= 等）：整段值替换
        .replace(/([?&](?:token|access[_-]?token|api[_-]?key|apikey|key|secret|signature|sig|password)=)[^&\s"']{6,}/gi, '$1••••')
        .replace(/(api[_-]?key|access[_-]?token|secret|password|passwd)["']?\s*[:=]\s*["']?[^\s"']{8,}["']?/gi, '$1=••••');
    }

    // JSON 文本兜底：序列化失败也要给出一行能看的东西，不许抛。
    function safeJsonText(v) {
      try { return JSON.stringify(v, null, 2); } catch (e) { return String(v); }
    }

    function resultText(block) {
      if (!block || block.kind !== 'tool-result') return '';
      const content = block.content || [];
      let out = '';
      for (let i = 0; i < content.length; i++) {
        const b = content[i];
        if (b && b.type === 'text' && typeof b.text === 'string') out += b.text;
      }
      return out;
    }

    // 命令退出码：产品的 shell 结果在**文本里**写 `[exit code: N]`（见
    //   packages/shell/tool-bash/src/render.ts），而不是设 isError —— 非零退出
    //   只算「命令跑完了但失败」，不算工具调用错误。所以失败判定不能只看
    //   isError，否则 `exit 3` 这类会显示成绿勾。
    //   锚定与产品 parseExitStatus 一字不差（dsh-shell/render.ts 的同款契约）：
    //   标记必须落在结果的**最后一行**（前置换行 + 行尾锚定），正文里恰好
    //   出现同款字样不算（v1.14.1 收锚：全文裸搜会把「读到/写到含此字样的
    //   文本」误当非零）。本函数只能有这一份：v1.14.0 在结果区加过一份同名
    //   副本（不匹配返回 undefined）把它盖掉，而判据写的是 code !== null
    //   —— undefined !== null 恒真，一切无标记文本（正常成功的工具）
    //   全被判「非零退出」：行级全红叉、段级计数归零（v1.14.1 合并修复）。
    function exitCodeOf(text) {
      if (typeof text !== 'string' || text === '') return null;
      const m = /\n\[exit code: (\d+)\]$/.exec(text);
      return m ? Number(m[1]) : null;
    }

    // 一行（工具调用或重试链）的结论：'ok' | 'err' | 'running'
    function outcomeOf(root) {
      if (!root || root.kind !== 'tool-result') return 'running';
      if (root.isError === true) return 'err';
      const code = exitCodeOf(resultText(root));
      return code != null && code !== 0 ? 'err' : 'ok';   // != null：null / undefined 都算「没找到」，防同类漂移
    }

    function firstKey(args, keys) {
      if (!args || typeof args !== 'object') return undefined;
      for (var i = 0; i < keys.length; i++) {
        var v = args[keys[i]];
        if (typeof v === 'string' && v !== '') return keys[i];
      }
      return undefined;
    }

    function pickArg(args, keys) {
      var k = firstKey(args, keys);
      return k === undefined ? undefined : args[k];
    }

    // 语言化辅助：规则 label / arg 文本按当前语言取；冒号分隔符随语言。
    function labelOf(rule) { return lang === 'en' ? (rule.labelEn || rule.label) : rule.label; }
    function textOf(obj, zhKey, enKey) { return lang === 'en' ? (obj[enKey] || obj[zhKey]) : obj[zhKey]; }
    function colon() { return lang === 'en' ? ': ' : '：'; }

    // 无显式 arg 规则时的自动摘要：按参数名规则取第一个非敏感命中。
    function autoArgs(args) {
      if (!args || typeof args !== 'object') return '';
      for (var i = 0; i < ARG_NAME_RULES.length; i++) {
        var r = ARG_NAME_RULES[i];
        var k = firstKey(args, r.keys);
        if (k === undefined) continue;
        if (SENSITIVE_KEY.test(k)) continue;
        var v = args[k];
        if (r.mode === 'file') return labelOf(r) + colon() + basename(v);
        if (r.mode === 'short') return labelOf(r) + colon() + shorten(v, r.max);
        if (r.mode === 'id') return labelOf(r) + colon() + shorten(v, 24);
        return labelOf(r) + colon() + shorten(v, 40);
      }
      return '';
    }

    // 参数摘要：有显式 arg 规则走规则；否则走参数名自动规则。
    function plainArgs(toolName, argsRaw) {
      var args = null;
      if (argsRaw) { try { args = JSON.parse(argsRaw); } catch (e) { args = null; } }
      var rule = ruleFor(toolName);
      if (!rule) return autoArgs(args);
      if (rule.noArgs) return '';
      var spec = rule.arg;
      if (!spec) return autoArgs(args);
      if (spec.mode === 'fixed') return textOf(spec, 'prefix', 'prefixEn');
      if (spec.mode === 'count') {
        var list = args && args[spec.pick[0]];
        return textOf(spec, 'prefix', 'prefixEn') + (Array.isArray(list) ? list.length : 0) + textOf(spec, 'unit', 'unitEn');
      }
      var v = pickArg(args, spec.pick);
      if (v === undefined) return textOf(spec, 'fallback', 'fallbackEn') || '';
      if (spec.mode === 'file') return textOf(spec, 'prefix', 'prefixEn') + colon() + basename(v);
      if (spec.mode === 'wrap') return textOf(spec, 'prefix', 'prefixEn') + (lang === 'en' ? ' (' + v + ')' : '（' + v + '）');
      if (spec.mode === 'short') return textOf(spec, 'prefix', 'prefixEn') + colon() + shorten(v, spec.max);
      return textOf(spec, 'prefix', 'prefixEn') + colon() + v;
    }

    // ============================================================
    // 五、工具类别图标：时间线行首 emoji，按工具名精确匹配或
    //    前缀匹配，未命中回退 ⚙️。
    // ============================================================
    const TOOL_ICONS = [
      { keys: ['read', 'write', 'edit', 'glob', 'grep', 'read_image'], icon: '📄' },
      { keys: ['pwsh'], icon: '🖥️' },
      { keys: ['web_search', 'web_fetch'], icon: '🌐' },
      { keys: ['skill'], icon: '📘' },
      { keys: ['todo_write'], icon: '📋' },
      { keys: ['ask_user_question'], icon: '❓' },
      { keys: ['get_goal', 'create_goal', 'update_goal', 'exit_plan_mode'], icon: '🎯' },
      { keys: ['send_message', 'interrupt_agent', 'list_agents', 'subagent', 'subagent_fork', 'workflow', 'ralph'], icon: '🤖' },
      { keys: ['job_output', 'job_list', 'job_kill'], icon: '⏱️' },
      { keys: ['cordis_inspect_list', 'cordis_inspect_query', 'cordis_inspect_self'], icon: '🧩' },
    ];

    function toolIcon(name) {
      if (typeof name !== 'string') return '⚙️';
      var i, j;
      // 先精确匹配
      for (i = 0; i < TOOL_ICONS.length; i++) {
        if (TOOL_ICONS[i].keys.indexOf(name) !== -1) return TOOL_ICONS[i].icon;
      }
      // 再前缀匹配（覆盖未来同名前缀的新工具）
      for (i = 0; i < TOOL_ICONS.length; i++) {
        for (j = 0; j < TOOL_ICONS[i].keys.length; j++) {
          if (name.indexOf(TOOL_ICONS[i].keys[j]) === 0) return TOOL_ICONS[i].icon;
        }
      }
      return '⚙️';
    }

    // ============================================================
    // 六、交付文档渲染：脱敏后的结果文本 → 官方 MarkdownText
    //   阶梯第 2 级（代码库里已有就复用）：宿主 ui-primitives 自带
    //   MarkdownText，表格 / 标题 / 列表 / 代码块 / 链接 / 脚注一应俱全，
    //   还自带代码复制按钮。此前这里是一份约 165 行的手写解析器，v1.4.0 删。
    //   primitives 不可用时退回 pre-wrap 纯文本，绝不抛异常。
    // ============================================================
    const MD_LABELS_ZH = { code: { copyLabel: '复制', copiedLabel: '已复制' }, footnotes: '脚注' };
    const MD_LABELS_EN = { code: { copyLabel: 'Copy', copiedLabel: 'Copied' }, footnotes: 'Footnotes' };
    function docLabels() { return lang === 'en' ? MD_LABELS_EN : MD_LABELS_ZH; }

    // 参数区（详情里那块「原生内容」）：
    //   简单参数（不多于三个标量）逐行给「键：值」，值**不截断**（命令就是要看全的）；
    //   复杂参数（数组 / 嵌套对象）交给官方 JsonBlock —— 它自带折叠与截断，与产品同款。
    //   脱敏底线不动：敏感键名整条不显示，字符串值过一遍密钥形态替换。
    function redactDeep(value, depth) {
      if (depth > 6) return '…';
      if (typeof value === 'string') return redact(value);
      if (Array.isArray(value)) return value.map(function (v) { return redactDeep(v, (depth || 0) + 1); });
      if (value && typeof value === 'object') {
        var out = {};
        var keys = Object.keys(value);
        for (var i = 0; i < keys.length; i++) {
          if (SENSITIVE_KEY.test(keys[i])) continue;
          out[keys[i]] = redactDeep(value[keys[i]], (depth || 0) + 1);
        }
        return out;
      }
      return value;
    }

    function parseArgs(argsRaw) {
      if (!argsRaw || typeof argsRaw !== 'string') return null;
      try {
        var v = JSON.parse(argsRaw);
        return v && typeof v === 'object' ? v : null;
      } catch (e) { return null; }
    }

    // 长参数闸：单个参数值超过 20 行或 1500 字符，就先给预览（前 6 行，或按字符切），
    //   点「展开全部」才铺开。命令、路径、关键词这类短参数一概不受影响。
    const LONG_ARG_CHARS = 1500;
    const LONG_ARG_LINES = 20;
    const ARG_PREVIEW_LINES = 6;
    const ARG_PREVIEW_CHARS = 600;
    const ARG_HARD_CAP = 200000;   // 超过这个体量连行都不切，直接按字符预览（免得给巨文本建大数组）

    function isLongArgText(text) {
      if (typeof text !== 'string') return false;
      return text.length > LONG_ARG_CHARS || text.split('\n').length > LONG_ARG_LINES;
    }

    function clipLongArg(text) {
      if (text.length <= ARG_HARD_CAP) {
        const lines = text.split('\n');
        if (lines.length > ARG_PREVIEW_LINES) {
          return { head: lines.slice(0, ARG_PREVIEW_LINES).join('\n'), more: lines.length - ARG_PREVIEW_LINES, unit: 'lines' };
        }
      }
      return { head: text.slice(0, ARG_PREVIEW_CHARS), more: Math.max(0, text.length - ARG_PREVIEW_CHARS), unit: 'chars' };
    }

    function ArgValue(props) {
      const text = props.text;
      const [open, setOpen] = React.useState(false);
      if (!isLongArgText(text)) return React.createElement('span', { className: 'prism-args-val' }, text);
      const clipped = clipLongArg(text);
      const toggle = function (e) {
        if (e && typeof e.stopPropagation === 'function') e.stopPropagation();   // 别把外层手风琴一起合上
        setOpen(!open);
      };
      const note = open ? t('collapseAll') : t('moreLines') + clipped.more
        + (clipped.unit === 'lines' ? t('moreLinesTail') : t('moreCharsTail')) + t('showAll');
      return React.createElement('span', { className: 'prism-args-val' },
        open ? text : clipped.head,
        React.createElement('span', Object.assign(
          clickableProps('prism-args-toggle', toggle, open),
          { title: open ? t('collapseAll') : t('showAll') },
        ), note),
      );
    }

    function ArgsBlock(props) {
      const parsed = parseArgs(props.argsRaw);
      if (parsed === null) {
        const raw = redact(typeof props.argsRaw === 'string' ? props.argsRaw : '');
        return raw === '' ? null : React.createElement('pre', { className: 'prism-doc-pre' }, raw);
      }
      const keys = Object.keys(parsed).filter(function (k) { return !SENSITIVE_KEY.test(k); });
      if (keys.length === 0) return null;
      const scalarOnly = keys.length <= 3 && keys.every(function (k) {
        const v = parsed[k];
        return typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean';
      });
      if (scalarOnly) {
        return React.createElement('div', { className: 'prism-args' },
          keys.map(function (k) {
            return React.createElement('div', { key: k, className: 'prism-args-line' },
              React.createElement('span', { className: 'prism-args-key' }, k + colon()),
              React.createElement(ArgValue, { text: redact(String(parsed[k])) }),
            );
          }),
        );
      }
      const P = props.primitives;
      const payload = redactDeep(parsed, 0);
      return P && P.JsonBlock
        ? React.createElement(P.JsonBlock, {
          label: t('argsLabel'),
          payload: payload,
          truncatedLabel: function (total) { return '… (' + total + ')'; },
        })
        : React.createElement('pre', { className: 'prism-doc-pre' }, safeJsonText(payload));
    }

    // 本地绝对路径的图片换成宿主同源文件接口：判据与产品完全一致
    //   （http(s) 页面 + 以单个 / 开头的绝对路径；安全校验仍在宿主侧）。
    function localPathMediaUrl(protocol, origin, value) {
      if (protocol !== 'http:' && protocol !== 'https:') return undefined;
      if (typeof value !== 'string' || value.length === 0) return undefined;
      if (value.charAt(0) !== '/' || value.indexOf('//') === 0) return undefined;
      return origin + '/api/file?path=' + encodeURIComponent(value);
    }

    // 一次构造、到处复用：MarkdownText 会按这个对象的身份做记忆，
    //   每次渲染新建一个会让它每个字符都重建组件表（产品那边也是 useMemo 固定引用）。
    let pathImagesRef = null;
    function pathImagesOf() {
      if (pathImagesRef === null && typeof window !== 'undefined' && window.location && window.location.origin) {
        pathImagesRef = {
          resolve: function (value) {
            return localPathMediaUrl(window.location.protocol, window.location.origin, value);
          },
        };
      }
      return pathImagesRef || undefined;
    }

    // 文件提及的归属：与产品一样，只属于「已闭合轮次的收尾消息」。
    //   取不到（旧宿主没给 fileMentions、或这条还不是收尾消息）就不传，不硬造。
    function turnTailOwnerOf(props, node, data) {
      const loc = node && node.location;
      if (!loc || (loc.kind !== 'turn' && loc.kind !== 'step')) return null;
      const turn = loc.turn;
      if (!turn || turn.status !== 'closed') return null;
      if (!data || !data.finalNode || typeof data.finalNode.seq !== 'number') return null;
      try {
        if (turn.data && typeof turn.data.get === 'function') {
          const tail = turn.data.get('turn-tail');
          const closing = tail && tail.closing;
          if (closing && closing.finalNode && closing.finalNode.seq !== data.finalNode.seq) return null;
        }
      } catch (e) { /* 契约变动：退回「不传」，比传错稳 */ }
      return { turn: turn, seq: data.finalNode.seq, openFile: props.openFile };
    }

    function DocBody(props) {
      const text = redact(props.text == null ? '' : String(props.text));
      const P = props.primitives;
      if (P && P.MarkdownText) {
        return React.createElement(P.MarkdownText, { text: text, labels: docLabels() });
      }
      return React.createElement('pre', {
        className: 'prism-doc-pre',
        style: { whiteSpace: 'pre-wrap', wordBreak: 'break-word' },
      }, text);
    }

    // ============================================================
    // ---- 结果区（v1.14.0）：能对上官方块的，走官方块 ----
    //   来由（2026-09-24 主人点名）：折叠卡片的前端不够自然。查下来，整洁档的「行」
    //   已经是官方 DisclosureRow，但**行里装的东西**还是自绘纯文本；而官方 ui-primitives
    //   里本来就有成套的语义块 —— 产品自己渲染工具结果用的正是它们（ui-tool 的
    //   ToolRow.tsx：TerminalBlock / ReadBlock / DiffBlock / SearchBlock / WebBlock）。
    //   这里按工具名分派，**只看手上确实有的数据**：拿不到就退回原来的交付文档。
    //   宁可朴素，绝不猜、不编（红线：一块都不许吞，也不许造）。
    //   搜索 / 网页 / 差异三类暂时仍走交付文档 —— 它们要的是产品 tool 插件自己塞进
    //   结果里的结构化元数据，这一层拿不到；靠解析文本反推会造出「看着对、其实错」的内容。
    // （这里曾有一份与数据层同名的 exitCodeOf：不匹配返回 undefined，
    //   被本节的官方块沿用，也把数据层的版本盖掉了 —— undefined 与 null
    //   判等为假，让一切无标记文本（正常成功的工具）被判「非零退出」。
    //   v1.14.1 合并回数据层一份，锚定与返回值口径详见那边的注释。）

    // read 的结果常带「行号→正文」前缀；剥掉它，行号按调用时的 offset 自己编。
    //   末尾的换行符不算一行（与 TerminalBlock 的高度口径一致）。
    function readLinesOf(text, args) {
      const a = args || {};
      const raw = String(text == null ? '' : text).split('\n');
      const stripped = raw.map(function (l) {
        return l.replace(/^\s*\d+→/, '').replace(/^\s*\d+\t/, '');
      });
      if (stripped.length > 1 && stripped[stripped.length - 1].trim() === '') stripped.pop();
      const offset = (typeof a.offset === 'number' && Number.isInteger(a.offset) && a.offset >= 1) ? a.offset : 1;
      return {
        lines: stripped.map(function (txt, i) { return { number: offset + i, text: txt }; }),
        total: offset + stripped.length - 1,
      };
    }

    // 判据只有一份：外层决定要不要去掉自绘底色，内层决定画官方块还是交付文档，
    //   两处口径必须一致，否则会出现「去了底色却画了纯文本」的半截样子。
    function officialBlockKind(name, meta) {
      if (!meta || !meta.settled || !meta.text) return null;
      if (name === 'pwsh' || name === 'bash') {
        const args = parseArgs(meta.argsRaw) || {};
        return typeof args.command === 'string' && args.command !== '' ? 'terminal' : null;
      }
      if (name === 'read') {
        const args = parseArgs(meta.argsRaw) || {};
        return readLinesOf(meta.text, args).lines.length > 0 ? 'read' : null;
      }
      return null;
    }

    // 官方块已经自己说清楚的那几个参数，不再在外层参数区重复一遍（v1.14.0 第二处打磨）：
    //   终端块带命令头 → 摘掉 command；文件块带文件名 → 摘掉 file_path。
    //   剩下的（cwd / timeout / offset / limit…）照旧显示 —— 既不重复，也不丢信息。
    //   摘到一个不剩时返回 null，调用方整块不渲染。
    const OFFICIAL_OWNED_ARGS = { terminal: ['command'], read: ['file_path'] };
    // 只有官方块**真会被画出来**时，才把 command / file_path 交给它、外层不再重复。
    //   少了这道守卫，primitives 取不到时命令与文件名会两头都看不见 ——
    //   红线「一块都不许吞」。（这条是既有断言 详情/完整命令行 在回归里逼出来的。）
    function officialShownKind(name, meta, P) {
      const kind = officialBlockKind(name, meta);
      if (kind === 'terminal') return (P && P.TerminalBlock) ? kind : null;
      if (kind === 'read') return (P && P.ReadBlock) ? kind : null;
      return null;
    }

    function argsRawForOfficial(argsRaw, kind) {
      const owned = OFFICIAL_OWNED_ARGS[kind];
      if (!owned) return argsRaw;
      const parsed = parseArgs(argsRaw);
      if (parsed === null) return argsRaw;
      const rest = {};
      let kept = 0;
      Object.keys(parsed).forEach(function (k) {
        if (owned.indexOf(k) !== -1) return;
        rest[k] = parsed[k];
        kept++;
      });
      return kept === 0 ? null : JSON.stringify(rest);
    }

    function foldWordOf(n) { return t('moreLines') + n + t('moreLinesTail') + t('showAll'); }

    function terminalLabelsOf() {
      return {
        signal: function (s) { return t('sigPrefix') + s; },
        exitCode: function (c) { return t('exitPrefix') + c; },
        running: t('running'),
        failed: t('hadErrors'),
        done: t('done'),
        copy: t('copyWord'),
        copied: t('copiedWord'),
        noOutput: t('noOutputWord'),
        collapseAria: t('collapseWord'),
        collapse: t('collapseWord'),
        expandAria: foldWordOf,
        expand: foldWordOf,
      };
    }

    function readLabelsOf() {
      return {
        window: function (shown, total) { return t('readWindowA') + total + t('readWindowB'); },
        copy: t('copyWord'),
        copied: t('copiedWord'),
        collapseAria: t('collapseWord'),
        expandAria: foldWordOf,
        collapse: t('collapseWord'),
        expand: foldWordOf,
      };
    }

    function ToolResultBody(props) {
      const P = props.primitives;
      const name = props.name || '';
      const text = props.text;
      const kind = officialBlockKind(name, props.meta || { name: name, settled: props.settled, text: text, argsRaw: props.argsRaw });
      if (kind === 'terminal' && P && P.TerminalBlock) {
        const args = parseArgs(props.argsRaw) || {};
        return React.createElement(P.TerminalBlock, {
          command: String(args.command),
          output: redact(String(text)),
          exitCode: exitCodeOf(text) ?? undefined,
          // ↑ 官方 prop 类型是 number | undefined：null 会被当作「有值」而显示一枚空 pill（v1.14.1 适配）
          className: 'prism-official-block',
          labels: terminalLabelsOf(),
        });
      }
      if (kind === 'read' && P && P.ReadBlock) {
        const args = parseArgs(props.argsRaw) || {};
        const path = typeof args.file_path === 'string' ? args.file_path : '';
        const built = readLinesOf(text, args);
        return React.createElement(P.ReadBlock, {
          label: path === '' ? undefined : redact(path),
          lines: built.lines,
          totalLines: built.total,
          className: 'prism-official-block',
          labels: readLabelsOf(),
        });
      }
      if (!props.settled || !text) return null;
      return React.createElement('div', { className: 'prism-result-fallback' },
        React.createElement('div', { className: 'prism-doc-label' }, t('resultLabel')),
        React.createElement(DocBody, { text: text, primitives: P }),
      );
    }

    // 六点五、工具行元信息：从一次工具调用的生命周期块推导该行
    //   的全部展示要素（行文本 / 状态 / 详情材料）。
    //   时间线行（ToolCard）与折叠组面板共用同一套推导，保证两种
    //   呈现下的文案、图标与状态完全一致。
    // ============================================================
    function toolRowMeta(toolName, block) {
      const settled = block.kind === 'tool-result';
      const name = settled ? (block.call ? block.call.name : toolName) : (block.name || toolName);
      const argsRaw = settled ? (block.call ? block.call.argsRaw : '') : (block.argsRaw || '');
      const text = settled ? resultText(block) : '';
      const hardError = settled && block.isError === true;   // 工具真出事 —— 唯一该标红的情形
      const isError = hardError;
      const exitCode = settled && !hardError ? exitCodeOf(text) : null;
      const soft = !hardError && exitCode !== null && exitCode !== 0;   // 命令返回非零（grep 没匹配这类常态）—— 琥珀，不是红
      const rule = ruleFor(name);
      const doing = rule ? (lang === 'en' && rule.doingEn ? rule.doingEn : rule.doing) : t('doingAuto') + name + t('doingAutoEnd');
      const done = rule ? (lang === 'en' && rule.doneEn ? rule.doneEn : rule.done) : t('doneAuto') + name + t('doneAutoEnd');
      const argPlain = plainArgs(name, argsRaw);
      // 行文本：进行中带参数 → 「正在…」；已结算带参数 → 参数摘要；否则白话文案
      const plainLine = settled ? done : doing;
      const lineText = settled
        ? (argPlain ? argPlain : plainLine)
        : (argPlain ? t('argDoing') + argPlain : plainLine);
      const statusIcon = !settled ? '●' : (hardError ? '✕' : (soft ? '⚠' : '✓'));
      const statusCls = !settled ? 'running' : (hardError ? 'err' : (soft ? 'mixed' : 'ok'));
      const statusWord = !settled ? t('inProgress') : (hardError ? t('error') : (soft ? t('nonzeroExit') : t('done')));
      const rowLabel = statusWord + colon() + (exitCode !== null && exitCode !== 0 ? t('exitCodePrefix') + exitCode + ' · ' : '') + lineText;
      // 耗时：已结算直接算差值；进行中由行组件按当前时刻算（节拍驱动重渲染）
      const callTime = blockCallTime(block);
      const resultTime = blockResultTime(block);
      return { settled, name, argsRaw, isError, soft, exitCode, text, rule, argPlain, plainLine, lineText, statusIcon, statusCls, statusWord, rowLabel, callTime, resultTime };
    }

    // 可点行必须也能用键盘到：div + onClick 对键盘是隐形的，而样式里已经写了
    //   `:focus-visible`（等于承诺过能聚焦）。Enter / 空格与点击同义。
    function clickableProps(className, onClick, expanded) {
      const props = {
        className: className,
        role: 'button',
        tabIndex: 0,
        onClick: onClick,
      };
      if (expanded !== undefined) props['aria-expanded'] = expanded ? 'true' : 'false';
      props.onKeyDown = function (e) {
        if (e && (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar')) {
          e.preventDefault();
          onClick(e);
        }
      };
      return props;
    }

    // ============================================================
    // 六点六、折叠组：长活按「有可见输出的步」分段，每段收成一条折叠行。
    //   本节是数据层（纯函数，不碰 React）：
    //     折叠范围 = 答案步之前的一切过程（每步的思考原文 + 工具调用 + 重试行）。
    //     留在外面 = 答案步（answerStep）的思考与正文。正文由那段推理
    //       推出，把它折进去等于把答案与它的来由切开。
    //     组边界（v1.10.0）= 有「可见助手输出」的 assistant-step。产品的
    //       AssistantMarkdown 把一次输出按 reasoning / text / tool-call 的顺序
    //       摊在同一行里，块与块之间没有节点；所以正文与工具交替出现时，
    //       折叠的切分点只能落在 step 的边界上。
    //       判据照抄产品自己的 hasVisible（AssistantMarkdown.tsx）：
    //         status === 'running'，或有非空 reasoning / 非空 text / image /
    //         插件不认识的块。只有工具头的步不渲染 —— 它不构成边界。
    //       这样每一段 = 「一次输出 + 它带出的那些工具」，卡片紧跟在对应的
    //       正文之后；推理原文不因分区被漏到时间线上（红线）。
    //     分段单位 = 产品的一个 step（一次模型输出）。
    //   边界来源：产品的 turn-process 契约（ChatNodeSeat 把 spec 作为
    //     props.turnProcess 透传给节点渲染器）；拿不到时退到 turn 级数据
    //     location.turn.data.get('turn-process')（同一份 spec 的旧通道）。
    //   思考计数 = 该步 assistant 输出里非空 reasoning 块的数量与原文，
    //     取自 assistant-step 节点 data.blocks（kind === 'reasoning'）。
    //   视图层见 §六点八（组件），注册见文件末尾。
    // ============================================================
    const EMPTY_NODES = [];

    // 有界记账（v1.10.3）：手动开合那几本 Map 的自我设限工具。定义在模块作用域 ——
    //   它是纯逻辑、不碰 React，也方便测试直接盯它。
    const MANUAL_CAP = 600;
    function rememberManual(map, key, value) {
      map.set(key, value);
      if (map.size <= MANUAL_CAP) return;
      // 丢最旧的一半（Map 保持插入顺序）：只丢「业主手动开合」这类可重建的状态
      const drop = Math.floor(MANUAL_CAP / 2);
      let i = 0;
      for (const k of map.keys()) {
        map.delete(k);
        i += 1;
        if (i >= drop) break;
      }
    }

    // 节点 location → turn 编号；拿不到（session/unresolved）返回 null。
    function turnOf(location) {
      if (!location) return null;
      if (location.kind === 'step' || location.kind === 'turn') return location.turn.turn;
      return null;
    }

    // Chat 视图快照取用（跨版本）：
    //   新版 DSH 把 Chat 视图快照交给 useChat（SessionStandardProps.useChat），
    //   选择器直接拿到 ChatSnapshot；旧版挂在 useSession 快照的 .chat 字段上。
    //   两条路径都支持，避免跟随产品内部结构变化而失效。
    function chatOf(sn) {
      if (!sn) return null;
      if (sn.chat) return sn.chat;              // 旧版：SessionSnapshot.chat
      if (sn.locations && sn.nodes) return sn;  // 新版：useChat 直接给 ChatSnapshot
      return null;
    }

    // 从会话快照收集某 turn 内与本组相关的节点（tool-call / assistant-step /
    // model-retry，保持渲染顺序）；供 useChat / useSession 选择器使用。
    //   model-retry：重试行是与工具行同级的独立节点（产品 node kind
    //   'model-retry'），一并收进来参与分段与统计。
    function collectTurnNodes(sn, turn) {
      var chat = chatOf(sn);
      if (!chat) return EMPTY_NODES;
      var keys = chat.locations.getTurn(turn);
      var out = [];
      for (var i = 0; i < keys.length; i++) {
        var n = chat.nodes.get(keys[i]);
        if (!n) continue;
        if (n.kind === 'tool-call' || n.kind === 'assistant-step' || n.kind === 'model-retry') out.push(n);
      }
      return out;
    }

    // 选择器比较器。只比节点引用是不够的：流式追加时节点对象常常原地不变、
    //   变的是它内部的块（文本边长边加、工具根从 tool-call 变 tool-result），
    //   于是「引用集合相同」把真实更新跳过 —— 收拢行与面板会停在旧数据上，
    //   收了行距的座位也再等不到那一次「已经有内容了，撤回」的重跑。
    //   这里对每个节点补一份廉价的内容指纹：块数 + 最后一块的种类与长度、
    //   工具根的种类与时刻、重试链的最近状态。
    function nodeFingerprint(n) {
      if (!n) return '';
      const d = n.data || {};
      if (n.kind === 'assistant-step') {
        const blocks = Array.isArray(d.blocks) ? d.blocks : [];
        var sig = 'a' + String(d.step) + ':' + String(d.status) + ':' + blocks.length;
        if (blocks.length > 0) {
          const b = blocks[blocks.length - 1];
          sig += ':' + (b && b.kind ? b.kind : '?') + ':' + (b && typeof b.text === 'string' ? b.text.length : 0);
        }
        return sig;
      }
      if (n.kind === 'tool-call') {
        const r = d.root;
        if (!r) return 't?';
        return 't' + String(r.kind) + ':' + String(r.time || '') + ':' + String(r.isError === true ? 1 : 0);
      }
      const cur = d.current;
      return 'r' + (cur ? String(cur.retryState) : '') + ':' + (Array.isArray(d.attempts) ? d.attempts.length : 0);
    }

    function sameTurnView(a, b) {
      if (a === b) return true;
      if (!a || !b || a.length !== b.length) return false;
      for (var i = 0; i < a.length; i++) {
        const x = a[i];
        const y = b[i];
        if (x !== y && (!x || !y || x.key !== y.key || x.kind !== y.kind)) return false;
        if (nodeFingerprint(x) !== nodeFingerprint(y)) return false;
      }
      return true;
    }

    // 一次思考：assistant 输出里非空的 reasoning 块数与原文。
    //   原文供段展开显示（段收起时绝不渲染，见 GroupSegment）。
    function reasoningInfo(data) {
      var c = 0;
      var full = '';
      if (!data || !data.blocks) return { count: 0, full: '' };
      for (var i = 0; i < data.blocks.length; i++) {
        var b = data.blocks[i];
        if (b && b.kind === 'reasoning' && b.text && b.text.trim() !== '') {
          c++;
          full = full === '' ? b.text.trim() : full + '\n\n' + b.text.trim();
        }
      }
      return { count: c, full: full };
    }

    // 答案边界：产品已经算好，插件不自己猜。
    //   首选 props.turnProcess.spec（ChatNodeSeat 透传的同一份 spec）；
    //   旧版产品没有这个 props 时退到 turn 级数据通道（同 key，同 spec）。
    //   两条都取不到 = null：此时没有「答案步」的概念，整轮都算过程。
    function answerStepOf(props, node) {
      var tp = props ? props.turnProcess : null;
      if (tp && tp.spec && typeof tp.spec.answerStep === 'number') return tp.spec.answerStep;
      try {
        var loc = node && node.location;
        if (loc && (loc.kind === 'turn' || loc.kind === 'step') && loc.turn && loc.turn.data
          && typeof loc.turn.data.get === 'function') {
          var spec = loc.turn.data.get('turn-process');
          if (spec && typeof spec.answerStep === 'number') return spec.answerStep;
        }
      } catch (e) { /* 契约变动：按「无边界」处理，不猜 */ }
      return null;
    }

    // 步号读取的唯一入口：助手节点 data.step 优先；工具 / 重试节点退到
    //   location.step.step —— 只靠助手节点会让整轮并成一段（长轮窗口常常
    //   不交出助手节点）。旧产品的 location.step.seq 留作最后回退。
    //   ⚠ location.step 是产品的 StepLocation：编号在 .step（number），
    //   不是 .seq。这一步曾经读 .seq（一个不存在的字段），工具节点的步号
    //   因此恒为 null —— 段会按「每个工具一段」裂开。产品的官方读法见
    //   ui-chat/conversation-nodes/tool.ts:111-113。
    //   分段（segIdOf）与折叠边界（foldBoundary）共用这一处，两处口径分家
    //   会出现「段号认得出、边界认不出」的半截状态。
    function stepIdOf(node) {
      const st = node && node.data && typeof node.data.step === 'number' ? node.data.step : null;
      if (st !== null) return st;
      const loc = node && node.location;
      if (loc && loc.kind === 'step' && loc.step) {
        if (typeof loc.step.step === 'number') return loc.step.step;
        if (typeof loc.step.seq === 'number') return loc.step.seq;          // 旧字段，留作回退
        if (typeof loc.step.seq === 'string') return 's:' + loc.step.seq;
      }
      return null;
    }

    // 段标识（段的编号键）：见 stepIdOf。
    function segIdOf(node) {
      return stepIdOf(node);
    }

    // 折叠范围的边界：答案步在**窗口次序**里的位置 —— 它之前的一切算过程。
    //   用次序而不是步号算术：产品的 step 编号与节点 location 的编号未必在
    //   同一个空间（真机上 location.step.step 与 data.step 同源，但两套编号
    //   一旦分家，按步号比较会把整轮判到折叠之外，折叠行与工具一起消失）。
    //   步号的读法与 segIdOf 完全一致（data.step → location.step.step → 旧 .seq），
    //   两处口径若分家，会出现「段号认得出、边界认不出」的半截状态。
    //   答案步不在窗口里（长轮常见）或没有边界时：整轮都算过程。
    function foldBoundary(turnNodes, answerStep) {
      if (answerStep === null) return turnNodes.length;
      for (var i = 0; i < turnNodes.length; i++) {
        var n = turnNodes[i];
        if (n.kind === 'assistant-step' && stepIdOf(n) === answerStep) return i;
      }
      return turnNodes.length;
    }

    // 重试链状态：取链上最近一次尝试的结论。
    //   已结算（retryState === 'failed'）算一次失败；未结算只算在跑。
    function retryOutcome(node) {
      var current = node && node.data ? node.data.current : null;
      if (!current) return 'running';
      if (current.retryState === 'failed') return 'err';
      if (current.retryState === 'running' || current.retryState === 'scheduled') return 'running';
      return 'ok';
    }

    function retryCount(node) {
      var attempts = node && node.data ? node.data.attempts : null;
      return Array.isArray(attempts) && attempts.length > 0 ? attempts.length : 1;
    }

    function modelRetryName(node) {
      var cur = node && node.data ? node.data.current : null;
      return (cur && (cur.provider || cur.model)) ? (cur.provider || '') : '';
    }

    // 这一步是不是「边界处那一步」（答案步自己）。
    //   产品的 turn-process 把答案步算好放在 spec.answerStep 上；插件只认
    //   location 里的步号，不自己猜。拿不到答案步 → 整轮没有边界。
    function stepIsAnswerStep(node, answerStep) {
      if (answerStep === null || !node || node.kind !== 'assistant-step') return false;
      const d = node.data || {};
      return typeof d.step === 'number' && d.step === answerStep;
    }

    // 这一步有没有「可见的正文」——组边界判据。
    //   · text 非空 = 主人看到的正文（最要紧的那种边界）；
    //   · image / 插件不认识的块 = 产品也要画出来的东西，同样算边界，否则
    //     它们会被折进卡片（一块都不许吞的红线）；
    //   · status === 'running' 的步：正文还在生成，先算边界，免得刚出现的
    //     文字被折走（结算后判据自然回到块本身）；
    //   · **思考（reasoning）不算边界**：产品把思考渲染成一行「思考完成」，
    //     插件折叠档里它本来就属于折叠面板的段。不把它当边界，带思考的步与
    //     它带出的工具就留在同一段，不会因为每步都有思考而把时间线切碎。
    //   · 只有工具头的步（产品的 hasVisible 判 false）同样不构成边界。
    //   答案步自己不算边界：它属于折叠范围之外，是上一段的**收尾**，不该
    //   再开一段（否则它自己会去认领一条卡片，把答案本身吞掉）。
    function visibleStepOf(node, answerStep) {
      if (!node || node.kind !== 'assistant-step') return false;
      if (stepIsAnswerStep(node, answerStep)) return false;
      const data = node.data || {};
      if (data.status === 'running') return true;
      const blocks = Array.isArray(data.blocks) ? data.blocks : [];
      for (var i = 0; i < blocks.length; i++) {
        const b = blocks[i];
        if (!b) continue;
        if (b.kind === 'text') {
          // 空白正文不算（产品也按 trim 后非空判可见）
          if (typeof b.text === 'string' && b.text.trim() !== '') return true;
          continue;
        }
        if (b.kind === 'reasoning' || b.kind === 'tool-call') continue;   // 不算边界
        return true;                               // 图片 / 未知块：产品也画，算边界
      }
      return false;
    }

    // 折叠范围计算（纯函数，不碰渲染权）。
    //   一个 turn 的折叠内容先按「可见输出」切成若干组，组内再按 step 切成段
    //   （每段 = 一次模型输出带出的全部思考 + 工具调用 + 重试行）。
    //   同一 node.key 只算一次（窗口可能重复投递同一节点）。
    //   返回 { groups, boundary, inWindow, myIndex, mySpanIndex }：
    //     groups  组列表，每组 { id, head, nodes, segments, tools, retries,
    //             thoughts, foldedKeys, foldedCount }
    //             id     段标识：组首步的 step 号（首组无可见步时为 'head'）。
    //                    步号单调递增，组一旦形成就不变 → 可作状态与账本的键
    //             head   组首节点（认领最自然由它发起）
    //             foldedKeys 本组内让位的节点 key（认领者用它收行距）
    //             foldedCount 本组有内容可摆的条目数（工具 / 重试）。
    //                    0 = 本组没有可折的东西 → 不认领、不渲染：空组不该冒出
    //                    一条没有任何计数的收拢行，更不该点开之后连行都不见了
    //     boundary  折叠范围的边界（答案步在窗口里的位置；其后的节点不折叠）
    //     myIndex   本次节点在窗口里的位置（-1 = 不在窗口里）
    //     mySpanIndex 本次节点归属哪一组（-1 = 在任何组之外）
    //   渲染权不在这里定：交给组件用「认领」决定（见 useGroupClaim，
    //   账本按「会话 + turn + 组标识」记账）。
    // ponytail: 每个可认领的座位每次提交都整段算一遍（O(N²) / 长轮）；
    //   分区只多一趟线性扫描。上限＝100+ 节点且高频流式的极端长轮会掉帧；
    //   升级路径＝把「分段列表」推迟到认领之后才算。
    function computeGroups(turnNodes, myNode, answerStep) {
      const boundary = foldBoundary(turnNodes, answerStep);
      var myIndex = -1;
      for (var mi = 0; mi < turnNodes.length; mi++) {
        if (turnNodes[mi].key === myNode.key) { myIndex = mi; break; }
      }
      var built = [];
      var buffered = [];      // 两个可见步之间收到的节点（工具 / 重试 / 空助手步）
      var contrib = 0;        // 其中「有内容可折」的条目数（工具 / 重试）
      var seen = {};
      var startIsAnswer = false;   // 本段的起点（第一项）是不是答案步
      // 段标识（账本与开合状态的键）：取段首的步号 —— 步号单调递增，成段后不变。
      //   段首拿不到步号（契约缺口）时退到节点 key：若统一写成 'head'，两段就会
      //   共用同一本账（一边展开、另一边跟着开，或互相抢渲染权）。
      function spanIdOf(first) {
        const sid = segIdOf(first);
        if (sid !== null && sid !== undefined) return String(sid);
        return first && first.key ? 'k:' + first.key : 'head';
      }
      function flush() {
        // 没有可折内容的段不成组：两侧的节点各自照旧（渲染 null 或退成单行）。
        //   1) 「可见输出之后又跟一个可见输出」的空段（中途没有工具）；
        //   2) 起点落在答案步上的段 —— 折叠范围止于答案步，那一段的工具要自己一行
        //      （答案步自己不算边界，所以它会顺理成章地当上段首）。
        if (buffered.length > 0 && contrib > 0 && !startIsAnswer) {
          const info = computeSegments(buffered, myNode);
          built.push({
            id: spanIdOf(buffered[0]),
            head: buffered[0],
            nodes: buffered,
            segments: info.segments,
            tools: info.tools,
            retries: info.retries,
            thoughts: info.thoughts,
            foldedKeys: info.foldedKeys,
            foldedCount: info.foldedCount,
          });
        }
        buffered = [];
        contrib = 0;
        startIsAnswer = false;
      }
      for (var i = 0; i < turnNodes.length; i++) {
        var n = turnNodes[i];
        // 折叠边界之外（答案步及其后）一律不参与成段（v1.10.8 修）：那些节点
        //   必须走单行 / 自己的渲染。少了这一条，答案步之后的工具会被并成一段、
        //   画成一条折叠行 —— 真机表现是答复后面冒出一条本不该有的「1 个工具」。
        if (i >= boundary) break;
        if (!seen[n.key]) {
          seen[n.key] = true;
          if (visibleStepOf(n, answerStep)) {
            // 可见的正文：它开启新的一段 —— 先把上一段结算掉
            flush();
            buffered.push(n);
          } else if (stepIsAnswerStep(n, answerStep)) {
            // 答案步：**折叠止于它**（v1.10.8 修）。它不开启新段，也不许被并入
            //   上一段 —— 并进去会造出一段「横跨答案步」的段：段里含答案步，而
            //   答案步在折叠范围之外，于是谁都不许认领它（mySpanIndex 恒 -1），
            //   这一段就成了**永远没人渲染的段**，段里的工具也只好各自单行。
            //   真机症状正是主人报的「一轮回复完，有时呈现原生的效果」：典型形态
            //   是「正文 → 工具 → 答案」三节点一轮（模型先招呼、再干活、再报结果）——
            //   第一格有正文，第二格是工具，第三格是答案；一并段就全烂。
            //   正确做法：先把上一段结算干净；答案步本身留在段外（渲染层照旧：
            //   助手步画自己的正文，答案步之后的工具走单行）。
            flush();
          } else {
            // 过程节点（工具 / 重试 / 只有工具头的助手步）归给当前这一段
            if (buffered.length === 0) startIsAnswer = stepIsAnswerStep(n, answerStep);
            if (n.kind === 'tool-call' || n.kind === 'model-retry') contrib++;
            buffered.push(n);
          }
        }
      }
      flush();
      var mySpanIndex = -1;
      // 折叠范围之外的节点（答案步及之后）一律「不在任何段内」：它们必须走
      //   单行渲染。注意不能只靠「这段不成组」——段对象本身可能仍把答案步之前
      //   的节点包在里面（答案步是段的收尾，不在范围内），那个节点会拿着一个
      //   段号去认领，把本该单行的内容折进卡片。
      if (myIndex !== -1 && myIndex < boundary) {
        for (var g = 0; g < built.length; g++) {
          if (built[g].head === myNode || built[g].nodes.indexOf(myNode) !== -1) { mySpanIndex = g; break; }
        }
      }
      // 排错面：留最近 6 次切段结果（含每格可见性与块类型）。主人报过
      //   「一轮回复完有时呈现原生效果」那类偶发问题，看这一份就能分辨是
      //   「段没成」还是「段成了但无人认领」。只在出问题时读，开销可忽略。
      if (typeof window !== "undefined") {
        try {
          var __vis = [];
          for (var vi = 0; vi < turnNodes.length; vi++) {
            var __b = turnNodes[vi].data && turnNodes[vi].data.blocks;
            __vis.push(turnNodes[vi].kind + "@" + String(segIdOf(turnNodes[vi])) + (visibleStepOf(turnNodes[vi], answerStep) ? "V" : "-") + "[" + (Array.isArray(__b) ? __b.map(function (x) { return x && x.kind; }).join("/") : "-") + "]");
          }
          diag.groups = diag.groups || [];
          diag.groups.push({ mine: myNode.key, ans: answerStep, bnd: boundary, my: myIndex, mySpan: mySpanIndex, vis: __vis.join(","), groups: built.map(function (g) { return { id: g.id, head: g.head.key, folded: g.foldedCount, nodes: g.nodes.map(function (x) { return x.kind; }).join(">") }; }) });
          if (diag.groups.length > 6) diag.groups.shift();
        } catch (e) { /* 排错面失败不影响渲染 */ }
      }
      return {
        groups: built,
        boundary: boundary,
        myIndex: myIndex,
        mySpanIndex: mySpanIndex,
        inWindow: myIndex !== -1,
      };
    }

    // 组内的段计算（纯函数）。
    //   调用方（computeGroups）已经把节点限定在「答案步之前 + 本段之内」，
    //   所以这里不再截答案边界。
    //   返回 { segments, tools, retries, thoughts, foldedKeys, foldedCount,
    //          myIndex, inWindow }：
    //     segments   段列表
    //     tools/retries/thoughts  本组汇总（折叠行的计数口径）
    //     foldedKeys 本组内让位的节点 key
    //     foldedCount 有内容可摆的条目数（工具 / 重试行）
    function computeSegments(turnNodes, myNode) {
      var segments = [];
      var current = null;
      var myIndex = -1;
      var foldedKeys = [];
      var contributing = 0;
      var seen = {};
      function pushSegment(id) {
        current = {
          step: id,
          assistant: null,
          thoughts: 0,
          thoughtText: '',
          tools: [],
          retries: [],
        };
        segments.push(current);
      }
      for (var i = 0; i < turnNodes.length; i++) {
        var n = turnNodes[i];
        if (myIndex === -1 && n.key === myNode.key) myIndex = i;
        if (seen[n.key]) continue;                 // 重复投递：只算一次
        seen[n.key] = true;
        foldedKeys.push(n.key);
        var sid = segIdOf(n);
        if (n.kind === 'assistant-step') {
          var info = reasoningInfo(n.data);
          if (current !== null && current.step === sid) {
            // 同一 step 有多条助手节点：思考量累加到本段
            current.thoughts += info.count;
            if (info.full) current.thoughtText = current.thoughtText ? current.thoughtText + '\n\n' + info.full : info.full;
          } else {
            pushSegment(sid);
            current.thoughts = info.count;
            current.thoughtText = info.full;
          }
          if (!current.assistant) current.assistant = n;
        } else if (n.kind === 'tool-call' || n.kind === 'model-retry') {
          contributing++;
          if (current === null || current.step !== sid) pushSegment(sid);
          if (n.kind === 'tool-call') current.tools.push(n);
          else current.retries.push(n);
        }
      }

      var tools = [];
      var retries = [];
      var thoughts = 0;
      for (i = 0; i < segments.length; i++) {
        tools = tools.concat(segments[i].tools);
        retries = retries.concat(segments[i].retries);
        thoughts += segments[i].thoughts;
      }
      return {
        segments: segments,
        tools: tools,
        retries: retries,
        thoughts: thoughts,
        foldedKeys: foldedKeys,
        foldedCount: contributing,
        myIndex: myIndex,
        inWindow: myIndex !== -1,
      };
    }

    // 组状态汇总：任一调用运行中 → 运行中（跑完才给对错总结）；
    // 全部结束且全对 → 已完成；全部结束且全错 → 有出错；
    // 对错混合 → 警示符号 + 「✓ n · ✕ m」计数（对在前）。
    // 口径：单次调用 / 单条重试链的最近结论各计 1。
    function groupStatus(aws) {
      var running = 0;
      var ok = 0;
      var err = 0;      // 工具**自己**失败（isError）—— 真出事，标红
      var soft = 0;     // 命令正常跑完但退出码非零（grep 没匹配、diff 有差异这类）—— 标琥珀
      for (var i = 0; i < aws.length; i++) {
        var w = aws[i];
        if (w.kind === 'retry') {
          if (w.state === 'running') running++;
          else if (w.state === 'err') err++;
          else ok++;
          continue;
        }
        var root = w.node.data ? w.node.data.root : null;
        if (!root) continue;
        var oc = outcomeOf(root);
        if (oc === 'running') running++;
        else if (oc === 'err') {
          // 分开两级（v1.14.0 收尾，主人 2026-09-24 点名）：过去两者都算 err，
          //   于是助手连跑 grep / head 管道（退出码非零）时，一屏折叠行全是红点。
          if (root.isError === true) err++; else soft++;
        } else ok++;
      }
      if (running > 0) return { icon: '●', cls: 'running', word: t('running') };
      // 真出事（工具失败）才红 —— 与「命令返回非零」分开，红点不再成排出现
      if (err > 0) return { icon: '✕', cls: 'err', word: t('hadErrors') };
      // 非零退出走既有的 mixed 类（它本来就是琥珀色 --dsw-alias-state-warn-primary）
      if (soft > 0 && ok > 0) return { icon: '⚠', cls: 'mixed', word: '✓ ' + ok + ' · ! ' + soft };
      if (soft > 0) return { icon: '⚠', cls: 'mixed', word: t('nonzeroExit') };
      return { icon: '✓', cls: 'ok', word: t('done') };
    }

    // 段内活动列表（工具与重试同权）：状态汇总与渲染共用同一份口径。
    //   注意别把 i18n 的 t 遮住（老版本这里 var t = seg.tools，是颗地雷）。
    function activitiesOf(seg) {
      var list = [];
      var toolList = seg.tools || [];
      var retryList = seg.retries || [];
      for (var i = 0; i < toolList.length; i++) list.push({ kind: 'tool', node: toolList[i] });
      for (i = 0; i < retryList.length; i++) list.push({ kind: 'retry', node: retryList[i], state: retryOutcome(retryList[i]) });
      return list;
    }

    function groupActivities(group) {
      var list = [];
      for (var i = 0; i < group.segments.length; i++) list = list.concat(activitiesOf(group.segments[i]));
      return list;
    }

    // 段状态：先看段内条目；条目都跑完但这一步还在写（助手节点运行中）时
    //   报「进行中」—— 不能因为工具全结束了就把正在生成的那段报成已完成。
    function segmentStatus(seg) {
      var s = groupStatus(activitiesOf(seg));
      var node = seg.assistant;
      if (s.cls === 'ok' && node && node.data && node.data.status === 'running') {
        return { icon: '●', cls: 'running', word: t('inProgress') };
      }
      return s;
    }

    // 运行中：这一行要能回答「现在在忙什么」。取最后一个还在跑的工具，
    //   给「第 N 件 + 它的白话文案 + 至今耗时」；没有工具在跑（模型在想或
    //   在写）时退回计数 + 「思考中」。
    function runningLineOf(group, nowMs) {
      var acts = groupActivities(group);
      for (var i = acts.length - 1; i >= 0; i--) {
        var a = acts[i];
        if (a.kind !== 'tool') continue;
        var root = a.node.data ? a.node.data.root : null;
        if (!root || root.kind === 'tool-result') continue;   // 只看还在跑的
        var meta = toolRowMeta(rootName(root), root);
        var dur = durationTextOf(root, false, nowMs);
        var ordinal = 0;
        for (var q = 0; q < group.tools.length; q++) {
          if (group.tools[q].key === a.node.key) { ordinal = q + 1; break; }
        }
        return t('busyOrdinal') + ordinal + t('busyItem') + meta.plainLine + (dur ? ' · ' + dur : '');
      }
      return '';
    }

    // 收拢行的计数文案：只报真实有的东西；只剩重试时也要有个数字，
    //   否则会出现一行没有任何计数的可折叠行。
    function countTextOf(group) {
      var parts = [];
      if (group.tools.length > 0) parts.push(group.tools.length + t('toolsUnit'));
      if (group.thoughts > 0) parts.push(group.thoughts + t('thoughtsUnit'));
      if (group.retries.length > 0 && group.tools.length === 0) parts.push(group.retries.length + t('retriesUnit'));
      return parts.join(' · ');
    }

    // ============================================================
    // 六点六点一、让位的座位不占地方（收行距）
    //   产品的行距规则是「.column 里每个非 hidden、非空的 .flowItem 各带一条
    //   flow-gap」，而 .column 是 flex 列（外边距不塌陷）。每个座位内部恒有
    //   一个 display:contents 的 [data-slot] 锚点（ui-renderer 的锚点契约：
    //   无论组件渲染什么，锚点都在），所以「插件渲染 null」并不会让 :empty
    //   成立 —— 每个让位的节点都会留下一条 16px 的空档，一轮长活就是一片。
    //   产品自己对过程行用的是 hidden="until-found"（保留零高盒子，浏览器
    //   查找仍能唤起）。这里照同一套语言：只给「已经折进面板、且当前确实
    //   没有任何可见内容」的座位打 hidden + 标记，有内容的一律不碰；
    //   卸载 / 切档时整批撤回，绝不把产品自己的行留在隐藏里。
    //   取座位的选择器只用产品写在座位上的 data 属性（data-chat-flow-key /
    //   data-chat-turn），不依赖 CSS Modules 生成的类名。
    // ============================================================
    const FOLD_MARK = 'data-prism-folded';
    const SEAT_SELECTOR = '[data-chat-flow-key][data-chat-turn="';

    function seatNodesOf(turn) {
      if (typeof document === 'undefined' || document === null) return [];
      try {
        return Array.prototype.slice.call(
          document.querySelectorAll(SEAT_SELECTOR + String(turn) + '"]'),
        );
      } catch (e) { return []; }
    }

    // 座位里有没有真内容：看槽位锚点下有没有元素子节点（锚点本身恒存在）。
    function seatHasContent(el) {
      const anchor = el.querySelector('[data-slot="conversation.chat.node"]');
      return !anchor || anchor.childElementCount > 0;
    }

    // 把折叠掉的座位收成零高；返回这次收掉的座位数（进体检面）。
    // 收起来的座位记在 display 上，**不碰 hidden 属性**：产品自己有一套
    //   hidden="until-found"（useSearchableHidden），它在自己那侧 hidden 为 false 时
    //   会无条件 removeAttribute('hidden')，把插件写的同名字段一起抹掉 —— 标记还在、
    //   行距却弹回来，而且插件不知道自己被抹了。display 两边互不相干。
    function foldSeat(el) {
      el.setAttribute(FOLD_MARK, '');
      // display 才是真机制；hidden 是为了同时满足**产品自己的**判据 ——
      //   它算滚动锚点时按 `:not(:empty):not([hidden])` 选行，只 display:none 的
      //   座位仍在名单里、却是零高，锚点会落到错误一侧（长会话翻页时阅读位置漂移）。
      el.style.display = 'none';
      el.setAttribute('hidden', 'until-found');
      // 行距减半：产品给列里每条可见行 16px（--dsh-chat-flow-gap），而折叠档一行
      //   就是「一段活的摘要」，与正文交替出现时两条 16px 头尾相接 = 32px，看着
      //   发散。产品自己给「折起来的过程行」用的是 8px（ChatView.module.css 的
      //   .flowItem[data-turn-process-answer]），这里照同一个语汇：把这条座位的
      //   行距设成变量的一半（不用写死 8px，免得产品改基准时我们对不上）。
      //   写在 style 的**自定义属性**上：撤回时清空即可，不碰产品自己的样式表。
      try { el.style.setProperty('--dsh-chat-flow-gap', '8px'); } catch (e) { /* 只读环境 */ }
    }
    function unfoldSeat(el) {
      el.removeAttribute(FOLD_MARK);
      el.style.display = '';
      // 把行距还给产品（清掉我们写的那条自定义属性）
      try { el.style.removeProperty('--dsh-chat-flow-gap'); } catch (e) { /* 只读环境 */ }
      // 产品自己要求隐藏的（它的过程区收起）不动它的 hidden，只撤我们自己加的那次
      if (el.getAttribute('data-turn-process-hidden') === null) el.removeAttribute('hidden');
    }

    // 这一轮里哪些座位允许收：工具调用 / 重试行各在面板里有一份副本；助手步
    //   只有**已结算且渲染为空**时才收（running 的还可能长出正文，绝不碰）。
    //   答案步的座位一律不碰：它属于折叠范围之外，且答案的正文/思考由插件
    //   自己渲染 —— 收掉它就是收掉答复本身（v1.10.0 的哨兵断言盯着这条）。
    function collapsibleKeys(turnNodes, answerStep) {
      const out = {};
      for (var i = 0; i < turnNodes.length; i++) {
        const n = turnNodes[i];
        if (!n) continue;
        if (n.kind === 'tool-call' || n.kind === 'model-retry') out[n.key] = true;
        else if (n.kind === 'assistant-step' && n.data && n.data.status !== 'running'
          && !stepIsAnswerStep(n, answerStep === undefined ? null : answerStep)) out[n.key] = true;
      }
      return out;
    }

    // 收行距：把「折进面板 / 渲染为空」的座位收成零高。
    //   返回**这次实际收掉的 key 列表** —— 撤回只还自己收过的那些，见 releaseFoldedKeys。
    //   `else if (marked) unfold` 是有意设计（不是多余动作）：座位先空（收了）、
    //   内容后到（流式追加、图片/未知块补齐）时，下一次同步必须把它撤回 ——
    //   这条由桩里的「内容后到 → 下一次同步撤回」盯着。
    function syncFoldedSeats(turn, foldedKeys, allowed, diag) {
      const list = seatNodesOf(turn);
      var foldedKeysOut = [];
      for (var i = 0; i < list.length; i++) {
        const el = list[i];
        const key = el.getAttribute('data-chat-flow-key');
        const marked = el.getAttribute(FOLD_MARK) !== null;
        if (allowed[key] && foldedKeys.indexOf(key) !== -1 && !seatHasContent(el)) {
          foldSeat(el);
          foldedKeysOut.push(key);
        } else if (marked) {
          unfoldSeat(el);
        }
      }
      if (diag && foldedKeysOut.length > 0) diag.seats = foldedKeysOut.length;
      return foldedKeysOut;
    }

    // 本轮里「插件接过、但什么也没画」的座位：直接收行距。
    //   为什么必须单独收一遍：折叠行是由**某个**所有者渲染的，同一轮里其余节点的
    //   座位渲染成空 —— 它们是一条条 0 高度、却各占一条 16px 行距的壳子。所有者
    //   在窗口里时，他的 syncFoldedSeats 会把本段的收掉；可虚拟化一旦把某个所有者
    //   卸载（滚动、长会话），那一段的壳子就留在原地（2026-09-21 真机实测：同一轮
    //   里有的座位 mt=8px 已收、有的 mt=16px 没收，正是这个来路）。
    //   只收工具调用 / 重试行（渲染为 null 的），不看助手步：助手步在折叠范围内
    //   也可能承载「不显示」的思考，但它的座位不该由这里判生死。
    function syncBlankSeats(turn, diag) {
      const list = seatNodesOf(turn);
      var foldedKeysOut = [];
      for (var i = 0; i < list.length; i++) {
        const el = list[i];
        const kind = el.getAttribute('data-chat-flow-kind');
        if (kind !== 'tool-call' && kind !== 'model-retry') continue;
        if (el.getAttribute(FOLD_MARK) !== null) continue;      // 已经收了
        if (seatHasContent(el)) continue;                        // 有东西：绝不碰
        foldSeat(el);
        foldedKeysOut.push(el.getAttribute('data-chat-flow-key'));
      }
      if (diag) diag.blank = foldedKeysOut.length;
      return foldedKeysOut;
    }

    // 撤回：只还**自己收过的那批 key**（v1.10.1）。
    //   上一版是按整轮撤回 —— 于是同轮里另一个所有者卸载（虚拟化滚动）时，
    //   会把别人已经收好的座位一起弹回来，而那些位置的主人不一定再渲染一次，
    //   那一段就永久留下 0 高度 + 16px 行距的空壳（真机症状：同轮座位有的 8px 有的 16px）。
    //   不带 keys 时仍整批撤回（切档 / 插件卸载走这条）。
    function releaseFoldedKeys(diag, turn, keys) {
      if (typeof document === 'undefined' || document === null) return;
      try {
        if (!keys || keys.length === 0) return;
        const want = {};
        for (var k = 0; k < keys.length; k++) want[keys[k]] = true;
        const list = seatNodesOf(turn);
        for (var i = 0; i < list.length; i++) {
          const key = list[i].getAttribute('data-chat-flow-key');
          if (want[key]) unfoldSeat(list[i]);
        }
      } catch (e) { /* 只读环境：没有可撤回的东西 */ }
    }

    function releaseAllFoldedSeats(diag) {
      if (typeof document === 'undefined' || document === null) return;
      try {
        const list = document.querySelectorAll('[' + FOLD_MARK + ']');
        for (var i = 0; i < list.length; i++) unfoldSeat(list[i]);
        if (diag) diag.seats = 0;
      } catch (e) { /* 只读环境：没有可撤回的东西 */ }
    }

    // 收行距的第二种情形：**承载折叠行的那个座位本身**（v1.10.0 分区补丁）。
    //   折叠档下一段 = 「正文 + 卡片」挤在同一个座位里；它上下的空座位虽然已经
    //   零高，产品仍会给**可见行**各加一条 --dsh-chat-flow-gap，于是卡片与正文
    //   之间恒定 32px（上下各 16px）。产品自己给「折起来的过程行」用的是 8px
    //   （ChatView.module.css：.flowItem[data-turn-process-answer]{--dsh-chat-flow-gap:8px}），
    //   这里照同一个语汇：给承载折叠行的座位加标记，让它与**紧跟其后**那一行
    //   都取半值间距（写在元素自己的自定义属性上，撤回时清掉，不碰产品样式表）。
    const COMPACT_ATTR = 'data-prism-compact';
    function syncCompactRows(turn, diag) {
      const list = seatNodesOf(turn);
      var n = 0;
      for (var i = 0; i < list.length; i++) {
        const el = list[i];
        if (!el.querySelector('.prism-group-row, .prism-group-panel')) continue;
        el.setAttribute(COMPACT_ATTR, '');
        try { el.style.setProperty('--dsh-chat-flow-gap', '8px'); } catch (e) { /* 只读环境 */ }
        const next = el.nextElementSibling;
        // 下一行若是普通正文行，也收半：这样「卡片 → 正文」与「正文 → 卡片」
        //   两个方向都是 8px，来回都紧凑。若下一行自己也是折叠行，它那边会写。
        if (next && next.getAttribute && !next.hasAttribute(COMPACT_ATTR)) {
          try { next.style.setProperty('--dsh-chat-flow-gap', '8px'); } catch (e) { /* 只读环境 */ }
        }
        n++;
      }
      if (diag) diag.compact = n;
      return n;
    }
    function releaseCompactRows(turn) {
      if (typeof document === 'undefined' || document === null) return;
      try {
        const selector = turn === undefined
          ? '[' + COMPACT_ATTR + ']'
          : '[' + COMPACT_ATTR + '][data-chat-turn="' + String(turn) + '"]';
        const list = document.querySelectorAll(selector);
        for (var i = 0; i < list.length; i++) {
          list[i].removeAttribute(COMPACT_ATTR);
          try { list[i].style.removeProperty('--dsh-chat-flow-gap'); } catch (e) { /* 只读环境 */ }
        }
      } catch (e) { /* 只读环境：没有可撤回的东西 */ }
    }

    // ============================================================
    // 六点六点二、点开时把被点的那一块钉在屏幕上（v1.11.0）
    //   主人报的痛处（2026-09-22）：「每次点开一个折叠卡片时，界面都会弹飞
    //   （上或下）出去，没有实现点击卡片时，卡片不动，界面向下展开。」
    //   病灶在宿主，源码有据：ui-chat 的 ChatView.tsx 用 ResizeObserver 盯着流列，
    //   读者贴底（FOLLOW_THRESHOLD = 24px）时回调里直接
    //   `el.scrollTop = el.scrollHeight`。插件一展开，列高了，这一句就把视口拽到
    //   新的底部 —— 真机实测（dev/prism-scroll-probe.mjs）：贴底点开，卡片当场
    //   向上飞 160px；中段阅读时宿主不动，被点那一块也不动。
    //   做法（纯展示层，只写滚动位置，不碰产品状态）：点击那一刻记下被点那一块
    //   （座位）在屏幕上的 y，随后盯住列的尺寸变化，发现它被挪走了就补回来
    //   （scrollTop += 位移）。补位天然把「跟随」交还给读者：宿主自己的判据是
    //   「位置偏离我上次写入的账本就算读者动过」，补完它就不再跟底。
    //   反向验证：摘掉 installRowPin 那一行 → dev/prism-pin-check.mjs 变红。
    // ============================================================
    // 认哪些点击：插件自己画出来的、点了会改变高度的那几处。整洁档的原版行
    //   是官方的 DisclosureRow，给它挂了自己的类名（makeNativeToolRow）才能认出来。
    const PIN_SUB = '.prism-group-row, .prism-group-panel, .prism-seg-head, .prism-answer-thought-head,'
      + ' .prism-card, .prism-native-row, .prism-native-retry';
    const PIN_WINDOW_MS = 1200;   // 补位最多守这么久
    const PIN_QUIET_MS = 320;     // 连续这么久没被挪动就撤

    const pinState = {
      active: false, el: null, seatKey: null, top: 0, scroller: null, col: null,
      quietSince: 0, deadline: 0, raf: 0, ro: null,
    };

    // 滚动台：宿主自己说「有 [data-conversation-scroll] 就是它滚」
    //   （ui-chat 的 scrollerOf）。取不到时退到最近一个真能滚的祖先；
    //   都找不到就不补位 —— 宁可不补，也绝不乱滚别的东西。
    function scrollerOfNode(el) {
      if (typeof document === 'undefined' || document === null) return null;
      try {
        const outer = el.closest('[data-conversation-scroll]');
        if (outer && outer.scrollHeight > outer.clientHeight + 1) return outer;
      } catch (e) { /* 没有 closest：走下面的回退 */ }
      let p = el.parentElement;
      while (p && p !== document.body && p !== document.documentElement) {
        let oy = '';
        try { oy = getComputedStyle(p).overflowY; } catch (e) { oy = ''; }
        if ((oy === 'auto' || oy === 'scroll' || oy === 'overlay')
          && p.scrollHeight > p.clientHeight + 1) return p;
        p = p.parentElement;
      }
      return null;
    }

    // 锚块还在不在：座位可能被虚拟化换掉，按 key 再找一次。
    function pinResolve() {
      if (pinState.el && pinState.el.isConnected) return pinState.el;
      if (pinState.seatKey && typeof document !== 'undefined' && document !== null) {
        try {
          const again = document.querySelector('[data-chat-flow-key="' + pinState.seatKey + '"]');
          if (again) { pinState.el = again; return again; }
        } catch (e) { /* 选择器异常：放弃 */ }
      }
      return null;
    }

    function pinDisarm() {
      pinState.active = false;
      if (pinState.raf && typeof cancelAnimationFrame === 'function') {
        try { cancelAnimationFrame(pinState.raf); } catch (e) { /* 忽略 */ }
      }
      pinState.raf = 0;
      if (pinState.ro) { try { pinState.ro.disconnect(); } catch (e) { /* 忽略 */ } }
      pinState.ro = null;
      pinState.el = null;
      pinState.seatKey = null;
      pinState.scroller = null;
      pinState.col = null;
    }

    // 一次核对：被点那一块被挪走多少，就把滚动台补回多少。
    //   只用「屏幕坐标之差」一个量，不猜是谁挪的（宿主的跟随、浏览器的锚定都算）。
    function pinTick() {
      if (!pinState.active) return;
      const el = pinResolve();
      if (!el || !pinState.scroller) { pinDisarm(); return; }
      let delta = 0;
      try { delta = el.getBoundingClientRect().top - pinState.top; } catch (e) { pinDisarm(); return; }
      const now = Date.now();
      if (Math.abs(delta) > 0.5) {
        try { pinState.scroller.scrollTop += delta; } catch (e) { pinDisarm(); return; }
        pinState.quietSince = 0;
      } else if (pinState.quietSince === 0) {
        pinState.quietSince = now;
      }
      if (now > pinState.deadline
        || (pinState.quietSince !== 0 && now - pinState.quietSince > PIN_QUIET_MS)) pinDisarm();
    }

    // rAF 那一路是兜底：万一我们的 ResizeObserver 排在宿主那条之前（或宿主
    //   在别处动了滚动），下一帧还能把位置补回来。
    function pinLoop() {
      pinState.raf = 0;
      pinTick();
      if (pinState.active && typeof requestAnimationFrame === 'function') {
        pinState.raf = requestAnimationFrame(pinLoop);
      }
    }

    // 被点的那一块：优先锚在**座位**上。展开的面板长在座位里，座位的顶边不动；
    //   宿主的跟随一滚动，整块一起位移，补回座位就等于补回被点的那一行。
    //   座位取不到时锚在被点元素自己身上（行内开关的开合同样不动它的顶边）。
    function pinArm(target) {
      if (typeof document === 'undefined' || document === null || !target) return;
      if (!target.closest || !target.closest(PIN_SUB)) return;
      let el = target;
      try { el = target.closest('[data-chat-flow-key]') || target; } catch (e) { el = target; }
      if (!el || typeof el.getBoundingClientRect !== 'function') return;
      const scroller = scrollerOfNode(el);
      if (!scroller) return;
      pinDisarm();
      pinState.active = true;
      pinState.el = el;
      pinState.seatKey = (el.getAttribute && el.getAttribute('data-chat-flow-key')) || null;
      pinState.top = el.getBoundingClientRect().top;
      pinState.scroller = scroller;
      pinState.col = el.parentElement;
      pinState.deadline = Date.now() + PIN_WINDOW_MS;
      pinState.quietSince = 0;
      // 盯住列：宿主的跟随写在它自己的 ResizeObserver 回调里；插件这条观测器
      //   建得晚（插件渲染在宿主之后），回调排在它后面 → 补位落在 paint 之前，
      //   不会先跳一下再回来。
      if (typeof ResizeObserver === 'function' && pinState.col) {
        try {
          pinState.ro = new ResizeObserver(function () { pinTick(); });
          pinState.ro.observe(pinState.col);
        } catch (e) { pinState.ro = null; }
      }
      if (typeof requestAnimationFrame === 'function') pinState.raf = requestAnimationFrame(pinLoop);
    }

    // 安装：一处 capture 监听覆盖插件自己所有会改变高度的开合（卡片、段头、
    //   答案思考、工具行详情、「展开」那一枚），不改各组件里 onClick 的意思。
    //   读者一动滚轮 / 触摸 / 滚动键 / 点别处，立刻撤 —— 绝不跟读者抢滚动。
    function installRowPin() {
      if (typeof document === 'undefined' || document === null) return function () {};
      function onClickCapture(e) {
        try { pinArm(e.target); } catch (err) { /* 补位失败绝不拖垮界面 */ }
      }
      function onPointerDownCapture(e) {
        try {
          if (!e.target || !e.target.closest || !e.target.closest(PIN_SUB)) pinDisarm();
        } catch (err) { /* 忽略 */ }
      }
      function onKeyDown(e) {
        const k = e.key;
        if (k === 'ArrowUp' || k === 'ArrowDown' || k === 'PageUp' || k === 'PageDown'
          || k === 'Home' || k === 'End' || k === ' ') pinDisarm();
      }
      document.addEventListener('click', onClickCapture, true);
      document.addEventListener('pointerdown', onPointerDownCapture, true);
      document.addEventListener('wheel', pinDisarm, { capture: true, passive: true });
      document.addEventListener('touchstart', pinDisarm, { capture: true, passive: true });
      document.addEventListener('keydown', onKeyDown, true);
      return function () {
        document.removeEventListener('click', onClickCapture, true);
        document.removeEventListener('pointerdown', onPointerDownCapture, true);
        document.removeEventListener('wheel', pinDisarm, true);
        document.removeEventListener('touchstart', pinDisarm, true);
        document.removeEventListener('keydown', onKeyDown, true);
        pinDisarm();
      };
    }

    // 工具根调用的 wire 名（供组内行兜底）。
    function rootName(root) {
      if (!root) return '';
      return root.kind === 'tool-result' ? (root.call ? root.call.name : '') : (root.name || '');
    }

    // ============================================================
    // 六点七、原版行（中级档）：照 DSH 产品的工具行规则，用官方
    //   ui-primitives 原语（StateDot / DisclosureRow / 图标）拼出与
    //   产品一致的行语言：图标 + 类别标题 +「 · 」+ 参数摘要。
    //   规则对照物（产品演进时需同步）：
    //     ui-tool/tool/models/tool-call-model.ts 的 TOOL_VARIANTS /
    //     TOOL_TITLE_KEYS / SUMMARY_KEYS
    //     ui-tool/tool/toolviews/GenericToolCard.tsx 的 VARIANT_ICONS
    //     ui-tool/tool/components/ToolRow.tsx 的 leadingFor
    //   primitives 取不到时（宿主未提供）退回 emoji + 普通布局。
    // ============================================================
    const NATIVE_VARIANTS = {
      bash: 'bash',
      pwsh: 'bash',
      read: 'read',
      read_image: 'read',
      web_fetch: 'read',
      cordis_package_inspect: 'read',
      cordis_runtime_inspect: 'read',
      web_search: 'search',
      grep: 'search',
      glob: 'search',
      write: 'write',
      edit: 'edit',
      run_code: 'code',
      cordis_run: 'others',
      cordis_stop: 'others',
      cordis_undefine: 'others',
    };

    // 类别标题（对应产品 locale 的 tool.title.*）
    const NATIVE_TITLES = {
      search: { zh: '搜索', en: 'Search' },
      read: { zh: '读取', en: 'Read' },
      bash: { zh: 'Bash', en: 'Bash' },
      write: { zh: '写入', en: 'Write' },
      edit: { zh: '编辑', en: 'Edit' },
      code: { zh: '代码', en: 'Code' },
      others: { zh: '工具调用', en: 'Tool call' },
    };

    // 工具专属标题（覆盖类别标题）
    const NATIVE_TOOL_TITLES = {
      pwsh: { zh: 'Pwsh', en: 'Pwsh' },
      read_image: { zh: '读取图片', en: 'Read image' },
      cordis_package_inspect: { zh: '查看', en: 'Inspect' },
      cordis_runtime_inspect: { zh: '查看', en: 'Inspect' },
      cordis_run: { zh: '运行 Cordis 插件', en: 'Run Cordis Plugin' },
      cordis_stop: { zh: '停止 Cordis 插件', en: 'Stop Cordis Plugin' },
      cordis_undefine: { zh: '移除 Cordis 插件', en: 'Remove Cordis Plugin' },
    };

    // 摘要取键顺序（照产品 SUMMARY_KEYS）
    const NATIVE_SUMMARY_KEYS = {
      bash: ['description', 'command'],
      read: ['path', 'file_path', 'url'],
      search: ['query', 'pattern', 'url'],
      write: ['path', 'file_path'],
      edit: ['path', 'file_path'],
      code: ['description'],
      others: [],
    };

    // 官方图标组件名（variant → 名字；尺寸与产品一致：16 盒内 14）
    const NATIVE_ICON_NAMES = {
      search: 'IconSearchOutline16',
      read: 'IconBrowseOutline16',
      bash: 'IconApiOutline14',
      write: 'IconEditOutline16',
      edit: 'IconEditOutline16',
      code: 'IconCodeOutline16',
      others: 'IconSparkle16',
    };

    function nativeVariant(name) {
      return NATIVE_VARIANTS[name] || 'others';
    }

    function nativeTitle(name) {
      const table = NATIVE_TOOL_TITLES[name] || NATIVE_TITLES[nativeVariant(name)] || NATIVE_TITLES.others;
      return lang === 'en' ? table.en : table.zh;
    }

    function firstLineOf(s) {
      if (typeof s !== 'string') return '';
      const i = s.indexOf('\n');
      return i === -1 ? s : s.slice(0, i);
    }

    function pickStr(obj, keys) {
      for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        // 敏感键名永不展示：整洁档照原版规则取参数，但脱敏底线不因档位松动
        if (SENSITIVE_KEY.test(k)) continue;
        var v = obj[k];
        if (typeof v === 'string' && v !== '') return v;
      }
      return undefined;
    }

    // 参数里是否含"有值的敏感键"：命中时不允许回退到原始 JSON 文本
    // （否则敏感键名连同值会以 JSON 片段的形式出现在摘要里）。
    function hasSensitiveValue(obj) {
      const keys = Object.keys(obj);
      for (var i = 0; i < keys.length; i++) {
        const v = obj[keys[i]];
        if (typeof v === 'string' && v !== '' && SENSITIVE_KEY.test(keys[i])) return true;
      }
      return false;
    }

    // 参数摘要：照产品 SUMMARY_KEYS 取键，缺省落到第一个字符串参数；
    // others 且无专属标题时前缀工具名（产品同样处理，如「get_goal · {}」）。
    // 与产品的唯一差异是脱敏底线：敏感键永不取值，摘要在无安全值时不回退原文。
    function nativeSummary(name, argsRaw) {
      const variant = nativeVariant(name);
      var parsed = null;
      if (argsRaw) { try { parsed = JSON.parse(argsRaw); } catch (e) { parsed = null; } }
      if (!parsed || typeof parsed !== 'object') return redact(firstLineOf(argsRaw || ''));
      if (variant === 'search' && Array.isArray(parsed.queries)) {
        const qs = parsed.queries.filter(function (q) { return typeof q === 'string' && q !== ''; });
        if (qs.length > 0) return redact(qs.map(firstLineOf).join(', '));
      }
      var picked = pickStr(parsed, NATIVE_SUMMARY_KEYS[variant] || []);
      if (picked === undefined) {
        const keys = Object.keys(parsed);
        for (var i = 0; i < keys.length; i++) {
          const k = keys[i];
          if (SENSITIVE_KEY.test(k)) continue;   // 同上：敏感键跳过而非兜底展示
          const v = parsed[k];
          if (typeof v === 'string' && v !== '') { picked = v; break; }
        }
      }
      // 找不到安全值时：参数含敏感键就留空，否则照产品回退原文首行
      const base = picked !== undefined
        ? firstLineOf(picked)
        : (hasSensitiveValue(parsed) ? '' : firstLineOf(argsRaw || ''));
      // 摘要文本再过一次密钥形态替换（sk-xxx / Bearer xxx / ?token=xxx / key=xxx）
      if (variant === 'others' && name !== '' && NATIVE_TOOL_TITLES[name] === undefined) {
        return redact(base === '' ? name : name + ' · ' + base);
      }
      return redact(base);
    }

    // 原版行组件：官方 DisclosureRow（24px 行 + 悬停箭头 + 展开）+ StateDot
    //   （错误 / 中断 / 运行中）+ 官方图标（其余状态）。展开后仍是本插件的
    //   脱敏交付文档，脱敏底线不因档位改变。
    //   ⚠ 组件体在模块作用域，所以**凡是用到的 apply 作用域成员都必须当参数传进来**。
    //   曾经只传了节拍 hook，而行开合改成插件级 store 之后多用了 useRowOpen /
    //   toggleRow，这两个没有跟着进来 —— 整洁档每一行都在渲染时抛
    //   `ReferenceError: useRowOpen is not defined`，槽位随即摘牌，整片工具行消失。
    //   回归桩默认跑 simple 档，这条整整漏了一版（2026-09-19 由可视化验收页抓到）。
    function makeNativeToolRow(useTick, useRowOpen, toggleRow) {
      return function NativeToolRow(props) {
      const P = props.primitives;
      const toolName = props.toolName || '';
      const meta = toolRowMeta(toolName, props.block || {});
      const name = meta.name;
      const variant = nativeVariant(name);
      const title = nativeTitle(name);
      const summary = nativeSummary(name, meta.argsRaw || '');
      const open = useRowOpen(props.sessionId, props.nodeKey);

      var leading;
      if (P && P.StateDot && !meta.settled) leading = React.createElement(P.StateDot, { state: 'ongoing' });
      else if (P && P.StateDot && meta.isError) leading = React.createElement(P.StateDot, { state: 'error' });
      else if (P && P.StateDot && meta.soft) leading = React.createElement(P.StateDot, { state: 'warning' });
      else {
        const IconComp = P ? P[NATIVE_ICON_NAMES[variant]] : undefined;
        leading = IconComp
          ? React.createElement(IconComp, { size: 14 })
          : React.createElement('span', { className: 'prism-emoji' }, toolIcon(name));
      }

      const collapsed = summary === '' ? null : React.createElement('span', { className: 'prism-native-meta' },
        React.createElement('span', { className: 'prism-native-sep', 'aria-hidden': true }),
        React.createElement('span', { className: 'prism-native-summary' }, summary),
      );

      const now = useTick(!meta.settled && meta.callTime !== null);
      const dur = durationTextOf(props.block || {}, meta.settled, now);
      const durEl = dur ? React.createElement('span', { className: 'prism-dur ' + meta.statusCls }, dur) : null;

      const detailKind = officialShownKind(name, meta, P);
      const detailArgsRaw = detailKind === null ? meta.argsRaw : argsRawForOfficial(meta.argsRaw, detailKind);
      const detail = React.createElement('div', {
        className: 'prism-detail prism-native-detail'
          + (detailKind === null ? '' : ' prism-detail-plain'),
        onClick: function (e) { e.stopPropagation(); },
      },
        React.createElement('div', { className: 'prism-doc' },
          React.createElement('div', { className: 'prism-doc-name' }, name),
          detailArgsRaw === null ? null : React.createElement(ArgsBlock, { argsRaw: detailArgsRaw, primitives: P }),
          React.createElement(ToolResultBody, {
            primitives: P, name: name, argsRaw: meta.argsRaw,
            text: meta.text, settled: meta.settled, meta: meta,
          }),
        ),
      );

      if (P && P.DisclosureRow) {
        return React.createElement(P.DisclosureRow, {
          icon: leading,
          title: title,
          open: open,
          expandable: true,
          expandOnRowClick: true,
          keepContentWhenOpen: true,
          onToggle: function () { toggleRow(props.sessionId, props.nodeKey, open); },
          collapsedContent: durEl
            ? React.createElement('span', { className: 'prism-native-meta' }, collapsed, durEl)
            : collapsed,
          titleClassName: 'prism-native-title',
          // 自己的类名：整洁档的行是官方 DisclosureRow 画的，没有它，
          //   「点开时钉住被点那一块」就认不出这条行（见 §六点六点二）。
          className: 'prism-native-row',
        }, open ? detail : null);
      }

      // primitives 不可用时的降级行（保持信息结构，样式从简）
      return React.createElement('div', {
        className: 'prism-card prism-native prism-native-fallback',
        title: title + (summary ? ' · ' + summary : ''),
        onClick: function () { toggleRow(props.sessionId, props.nodeKey, open); },
      },
        React.createElement('span', { className: 'prism-native-leading' }, leading),
        React.createElement('span', { className: 'prism-native-title' }, title),
        collapsed,
        durEl,
        open ? detail : null,
      );
      };
    }

    const inject = ['slots', 'locale'];

    function apply(ctx) {
      const slots = ctx.slots;

      // 官方 UI 原语：宿主平台单例（modules 的静态表里有它），直接 require
      // 即得，无需打包或安装；取不到时中级档降级为普通布局（功能不丢）。
      let primitives = null;
      try { primitives = require('@deepseek-ai/dsh-client-ui-primitives') || null; } catch (e) { primitives = null; }

      // ---- 档位记忆（localStorage）----
      //   宿主的界面偏好也走同一条路（例如 `dsh.conversation.contentWidth`），所以
      //   这里不引入任何依赖，只用浏览器原生 localStorage 存一个档位字符串。
      //   读不到 / 值脏 / 被浏览器禁用，一律当「没存过」，回默认原生档 —— 记忆失败
      //   绝不拖累界面（与宿主 attachPersistence 的「存储失败只停持久化」同一契约）。
      const MODE_KEY = 'dsh.prism.mode';
      const MODE_KEYS = ['native', 'medium', 'simple'];
      let storageWarned = false;
      function warnStorageOnce(e) {
        if (storageWarned) return;
        storageWarned = true;
        // 失败要大声，但**不进 diag.errors**：那三本账是「渲染可靠性」的计数器
        //   （菜单里那个 errors=N），存储不可用与渲染无关，别让它误报。
        try {
          console.warn('[prism] 本地记忆不可用（浏览器禁用或配额满）：档位切换照常，重启后回默认原生档'
            + (e && e.message ? ' · ' + e.message : ''));
        } catch (err) { /* ignore */ }
      }
      function readStoredMode() {
        try {
          if (typeof localStorage === 'undefined') return null;
          const raw = localStorage.getItem(MODE_KEY);
          return raw !== null && MODE_KEYS.indexOf(raw) !== -1 ? raw : null;
        } catch (e) { warnStorageOnce(e); return null; }
      }
      function writeStoredMode(m) {
        try {
          if (typeof localStorage === 'undefined') return;
          localStorage.setItem(MODE_KEY, m);
        } catch (e) { warnStorageOnce(e); }
      }

      // ---- 状态（内存态；档位是例外，落本地记忆）----
      const storedMode = readStoredMode();
      const store = {
        mode: storedMode || 'native',      // native | medium | simple（有记忆就用记忆）
        hideComplex: true,   // 简化档：把复杂工具折叠成一行
        menuOpen: false,
        // 开合状态分两层：**自动默认**（运行中自动开面板、自动展开当前段）与
        //   **手动覆盖**（主人点过的那一次说了算）。只记手动的那一层，默认值每次
        //   渲染现算 —— 否则「运行中自动开」在轮次闭合时不会自己收回。
        turnsManual: new Map(),    // 「会话:turn」→ true/false（主人点开的/点收的）
        segmentsManual: new Map(), // 「会话:turn:段序」→ true/false
        answersManual: new Map(),  // 「会话:节点 key」→ 答案步的思考是否展开
        rowsManual: new Map(),     // 「会话:节点 key」→ 工具行详情是否展开
        listeners: new Set(),
      };
      function notify() { store.listeners.forEach(function (fn) { fn(); }); }

      // ---- 语言：跟随产品 locale（ctx.locale），切换即重渲染 ----
      function syncLang(snapshot) {
        const next = snapshot && snapshot.active === 'en' ? 'en' : 'zh';
        if (next !== lang) { lang = next; notify(); }
      }
      if (ctx.locale) syncLang(ctx.locale.getLocale());
      ctx.effect(function () {
        return ctx.on('locale/change', syncLang);
      });
      // 注册与切换的观测面：任何异常都记下来，绝不静默吞掉
      const diag = { registered: {}, errors: [], seats: 0, compact: 0, turns: 0, snap: {} };
      // 回合快照（v1.10.6）：主人报过一类「偶发」故障 —— 「整洁档下，一轮回复完
      //   有时呈现原生效果」。时好时坏没法靠猜，得让它自己在现场留痕：每个 turn
      //   记下最近一次渲染时插件**看到了什么**（节点种类清单、本段归属、认领结果、
      //   产品是否在折叠这一轮）。事后出问题时，主人在控制台敲
      //   `__PRISM_DIAG__.snap` 就能看出当时是哪一环缺席。
      //   只存最近 5 轮，值是短标量，长会话也不会撑爆（且不进菜单摘要）。
      //   ⚠ 红线：`diag` 是**本地排错面**，含节点 key 与轮次结构这类会话内部标识。
      //   勿把它贴进公开仓库 / issue / 截图（本项目 lib/ 是公开插件代码）。
      const SNAP_MAX_TURNS = 5;
      // ---- 异常留痕（v1.13.0）：把「该折的行没折起来」那一刻写进本地存储 ----
      //   来由（2026-09-23）：主人报「长会话里整洁档偶尔呈现原生效果」，追问后确认
      //   形态是「工具行都在、只是没被收成一条折叠行」，而且**切档 + 刷新就自己好了**。
      //   这类毛病自己会好，靠人手快去抓现场不可靠（主人原话：「找不到有毛病的页面了」）。
      //   所以挂一支极轻的笔：只在**可疑形态**出现、且**指纹变化**时写一次盘。
      //   红线：只写结构字段（成没成段 / 认没认领到 / 在哪 / DOM 计数），
      //   不写 node key、不写任何正文；容量封顶，超了丢最旧的一半。
      const DIAG_LOG_KEY = 'dsh.prism.diag.log';
      const DIAG_LOG_MAX = 20;
      const DIAG_LOG_SEEN_MAX = 500;
      const diagLogSeen = {};       // 指纹 → true，防同一形态每帧重复写盘
      // 指纹刻意**不含** folded（工具计数）：长轮里每来一个工具它就会变，那等于每个
      //   工具都写一次盘。判形态用 span / claimOK / inWin 三项就够，同一轮同一形态只记一次。
      function diagLogFingerprint(turn, kind, record, sessionId) {
        return (sessionId || '') + '|' + turn + '|' + kind + '|' + (record.span ? 1 : 0)
          + (record.claimOK ? 1 : 0) + (record.inWin ? 1 : 0);
      }
      // DOM 实况：这一轮里工具座位、prism 折叠行、被收座位各有多少。
      //   只在留痕时算一次（异常次数少），开销可忽略；量不到就返回 null。
      function diagLogDom(turn) {
        try {
          if (typeof document === 'undefined' || document === null) return null;
          var seats = document.querySelectorAll('[data-chat-turn="' + turn + '"]');
          var toolSeats = 0;
          var prismRows = 0;
          var foldedSeats = 0;
          for (var i = 0; i < seats.length; i++) {
            var el = seats[i];
            if (el.getAttribute('data-chat-flow-kind') === 'tool-call') toolSeats++;
            if (el.querySelector('.prism-group-row, .prism-group-panel')) prismRows++;
            if (el.getAttribute(FOLD_MARK) !== null) foldedSeats++;
          }
          return { toolSeats: toolSeats, prismRows: prismRows, foldedSeats: foldedSeats };
        } catch (e) { return null; }
      }
      // 可疑判据就两条，都是「该折叠的行没被折叠」：
      //   span=false     本节点没落进任何段 → 工具格走单行原版行（整洁档此刻与原生同貌）
      //   claimOK=false  认领失败 → 那一段没人画折叠行
      //   产品自己折（foldable）与节点不在窗口（inWin=false）都算正常形态，不记 —— 记了
      //   只会把有限的容量让给日常滚动。还要留意调用点的位置：noteTurnSnap 落在
      //   「不在窗口」「拿不到会话快照」两处早退**之后**，所以那两种情形本来也到不了这里。
      //   原生档零注册，同样到不了。
      function persistDiagSample(turn, nodeKind, record, sessionId) {
        if (store.mode === 'native') return;
        if (!(record.span === false || record.claimOK === false)) return;
        var fp = diagLogFingerprint(turn, nodeKind, record, sessionId);
        if (diagLogSeen[fp]) return;
        if (Object.keys(diagLogSeen).length > DIAG_LOG_SEEN_MAX) {
          for (var k in diagLogSeen) delete diagLogSeen[k];
        }
        diagLogSeen[fp] = true;
        try {
          if (typeof localStorage === 'undefined') return;
          var raw = localStorage.getItem(DIAG_LOG_KEY);
          var list = raw ? JSON.parse(raw) : [];
          if (!Array.isArray(list)) list = [];
          var sample = {
            at: Date.now(), turn: turn, kind: nodeKind,
            nodes: record.nodes, kinds: record.kinds, ans: record.ans,
            inWin: !!record.inWin, span: !!record.span, folded: record.folded,
            claimOK: !!record.claimOK, foldable: !!record.foldable, open: !!record.open,
            turnStatus: record.turnStatus,
            dom: diagLogDom(turn),
          };
          // 同一轮同一种类只留最新一条：单轮刷不爆容量，样本还带着最新的计数。
          var at = -1;
          for (var i = list.length - 1; i >= 0; i--) {
            if (list[i] && list[i].turn === turn && list[i].kind === nodeKind) { at = i; break; }
          }
          if (at === -1) list.push(sample); else list[at] = sample;
          if (list.length > DIAG_LOG_MAX) list = list.slice(list.length - Math.floor(DIAG_LOG_MAX / 2));
          localStorage.setItem(DIAG_LOG_KEY, JSON.stringify(list));
        } catch (e) {
          // 数据被污染或配额满：清一次让下一次重来，别让留痕从此静默失效
          try { if (typeof localStorage !== 'undefined') localStorage.removeItem(DIAG_LOG_KEY); } catch (e2) { /* 只读环境 */ }
          warnStorageOnce(e);
        }
      }
      function noteTurnSnap(turn, nodeKind, record, sessionId) {
        try {
          const key = String(turn);
          const slot = diag.snap[key] || (diag.snap[key] = {});
          // 每个节点种类留最近 3 次渲染（带时间戳）—— 单看最后一次看不出「卡片是
          //   哪一瞬间消失的」，而这正是主人报的那类问题要看的。
          const hist = slot[nodeKind] || (slot[nodeKind] = []);
          hist.push(Object.assign({ at: Date.now() % 1000000 }, record));
          if (hist.length > 3) hist.shift();
          const keys = Object.keys(diag.snap);
          if (keys.length > SNAP_MAX_TURNS) {
            keys.sort(function (a, b) { return Number(a) - Number(b); });
            for (var i = 0; i < keys.length - SNAP_MAX_TURNS; i++) delete diag.snap[keys[i]];
          }
          persistDiagSample(turn, nodeKind, record, sessionId);
        } catch (e) { /* 快照失败绝不拖垮渲染 */ }
      }
      if (typeof window !== 'undefined') {
        try { window.__PRISM_DIAG__ = diag; } catch (e) { /* 只读环境 */ }
      }
      // 菜单里的一行诊断摘要：能看出注册是否成功、渲染有没有抛错、
      //   折叠掉的座位有没有真的收到行距（seats=收掉的座位数）。
      function diagSummary() {
        const reg = diag.registered;
        const parts = [];
        parts.push('tool-call=' + (reg['tool-call'] ? 'ok' : 'NO'));
        parts.push('assistant-step=' + (reg['assistant-step'] ? 'ok' : 'NO'));
        parts.push('model-retry=' + (reg['model-retry'] ? 'ok' : 'NO'));
        return parts.join(' · ');
      }
      // 行距三本账单独一行：菜单宽 220px，挤在同一行会被截断（主人看不到最末一个数）
      function diagCounters() {
        const parts = [];
        parts.push('seats=' + diag.seats);
        // 行距那三本账要一眼可见（主人 2026-09-21 点名「想看到」）。三个数各有各的
        //   用处，排查「间隔太大 / 内容不见了」时全靠它们分辨是哪一类：
        //     seats   按折叠名单收掉的让位座位数
        //     blank   本轮空白座位直接收的累计数（工具 / 重试：插件接过却没画东西）
        //     compact 取半值行距的行数（承载折叠行的那条 + 它后面一行）
        //   为 0 时也照写：「该收却没收到」正是要看的异常，省掉 0 反而看不见。
        parts.push('blank=' + diag.blank);
        parts.push('compact=' + diag.compact);
        if (diag.errors.length > 0) parts.push('errors=' + diag.errors.length);
        return parts.join(' · ');
      }
      // 记错误要连堆栈一起记。只留 message 的时候，「在 undefined 上读某个属性」
      //   这类异常只能看出属性名、钉不到抛出点 —— 2026-09-19 那次真机排错就卡在这里：
      //   29 条 'reading node' 只知道读的是什么，不知道是谁在读。
      //   堆栈只进控制台，不进 diag.errors（菜单与体检面不该被长文本撑爆）。
      function logPrismError(where, err) {
        const msg = where + ': ' + (err && err.message ? err.message : String(err));
        diag.errors.push(msg);
        try {
          console.error('[prism] ' + msg);
          if (err && typeof err.stack === 'string') {
            // 首行是 message 本身，去掉；最多留 6 帧，够看出「谁调用了谁」
            const frames = err.stack.split('\n').slice(1, 7).map(function (s) { return s.trim(); });
            if (frames.length > 0) console.error('[prism] 抛出位置：\n  ' + frames.join('\n  '));
          }
        } catch (e) { /* ignore */ }
      }

      function setMode(m) {
        // 注意：即使档位没变也通知一次。注册（tool-call / assistant-step 渲染器）
        //   是靠订阅通知驱动的，早期版本在这里提前 return，导致「状态已是白话档但
        //   渲染器没注册」时再次切档什么都不发生 —— 折叠组整块消失。
        store.mode = m;
        // 只有白名单里的档位才落盘：调试逃生门 __PRISM_SET_MODE__('乱值') 行为不变
        //   （当场照切），但脏值不会写进记忆、把界面锁在下一次刷新之后。
        if (MODE_KEYS.indexOf(m) !== -1) writeStoredMode(m);
        notify();
      }
      // 调试逃生门（与 __PRISM_DEBUG__ 同一路数，只读/切换档位，不碰数据）：
      // 无头验证或产品升级定位时，可以在控制台直接切档，不必点菜单。
      if (typeof window !== 'undefined') {
        try {
          window.__PRISM_SET_MODE__ = setMode;
          window.__PRISM_GET_MODE__ = function () { return store.mode; };
          // 异常留痕的读口（v1.13.0）：事后取证用。只读与清空，不碰任何渲染状态。
          window.__PRISM_DIAG_LOG__ = function () {
            try { return localStorage.getItem(DIAG_LOG_KEY) || '[]'; } catch (e) { return '[]'; }
          };
          window.__PRISM_DIAG_LOG_CLEAR__ = function () {
            try { localStorage.removeItem(DIAG_LOG_KEY); } catch (e) { /* 只读环境 */ }
          };
        } catch (e) { /* 只读环境忽略 */ }
      }
      // 体检面（只读）：__PRISM_DEBUG__ 打开时打一行「档位从哪来」。真机上确认
      //   「刷新后档位还在」看的就是这一行（restored = 吃了记忆，default = 首次）。
      if (typeof window !== 'undefined' && window.__PRISM_DEBUG__) {
        try {
          console.log('[prism] 档位：' + store.mode + (storedMode ? '（本地记忆恢复）' : '（默认）'));
        } catch (e) { /* ignore */ }
      }
      function setHideComplex(v) {
        if (store.hideComplex === v) return;
        store.hideComplex = v;
        notify();
      }
      function toggleMenu() {
        store.menuOpen = !store.menuOpen;
        notify();
      }
      // 展开态按「会话 + turn + 组」记账：store 是插件级（不随会话切换重建），
      // 只用 turn 编号会让两个会话里同号 turn 互相串档；一轮现在有**多条**
      // 折叠行，再不带组标识就会「点开一条、全轮一起开」。
      function groupKey(sessionId, turn, groupId) {
        return (sessionId || '') + ':' + (turn === null ? 'none' : turn) + ':'
          + (groupId === undefined || groupId === null ? 'head' : String(groupId));
      }
      // 有界记账：这几本 Map 是「主人点过哪些行」的记忆，键里带会话 —— 正常情况下
      //   需要跨重挂保留，所以不能按轮次清。但没有上限时会随长会话无限增长
      //   （每轮 × 每段 × 每个行详情各一条），且会话关掉也不回收。
      //   超过上限就整本丢弃最旧的一半（Map 保持插入顺序）：只丢「业主手动开合」
      //   这类可重建的状态，不涉及任何数据与渲染契约；一次丢弃换长期有界。
      function toggleGroup(sessionId, turn, groupId, current) {
        rememberManual(store.turnsManual, groupKey(sessionId, turn, groupId), !current);
        notify();
      }
      function closeMenu() {
        if (!store.menuOpen) return;
        store.menuOpen = false;
        notify();
      }
      function subscribe(fn) {
        store.listeners.add(fn);
        return function () { store.listeners.delete(fn); };
      }
      function useMode() {
        const [mode, setLocal] = React.useState(store.mode);
        React.useEffect(function () { return subscribe(function () { setLocal(store.mode); }); }, []);
        return mode;
      }
      function useMenuOpen() {
        const [open, setLocal] = React.useState(store.menuOpen);
        React.useEffect(function () { return subscribe(function () { setLocal(store.menuOpen); }); }, []);
        return open;
      }
      function useHideComplex() {
        const [v, setLocal] = React.useState(store.hideComplex);
        React.useEffect(function () { return subscribe(function () { setLocal(store.hideComplex); }); }, []);
        return v;
      }
      // 订阅一次就够：手动值从 store 现读，自动值从 props 现读，两者都在渲染期
      //   求值，所以轮次闭合（自动值翻假）能自然收回，不需要另存一份 state。
      function useStoreVersion() {
        const [, bump] = React.useState(0);
        React.useEffect(function () {
          return subscribe(function () { bump(function (n) { return n + 1; }); });
        }, []);
      }
      // 折叠行开合状态的「只读」版本（不订阅）：卡片在**当前渲染里**读一次即可 ——
      //   订阅由它的宿主组件负责。分开写是为了守住 React 的硬约束：卡片能不能
      //   渲染（认领成功与否）会变，若卡片自己订阅，hook 数就会一次多一次少，
      //   React 会在我们的 catch 之外抛「Rendered more hooks…」→ 槽位摘牌。
      function readGroupOpen(sessionId, turn, groupId, autoOpen) {
        const key = groupKey(sessionId, turn, groupId);
        return store.turnsManual.has(key) ? store.turnsManual.get(key) : !!autoOpen;
      }

      // 折叠行的开合（v1.10.0 起一轮有多条，键里必须带组标识）：
      //   「会话已记过的手动值」优先，否则用自动值（运行中开、结算后收）。
      //   只在**恒会被调用的宿主组件**里用（工具格 / 助手格两条路径都调用它）。
      function useSpanOpen(sessionId, turn, groupId, autoOpen) {
        useStoreVersion();
        return readGroupOpen(sessionId, turn, groupId, autoOpen);
      }
      // 段的开合：**默认收起**（点开本段那条折叠行后是一排折叠好的段，与对标
      //   界面一致），用户展开哪段就记哪段。
      //   键为「会话:turn:段标识:段序」—— 跨会话、跨 turn、跨折叠行互不串档。
      function segmentKey(sessionId, turn, groupId, index) {
        return groupKey(sessionId, turn, groupId) + ':' + index;
      }
      function useSegmentOpen(sessionId, turn, groupId, index, autoOpen) {
        useStoreVersion();
        const key = segmentKey(sessionId, turn, groupId, index);
        return store.segmentsManual.has(key) ? store.segmentsManual.get(key) : !!autoOpen;
      }
      // 答案步的思考：默认收起，点开才铺开（与面板里的段头同一套语言）
      function answerThoughtKey(sessionId, nodeKey) {
        return (sessionId || '') + ':' + nodeKey;
      }
      function useAnswerThoughtOpen(sessionId, nodeKey) {
        useStoreVersion();
        return store.answersManual.get(answerThoughtKey(sessionId, nodeKey)) === true;
      }
      // 工具行的开合：与组 / 段 / 答案思考同一套（插件级、键里带会话），
      //   于是重挂或切档后不回弹，也才测得动。
      function useRowOpen(sessionId, nodeKey) {
        useStoreVersion();
        return store.rowsManual.get(answerThoughtKey(sessionId, nodeKey)) === true;
      }
      function toggleRow(sessionId, nodeKey, current) {
        rememberManual(store.rowsManual, answerThoughtKey(sessionId, nodeKey), !current);
        notify();
      }
      function toggleAnswerThought(sessionId, nodeKey, current) {
        rememberManual(store.answersManual, answerThoughtKey(sessionId, nodeKey), !current);
        notify();
      }

      function toggleSegment(sessionId, turn, groupId, index, current) {
        rememberManual(store.segmentsManual, segmentKey(sessionId, turn, groupId, index), !current);
        notify();
      }

      // ---- 折叠行的渲染权：认领制（v1.10.0 起一段一本账） ----
      //   一条折叠行只允许**该段内的一个节点**渲染。判「我是谁」的两套写法都不牢：
      //   按 key，查不到自己会各自渲染（一串重复行）；按位置，窗口不全时没人
      //   敢渲染（折叠行消失）。认领制：第一个**在窗口里、且落在这一段内**的节点
      //   登记为渲染者，其余节点让位；渲染者离场时本段下一次渲染即接管。
      //   账本的键 = 「会话 + turn + 组标识」：一轮有多条折叠行，各记各的账，
      //   互不串档（组标识 = 组首步号，见 computeGroups）。
      //   三条硬规则（每条都对应一个真见过的故障）：
      //     ① 只有「自己在窗口里」的节点能认领。否则一个查不到自己的节点会
      //        占着渲染权却渲染空 —— 整段的折叠行就此消失（认领者隐身）。
      //     ② 认领者记下自己的 node.key：它一旦不在当前窗口里（长轮里窗口
      //        会整段换血），本段里下一个在窗口里的节点立刻接管，不必等过期。
      //     ③ 过期（10s）仍是最后的兜底：渲染者卸载时不会主动归还。
      const claims = {};  // key -> { owner: object, nodeKey: string, at: number }
      function claimKey(sessionId, turn, groupId) {
        return 'g:' + (sessionId || '') + ':' + (turn === null ? 'none' : turn) + ':'
          + (groupId === undefined || groupId === null ? 'head' : String(groupId));
      }
      // 注册面换代（原生档 ⇄ 折叠档、插件卸载重挂）时整本清空：
      //   新渲染器实例是全新的所有者身份，旧账本只会让它等 TTL。
      function resetClaims() { for (var k in claims) delete claims[k]; }
      const CLAIM_TTL = 10000;
      //   claimable: 本节点是否可认领（在窗口里 + 落在本段内 + 本段有可折的东西）
      //   present  : 当前窗口里的节点 key 数组（判断上任认领者是否已离场）
      //   groupId  : 本段的组标识（null = 不在任何段内 → 不认领）
      function useGroupClaim(sessionId, turn, claimable, present, myKey, groupId) {
        const idRef = React.useRef(null);
        if (idRef.current === null) idRef.current = {};
        const key = claimKey(sessionId, turn, groupId);
        if (claimable) {
          const now = Date.now();
          const cur = claims[key];
          const ownerGone = !!cur && present.indexOf(cur.nodeKey) === -1;
          if (!cur || cur.owner === idRef.current) {
            claims[key] = { owner: idRef.current, nodeKey: myKey, at: now };
          } else if (ownerGone || (now - cur.at) > CLAIM_TTL) {
            claims[key] = { owner: idRef.current, nodeKey: myKey, at: now };
          }
        }
        const mine = claimable && !!claims[key] && claims[key].owner === idRef.current;
        if (mine) claims[key].at = Date.now();
        React.useEffect(function () {
          return function () {
            const c = claims[key];
            // 卸载即交还：把时间戳压到 0（立刻可被接管）。若在这里写 Date.now()，
            //   旧所有者一走就留下 10 秒的「刚刚还在」假象 —— 切档回来、或者
            //   节点因滚动短暂卸载后重挂，这一轮的折叠行会空窗到 TTL 到期。
            if (c && c.owner === idRef.current) c.at = 0;
          };
        }, [key]);
        return mine;
      }

      // 运行中行的耗时只需秒级刷新，且只在页面上真有运行中的行时才起节拍。
      let tickTimer = null;
      const tickListeners = new Set();
      function useTick(enabled) {
        const [now, setNow] = React.useState(Date.now());
        React.useEffect(function () {
          if (!enabled) return undefined;
          const fn = function (nowMs) { setNow(nowMs); };
          tickListeners.add(fn);
          if (tickTimer === null) {
            tickTimer = setInterval(function () {
              const nowMs = Date.now();
              tickListeners.forEach(function (l) { l(nowMs); });
            }, 1000);
          }
          return function () {
            tickListeners.delete(fn);
            if (tickListeners.size === 0 && tickTimer !== null) {
              clearInterval(tickTimer);
              tickTimer = null;
            }
          };
        }, [enabled]);
        return now;
      }

      // 整洁档的原版行组件：在 apply 作用域里造一次（组件类型必须稳定，
      //   否则每次渲染都会当成新组件重挂载），并让它拿得到节拍 hook。
      const NativeToolRow = makeNativeToolRow(useTick, useRowOpen, toggleRow);

      // ---- 工具卡片（白话卡片，折叠组面板内直接渲染；原生档由产品原样渲染）----
      // 行样式：行首类别图标 + 白话行文本 + 行尾状态图标；
      // 点击整行展开「交付文档」详情面板（工具名 + 参数摘要 +
      // 脱敏结果的 Markdown 渲染）。
      function ToolCard(props) {
        const hideComplex = useHideComplex();
        // 行推导统一走共享的元信息函数（折叠组面板内的行也用它）
        const meta = toolRowMeta(props.toolName || '', props.block || {});
        const name = meta.name;
        const argPlain = meta.argPlain;
        const lineText = meta.lineText;
        const plainLine = meta.plainLine;
        const statusIcon = meta.statusIcon;
        const statusCls = meta.statusCls;
        const statusWord = meta.statusWord;
        const rowLabel = meta.rowLabel;
        const settled = meta.settled;
        const text = meta.text;
        const now = useTick(!settled && meta.callTime !== null);
        const dur = durationTextOf(props.block || {}, settled, now);
        const open = useRowOpen(props.sessionId, props.nodeKey);
        const [revealed, setRevealed] = React.useState(false);
        const setOpen = function (v) { toggleRow(props.sessionId, props.nodeKey, !v); };
        const hidden = !!(meta.rule && meta.rule.complex) && hideComplex && !revealed;

        if (hidden) {
          // 折叠行：类别图标 + 白话文案 + 「展开」；点击即展开并打开详情面板
          return React.createElement('div', Object.assign(
            clickableProps('prism-card prism-simple', function () { setRevealed(true); setOpen(true); }, false),
            { title: rowLabel, 'aria-label': rowLabel },
          ),
            React.createElement('span', { className: 'prism-emoji' }, toolIcon(name)),
            React.createElement('span', { className: 'prism-plain' }, plainLine),
            React.createElement('span', {
              className: 'prism-fold',
              onClick: function (e) { e.stopPropagation(); setRevealed(true); setOpen(true); },
            }, t('expandWord')),
          );
        }

        // 手风琴行：整行点击 → 详情在**行内**展开，行本体始终一行高
        const cardKind = officialShownKind(name, meta, primitives);
        const cardArgsRaw = cardKind === null ? meta.argsRaw : argsRawForOfficial(meta.argsRaw, cardKind);
        return React.createElement('div', Object.assign(
          clickableProps('prism-card prism-simple', function () { setOpen(!open); }, open),
          { title: rowLabel, 'aria-label': rowLabel },
        ),
          React.createElement('span', { className: 'prism-emoji' }, toolIcon(name)),
          React.createElement('span', { className: 'prism-plain' }, lineText),
          dur ? React.createElement('span', { className: 'prism-dur ' + statusCls }, dur) : null,
          React.createElement('span', { className: 'prism-ico ' + statusCls, 'aria-hidden': true }, statusIcon),
          React.createElement('span', { className: 'prism-fold' },
            open ? t('collapse') : t('expand')),
          open ? React.createElement('div', {
            className: 'prism-detail'
              + (officialBlockKind(name, meta) === null ? '' : ' prism-detail-plain'),
            onClick: function (e) { e.stopPropagation(); },
          },
            React.createElement('div', { className: 'prism-doc' },
              React.createElement('div', { className: 'prism-doc-name' }, name),
              cardArgsRaw === null ? null : React.createElement(ArgsBlock, { argsRaw: cardArgsRaw, primitives: primitives }),
              // 结果必须先脱敏再渲染（官方块与交付文档都在内部走 redact）
              React.createElement(ToolResultBody, {
                primitives: primitives, name: name, argsRaw: meta.argsRaw,
                text: text, settled: settled, meta: meta,
              }),
            ),
          ) : null,
        );
      }

      // ---- 重试行：只汇总，不重画 ----
      //   产品对重试有自己的行（node kind 'model-retry'），棱镜不接管、不改其
      //   样式；在折叠组里只把它折算成一行摘要，让次数进得了统计口径。
      function RetryRow(props) {
        const node = props.node;
        const state = retryOutcome(node);
        const n = retryCount(node);
        const model = modelRetryName(node);
        const statusIcon = state === 'running' ? '●' : (state === 'err' ? '✕' : '✓');
        const label = t('retrySummary') + n + t('retriesUnit') + (model ? ' · ' + model : '');
        const stateText = state === 'running'
          ? t('inProgress')
          : (state === 'err' ? (t('retryAttempts') + n + t('retryFailed')) : t('done'));
        const cls = state === 'running' ? 'running' : (state === 'err' ? 'err' : 'ok');
        // 整洁档：重试汇总行也用官方的行壳子，别在白话卡片样式上出现
        if (props.mode === 'medium' && primitives && primitives.DisclosureRow) {
          return React.createElement('div', { className: 'prism-native-retry' },
            React.createElement(primitives.DisclosureRow, {
              icon: React.createElement('span', { className: 'prism-emoji' }, '🔁'),
              title: t('retrySummary') + n + t('retriesUnit'),
              open: false,
              expandable: false,
              onToggle: function () {},
              collapsedContent: React.createElement('span', { className: 'prism-native-meta' },
                React.createElement('span', { className: 'prism-native-sep', 'aria-hidden': true }),
                React.createElement('span', { className: 'prism-native-summary' },
                  (model ? model + ' · ' : '') + stateText),
                React.createElement('span', { className: 'prism-ico ' + cls, 'aria-hidden': true }, statusIcon),
              ),
            }),
          );
        }
        return React.createElement('div', {
          className: 'prism-card prism-simple prism-retry',
          title: t('retryNote'),
          'aria-label': stateText + colon() + label,
        },
          React.createElement('span', { className: 'prism-emoji' }, '🔁'),
          React.createElement('span', { className: 'prism-plain' }, label),
          React.createElement('span', { className: 'prism-ico ' + cls, 'aria-hidden': true }, statusIcon),
        );
      }

      // 让位的座位不占行距：由本段的认领者负责同步（其余节点渲染 null，座位会
      //   留下一条 16px 的空档，见 §六点六点一）。
      //   每条折叠行只管自己那批座位（foldedKeys）；allowed 按整轮给，交集天然正确。
      //   重跑判据与选择器比较器共用同一份内容指纹（nodeFingerprint）：节点集合
      //   变了、某个节点内容长了，都算「变了」，座位才有机会被重新判定。
      //   只在认领者身上算，其余节点不碰 DOM；非认领者恒为 ''。
      //   工具格与助手格两条路径共用这一个 effect —— v1.10.0 分区之后，正文步
      //   常态就是认领者；只给工具格接这件事，折叠档下就会留下一堆零高度却
      //   各占 16px 行距的空座位（症状：卡片与正文之间空一大截）。
      function useFoldSeatsEffect(iAmGroupOwner, turn, foldedKeys, turnNodes, answerStep) {
        const contentSig = iAmGroupOwner ? turnNodes.map(nodeFingerprint).join('|') : '';
        const allowedSeats = iAmGroupOwner ? collapsibleKeys(turnNodes, answerStep) : null;
        // 收行距这一步碰的是产品自己的 DOM：任何意外都必须就地吃掉并记账，
        //   绝不让它冒出去 —— 槽的崩溃边界会把插件从这一格上摘掉（abdicate），
        //   一次 DOM 抖动换一条时间线，代价太大。
        React.useLayoutEffect(function () {
          if (!iAmGroupOwner || !foldedKeys) return undefined;
          var mine = [];
          try { mine = syncFoldedSeats(turn, foldedKeys, allowedSeats || {}, diag); } catch (e) { logPrismError('syncFoldedSeats', e); }
          // 本轮里「插件接过、但什么也没画」的座位（工具 / 重试行）一并收掉：
          //   否则虚拟化把某个所有者卸载后，那一段的壳子会留在原地占行距
          //   （见 syncBlankSeats 的注释）。
          try { mine = mine.concat(syncBlankSeats(turn, diag)); } catch (e) { logPrismError('syncBlankSeats', e); }
          // 让承载折叠行的那条座位与它后面一行都取半值行距（见 syncCompactRows）
          try { syncCompactRows(turn, diag); } catch (e) { logPrismError('syncCompactRows', e); }
          return function () {
            // 只还**自己收过的那批**：按整轮撤回会把同轮别的所有者收好的座位
            //   一起弹回来，而它们未必再渲染一次（那是「隔一阵又空出来」的病根）。
            try { releaseFoldedKeys(diag, turn, mine); } catch (e) { logPrismError('releaseFoldedKeys', e); }
            try { releaseCompactRows(turn); } catch (e) { logPrismError('releaseCompactRows', e); }
          };
        }, [turn, contentSig, iAmGroupOwner, answerStep, foldedKeys]);
      }

      // ---- 节点级错误边界：插件自己的崩溃只降级，绝不交给槽位 ----
      //   槽位对 keyed 槽的处置是「崩溃即摘牌」（ui-renderer/scoped-slots.tsx 的
      //   onEntryError → abdicate：这一格随即落到产品自己的渲染器上），异常一旦漏
      //   出去，整类行就从时间线上消失。插件内部的 try/catch 只接得住**代码里**抛的
      //   异常：异常若发生在产品 hook 调用中间，钩子计数已经与上一次对不上，React
      //   会在我们的 catch 之外抛它自己的错误，直接送到槽位手里。
      //   边界放在插件自己的子树里 —— React 先问最近的边界，槽位根本看不到。
      //   真机教训（2026-09-19）：29 条 ToolGroupNode 异常之后，tool-call 与
      //   model-retry 两条登记被整体摘掉，折叠行与工具行一起消失，而菜单还写着
      //   tool-call=ok —— 排错面因此失了真。
      //   位置在两条组件之前：它是 class（TDZ 绑定），组件体里引用它时必须在
      //   这个绑定已经求值之后。
      class PrismNodeBoundary extends React.Component {
        constructor(props) {
          super(props);
          this.state = { failed: false };
        }
        static getDerivedStateFromError() { return { failed: true }; }
        componentDidCatch(err) { logPrismError(this.props.label || 'boundary', err); }
        render() { return this.state.failed ? this.props.fallback : this.props.children; }
      }

      // ---- 一段（一组）的收拢行与面板：两条组件（工具格 / 助手格）共用 ----
      //   一段 = 「一次可见输出 + 它带出的工具」。渲染者由认领制在段内选出
      //   （useGroupClaim），两条组件都可能当上：工具格认领时画「卡片」，
      //   助手格认领时画「正文 + 卡片」（正文在上、卡片紧随其下）。
      //   这里只负责画卡片本身，认领与早退由调用方处理。
      // 状态点（v1.14.0）：改用官方 StateDot（10px 圆点，运行中是追逐动画）。
      //   它与 TerminalBlock 头部那颗是同一个组件 —— 行与卡片不会各说各话。
      //   原语取不到时退回原来的文字图标（优雅降级是这项目的红线）。
      function dotStateOf(cls) {
        if (cls === 'running') return 'ongoing';
        if (cls === 'mixed') return 'warning';
        if (cls === 'err') return 'error';
        return 'done';
      }
      function stateDotOf(cls, icon) {
        const P = primitives;
        if (P && P.StateDot) {
          return React.createElement(P.StateDot, { state: dotStateOf(cls), className: 'prism-group-dot' });
        }
        return React.createElement('span', { className: 'prism-group-status ' + cls, 'aria-hidden': true }, icon);
      }
      // 折叠开关（v1.14.0）：改用官方 FoldToggle —— 它是产品各处折叠共用的
      //   button 语义（aria-expanded / aria-label），文案也从自造的「展开」换成
      //   产品的「还有 N 行」。取不到原语时退回原来的文字行内按钮。
      function foldToggleOf(expanded, hidden, onToggle) {
        const P = primitives;
        if (P && P.FoldToggle) {
          const label = function (n) { return t('moreLines') + n + t('moreLinesTail') + t('showAll'); };
          return React.createElement(P.FoldToggle, {
            className: 'prism-group-toggle',
            expanded: expanded,
            hidden: hidden,
            labels: {
              collapseAria: t('collapseWord'),
              expandAria: label,
              collapse: t('collapseWord'),
              expand: label,
            },
            // 整行本身也可点：开关拦下冒泡，免得一次点击把行和按钮各点一次。
            onToggle: function (e) {
              if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
              onToggle();
            },
          });
        }
        return React.createElement('button', Object.assign(
          clickableProps('prism-group-caret', onToggle, expanded),
          { type: 'button', 'aria-expanded': expanded ? 'true' : 'false' },
        ), expanded ? t('collapse') : t('expand'));
      }
      function renderSpanCard(props) {
        const group = props.group;
        const mode = props.mode;
        // 开合状态由宿主组件读好传进来（见 readGroupOpen 的注释：卡片自身不订阅）
        const spanOpen = !!props.isOpen;
        const toggle = function () { toggleGroup(props.sessionId, props.turn, group.id, spanOpen); };
        const headText = countTextOf(group);
        const status = groupStatus(groupActivities(group));
        // 混合态除警示符号外还要写出对错计数（对在前）；其余状态只有图标。
        const statusText = status.cls === 'mixed' ? status.icon + ' ' + status.word : status.icon;
        // 运行中这条行说「现在在忙什么」；结算后回到统计「N 个工具 · M 次思考」。
        //   没有工具在跑（模型在想或在写）时退回「计数 + 思考中」，不留空话。
        const liveLine = props.running
          ? (runningLineOf(group, props.nowMs) || (headText + ' · ' + t('thinkingNow')))
          : '';
        const line = liveLine || headText;
        const rowTitle = t('groupTitle') + line + t('clickToExpand');
        if (!spanOpen) {
          // 收起状态：一行统计，点击展开分段面板。className 只有这一项 ——
          //   §4.4 的类名就是「收起行」本身的判据（别再叠别的类）。
          return React.createElement('div', Object.assign(
            clickableProps('prism-group-row', toggle, false),
            { title: rowTitle, 'aria-label': rowTitle },
          ),
            React.createElement('span', { className: 'prism-group-emoji', 'aria-hidden': true }, '🔧'),
            React.createElement('span', { className: 'prism-group-title' }, line),
            // 混合态的对错计数不能丢（一块都不许吞）：点后面照旧带「✓ n · ✕ m」
            status.cls === 'mixed'
              ? React.createElement('span', { className: 'prism-group-count', 'aria-hidden': true }, statusText)
              : null,
            stateDotOf(status.cls, status.icon),
            foldToggleOf(false, group.foldedCount, toggle),
          );
        }
        // 没有可显示的段 → 不渲染，避免留下空壳（有效段 = 有工具 / 重试 / 思考）
        const segEntries = [];
        for (var si = 0; si < group.segments.length; si++) {
          var sg = group.segments[si];
          if (sg.tools.length > 0 || sg.retries.length > 0 || sg.thoughts > 0) segEntries.push({ seg: sg, index: si });
        }
        if (segEntries.length === 0) return null;
        // 展开面板：标题区 + 分段区 + 说明区
        return React.createElement('div', { className: 'prism-group-panel' },
          React.createElement('div', Object.assign(
            clickableProps('prism-group-head', toggle, true),
            { title: t('collapseWord') },
          ),
            React.createElement('span', { className: 'prism-group-emoji', 'aria-hidden': true }, '🔧'),
            React.createElement('span', { className: 'prism-group-title' }, t('spanCall') + line),
            status.cls === 'mixed'
              ? React.createElement('span', { className: 'prism-group-count', 'aria-hidden': true }, statusText)
              : null,
            stateDotOf(status.cls, status.icon),
            foldToggleOf(true, group.foldedCount, toggle),
          ),
          React.createElement('div', { className: 'prism-group-list' },
            segEntries.map(function (entry) {
              return React.createElement(GroupSegment, {
                key: 'seg-' + entry.index,
                seg: entry.seg,
                index: entry.index,
                groupId: group.id,
                mode: mode,
                sessionId: props.sessionId,
                turn: props.turn,
                // 运行中自动展开「当前段」（最后一个进行中的段），
                //   更早的段保持一行；没有进行中的段时谁也不自动开。
                autoOpen: props.autoSegmentIndex === entry.index,
              });
            }),
          ),
          React.createElement('div', { className: 'prism-group-note' },
            group.retries.length > 0 ? t('groupNote') + ' ' + t('retryNote') : t('groupNote'),
          ),
        );
      }

      // 段状态与「运行中」判定（两条组件都要用，口径必须一致）：
      //   组里有条目在跑，或者某一段的助手节点还在输出（模型在写、没有工具在跑
      //   的那段也算 —— 那正是「思考中」的形态）。
      function spanRuntimeOf(group) {
        const info = groupStatus(groupActivities(group));
        var autoSegmentIndex = -1;
        for (var sg = 0; sg < group.segments.length; sg++) {
          if (segmentStatus(group.segments[sg]).cls === 'running') autoSegmentIndex = sg;
        }
        return {
          status: info,
          autoSegmentIndex: autoSegmentIndex,
          running: info.cls === 'running' || autoSegmentIndex !== -1,
        };
      }

      // 助手格认领到的卡片：包一层容器把「正文 + 卡片」按顺序摆好。
      //   容器只在真有卡片时生成 —— 取不到会话快照（桩里的裸调用）或本段没有
      //   可折内容时，助手格退回今天的样子（只画正文），不多一层壳。
      function composeSpanCard(props, extra) {
        const useChatProp = props.useChat || props.useSession;
        if (typeof useChatProp !== 'function') return null;
        const node = props.node;
        const turn = turnOf(node.location);
        if (turn === null) return null;
        const sessionId = props.sessionId || '';
        const turnNodes = useChatProp(
          function (sn) { return collectTurnNodes(sn, turn); },
          sameTurnView,
        );
        const answerStep = answerStepOf(props, node);
        const parts = computeGroups(turnNodes, node, answerStep);
        const group = parts.mySpanIndex >= 0 ? parts.groups[parts.mySpanIndex] : null;
        // 「本节点在段内」这一条不能少：认领者在渲染期写入账本，而渲染可能被
        //   丢弃 —— 站在段外却去认领，会把这一段的渲染权占住又画不出来。
        const claimable = !!group && group.foldedCount > 0;
        const presentKeys = [];
        for (var pk = 0; pk < turnNodes.length; pk++) presentKeys.push(turnNodes[pk].key);
        const owner = useGroupClaim(sessionId, turn, claimable, presentKeys, node.key, group ? group.id : null);
        // 「在不在跑」在 hook 之前先算好（useSpanOpen / useTick 都要它）；
        //   组可能为 null，取值一律走守卫。
        const runtime = group ? spanRuntimeOf(group) : null;
        const running = !!(runtime && runtime.running);
        // 订阅与读值都放在这里：助手格的 hook 次序固定（这条路径每次都走完）；
        //   卡片自身不订阅，免得认领成败一变就多/少一个 hook。
        const spanOpen = useSpanOpen(sessionId, turn, group ? group.id : null, running);
        // ⚠ 档位必须在**任何早退之前**读（v1.10.7 的真凶就是这条）。
        //   useMode 内部是 useState + 订阅；放到下面「无段 / 非认领者」那句早退之后，
        //   那一格有时早退、有时不早退 → 本次渲染的 hook 数比上次多一个 → React 抛
        //   #310（Rendered more hooks than during the previous render），而它抛在
        //   插件的 catch 之外，槽位按 keyed 规则摘牌 → 这一格回落到产品自己的行。
        //   真机症状：一轮回复收尾时组形态一变，「有时呈现原生效果」。
        //   同时它也照顾到了档位来源：助手节点的 props 里没有 mode（产品只透传
        //   turnProcess / primitives 等），写 props.mode 会恒为 undefined。
        const spanMode = useMode();
        const nowMs = useTick(running);
        // 让位的座位不占行距（v1.10.0 补）：谁当上本段的认领者，谁负责把本段
        //   折进面板的那些座位收成零高 + 行距减半。此前只有工具格那条路径接了
        //   这件事，而分区之后「正文步」常态就是认领者 —— 于是折叠档下一堆
        //   0 高度、却各占一条 16px 行距的空座位排在卡片之间，看着就是「卡片与
        //   正文间隔太大」。两条路径共用同一个 effect。
        useFoldSeatsEffect(owner, turn, group ? group.foldedKeys : null, turnNodes, answerStep);
        // 现场留痕（只读，见 noteTurnSnap）：记录「助手这一格当时看到什么」。
        noteTurnSnap(turn, 'assistant', {
          nodes: turnNodes.length,
          kinds: turnNodes.map(function (x) { return x.kind; }).join(','),
          ans: answerStep === null || answerStep === undefined ? null : answerStep,
          inWin: !!parts.inWindow,
          span: !!group,
          turnStatus: (turnNodes[0] && turnNodes[0].location && turnNodes[0].location.turn ? turnNodes[0].location.turn.status : null),
          nodeStatus: node.data ? node.data.status : null,
          claimOK: !!owner,
          foldable: !!(props.turnProcess && props.turnProcess.foldable === true),
          open: !!(props.turnProcess && props.turnProcess.open === true),
        }, sessionId);
        if (!group || group.foldedCount <= 0 || !owner) return null;
        const card = renderSpanCard({
          group: group,
          mode: spanMode,
          sessionId: sessionId,
          turn: turn,
          isOpen: spanOpen,
          running: runtime.running,
          autoOpen: runtime.running,
          autoSegmentIndex: runtime.autoSegmentIndex,
          nowMs: nowMs,
        });
        if (!card) return null;
        return React.createElement('div', { className: 'prism-assistant-block' }, extra, card);
      }

      // 助手节点接管（关键一步，也是上一版最大的坑）。
      // 产品的 AssistantNodeView 被本插件以更低 priority 压住，而 keyed 槽只渲染
      //   **赢家**：赢家返回 null 就是这一格空白，**没有「交回产品」这条路**
      //   （ui-renderer/scoped-slots.tsx 的 keyed 分发：entriesOfSlot 找到 winner
      //   就直接渲染它，fallback 只在「这一格没人占」时才出现）。
      //   上一版按交接文档 §4.1 写的「answerStep 命中 → 返回 null 交还产品」在真机
      //   上等于：答案那一段整块消失，只剩折叠行与过程正文。这就是主人看到的
      //   「回复内容全没了」。所以这一步必须由插件自己渲染完整：
      //     · 过程步：只渲染正文（思考原文已在折叠面板的段里），工具头不渲染
      //       （工具行由 tool-call 那一格负责）；
      //     · 答案步：思考 + 正文连着出现（思考明标「思考」），答案与它的来由不切开；
      //     · v1.10.0：过程步若还认领到了本段的折叠卡片，正文在上、卡片紧随其下，
      //       于是「两次正文之间的工具」被就近收在它前面那段正文之后；
      //     · 图片块走产品给的 renderMessageImages，未知块走官方 JsonBlock 兜底。
      //   一块都不许吞：插件不认识的块宁可原样摆出来，也不能让它消失。
      function AssistantTextOnly(props) {
        // 正文与卡片各有各的失败面：先把正文渲染出来并隔离它的异常，
        //   后面的认领/卡片再单独算 —— 卡片算错不该把回复内容一起拖走。
        var inner = null;
        try { inner = renderAssistantStep(props); } catch (e) {
          logPrismError('AssistantStep', e);
          // 降级：把这一步的正文原样以纯文本摆出来，宁可没有格式，不许整块消失
          try {
            const blocks = props && props.node && props.node.data && props.node.data.blocks;
            const text = (Array.isArray(blocks) ? blocks : [])
              .filter(function (b) { return b && b.kind === 'text' && typeof b.text === 'string'; })
              .map(function (b) { return b.text; }).join('\n\n');
            inner = text === '' ? null : React.createElement('pre', { className: 'prism-doc-pre' }, text);
          } catch (e2) { inner = null; }
        }
        const text = inner === null ? null : React.createElement(PrismNodeBoundary, null, inner);
        var card = null;
        try { card = composeSpanCard(props, text); } catch (e) {
          // 卡片的事故只降级成「没有卡片」：工具那一格若也认领不了，它们会退成
          //   单行（renderStandaloneTool），内容不会消失。
          logPrismError('span card', e);
        }
        if (card) return card;
        return text;
      }
      function renderAssistantStep(props) {
        const node = props.node;
        // hook 必须在**任何早退之前**无条件调用：data 在一次渲染里有、下一次没有，
        //   就会变成「本次渲染比上次多/少一个 hook」，React 直接报错，槽位随后把
        //   插件从这一格摘掉（assistant 行整片消失）。次序稳定比省一次调用重要。
        const thoughtOpen = useAnswerThoughtOpen(props.sessionId, node && node.key);
        const data = node && node.data ? node.data : null;
        if (!data) return null;
        const blocks = Array.isArray(data.blocks) ? data.blocks : [];
        const P = props.primitives || primitives;
        const labels = docLabels();
        const answerStep = answerStepOf(props, node);
        const isAnswer = answerStep !== null && typeof data.step === 'number' && data.step === answerStep;
        const streaming = data.status === 'running';
        const out = [];
        for (var i = 0; i < blocks.length; i++) {
          const b = blocks[i];
          if (!b) continue;
          // 工具调用头：不在这里渲染（工具行走 tool-call 那一格，避免同一件事画两遍）
          if (b.kind === 'tool-call') continue;
          if (b.kind === 'reasoning') {
            // 答案步的思考：**一行「思考」+ 箭头，默认收起**。整段平铺过一次，
            //   长推理会在正文之前糊一大片（交接文档自己列过的硬红线：推理原文
            //   要么不显示，要显示就得在展开里并明确标注）。
            if (isAnswer && typeof b.text === 'string' && b.text.trim() !== '') {
              const word = thoughtOpen ? t('collapseThought') : t('expandThought');
              out.push(React.createElement('div', { key: 'r' + i, className: 'prism-answer-thought' },
                React.createElement('div', Object.assign(
                  clickableProps('prism-answer-thought-head', function () {
                    toggleAnswerThought(props.sessionId, node.key, thoughtOpen);
                  }, thoughtOpen),
                  { title: word, 'aria-label': t('thinkingLabel') + ' · ' + word },
                ),
                  React.createElement('span', { className: 'prism-answer-thought-caret', 'aria-hidden': true }, thoughtOpen ? '▾' : '▸'),
                  React.createElement('span', { className: 'prism-answer-thought-label' }, t('thinkingLabel')),
                ),
                thoughtOpen
                  ? React.createElement('div', { className: 'prism-answer-thought-text' }, b.text)
                  : null,
              ));
            }
            continue;
          }
          if (b.kind === 'text') {
            if (typeof b.text === 'string' && b.text.trim() !== '') {
              const owner = turnTailOwnerOf(props, node, data);
              let mentions;
              try {
                if (owner && typeof props.fileMentions === 'function') mentions = props.fileMentions(owner);
              } catch (e) { mentions = undefined; }
              out.push(P && P.MarkdownText
                ? React.createElement(P.MarkdownText, {
                  key: 't' + i,
                  text: b.text,
                  streaming: streaming,
                  labels: labels,
                  fileMentions: mentions,
                  pathImages: pathImagesOf(),
                })
                : React.createElement('pre', { key: 't' + i, className: 'prism-doc-pre' }, b.text));
            }
            continue;
          }
          if (b.kind === 'image') {
            // 连续图片合成一组：与产品同一条路（用产品给的图片渲染闭包）
            const group = [b];
            while (i + 1 < blocks.length && blocks[i + 1] && blocks[i + 1].kind === 'image') {
              i += 1;
              group.push(blocks[i]);
            }
            const images = group.map(function (g) { return { attachment: g.attachment }; });
            out.push(typeof props.renderMessageImages === 'function'
              ? React.createElement('div', { key: 'i' + i, className: 'prism-images' },
                props.renderMessageImages({ images: images, align: 'start' }))
              // 拿不到产品的图片渲染器时也不能吞：留一张说明位，主人一眼能看出这里本该有图
              : React.createElement('div', { key: 'i' + i, className: 'prism-images-missing' }, t('imageBlockNote')));
            continue;
          }
          // 未知块：官方 JsonBlock 原样摆出来；取不到就退化为 JSON 文本
          const payload = b.block !== undefined ? b.block : b;
          out.push(P && P.JsonBlock
            ? React.createElement(P.JsonBlock, {
              key: 'o' + i,
              label: String(b.kind),
              payload: payload,
              truncatedLabel: function (total) { return '… (' + total + ')'; },
            })
            : React.createElement('pre', { key: 'o' + i, className: 'prism-doc-pre' }, safeJsonText(payload)));
        }
        if (data.status === 'interrupted') {
          // 产品在中断的助手消息尾部会写「已停止」；这一格由插件接管，就得自己写，
          //   否则主人看到一个戛然而止、没有任何标记的答复。放在空判之前 ——
          //   中断且没有可见正文的那一步，标记就是它唯一的内容。
          out.push(React.createElement('div', { key: 'stopped', className: 'prism-stopped' }, t('stoppedNote')));
        }
        // 没有任何可见块（例如只带工具头）：返回 null，不留带外边距的空壳
        if (out.length === 0) return null;
        return React.createElement('div', { className: 'prism-assistant-text' }, out);
      }

      // ---- 一个分段（step）：段头 + 段内条目 ----
      //   段头沿用官方「思考完成」的说法，**不带计数**（计数已经在它所属那条
      //   折叠行上，段头再报一次只是噪音）；状态给 ✓ / ✕ / ● / ⚠。
      //   收起时只渲染段头（一行），展开才生成段体：先「思考」标签 + 该段
      //   思考原文（明标为思考 —— 它是模型内部推理，不是给用户的答复），
      //   再该段的工具行（手风琴）/ 重试汇总行。
      //   段内条目按档位两种语言：白话走 ToolCard，整洁走 NativeToolRow。
      function GroupSegment(props) {
        const mode = props.mode;
        const seg = props.seg;
        const index = props.index;
        const hasThought = !!seg.thoughtText;
        // 段头只控制「思考原文」这一块；工具行（与重试行）是这一段的**工作日志**，
        //   常驻在段内同一层 —— 长思考不该把「刚才干了什么」埋到底下。
        const open = useSegmentOpen(props.sessionId, props.turn, props.groupId, index, props.autoOpen && hasThought);
        const status = segmentStatus(seg);
        const seenRowKeys = {};
        // 段头说实话：这一步有思考就写「思考完成」，只是调了工具就写「步骤完成」。
        //   同一个词用在两种含义上是之前那版含糊的地方（点开却什么都没有）。
        const headText = hasThought ? t('thinkingDone') : t('stepDone');
        const toggle = function () { toggleSegment(props.sessionId, props.turn, props.groupId, index, open); };
        const thoughtSwitchWord = open ? t('collapseThought') : t('expandThought');

        const headProps = hasThought
          ? clickableProps('prism-seg-head', toggle, open)
          : { className: 'prism-seg-head flat' };
        headProps.title = hasThought ? thoughtSwitchWord : headText;
        headProps['aria-label'] = hasThought
          ? headText + colon() + status.word + ' · ' + thoughtSwitchWord
          : headText + colon() + status.word;
        const head = React.createElement('div', headProps,
          React.createElement('span', { className: 'prism-seg-caret', 'aria-hidden': true }, hasThought ? (open ? '▾' : '▸') : '·'),
          React.createElement('span', { className: 'prism-seg-title' }, headText),
          React.createElement('span', { className: 'prism-seg-status ' + status.cls, 'aria-hidden': true }, status.icon),
        );

        // 展开的只有思考原文（明标「思考」：它是模型内部推理，不是给用户的答复）
        const thought = (hasThought && open) ? React.createElement('div', { className: 'prism-seg-thought' },
          React.createElement('span', { className: 'prism-seg-thought-label' }, t('thinkingLabel')),
          React.createElement('div', { className: 'prism-seg-thought-text' }, seg.thoughtText),
        ) : null;

        // 工作日志：该段的工具行（手风琴）/ 重试汇总行，与段头同一层
        const rows = activitiesOf(seg).map(function (a) {
          if (seenRowKeys[a.node.key]) return null;      // 同一节点只摆一次
          seenRowKeys[a.node.key] = true;
          if (a.kind === 'retry') {
            return React.createElement(RetryRow, { key: a.node.key, node: a.node, mode: mode });
          }
          var root = a.node.data ? a.node.data.root : null;
          if (mode === 'medium') {
            return React.createElement(NativeToolRow, {
              key: a.node.key,
              primitives: primitives,
              block: root || {},
              toolName: rootName(root),
              sessionId: props.sessionId,
              nodeKey: a.node.key,
            });
          }
          return React.createElement(ToolCard, {
            key: a.node.key,
            block: root || {},
            toolName: rootName(root),
            sessionId: props.sessionId,
            nodeKey: a.node.key,
          });
        });
        const rowList = rows.length > 0
          ? React.createElement('div', { className: 'prism-seg-rows' }, rows)
          : null;
        return React.createElement('div', { className: 'prism-seg' }, head, thought, rowList);
      }

      // ---- 折叠组节点（仅折叠档注册，替换产品 tool-call 树；原生档零注册）----
      //   收起态：**一条折叠行**（图标 + 「N 个工具 · M 次思考」 + 状态 + 展开）。
      //     v1.10.0 起一轮有多条这样的行（每条＝两次正文之间的那一段）。
      //   展开态：标题行 + 段列表；段默认收起，只有一行「思考完成」。
      //   渲染权：认领制（useGroupClaim）—— **每一段**只由段内一条节点渲染它那条行，
      //     其余节点返回 null；让位的座位由 syncFoldedSeats 收掉行距。
      //   三种情况同一套规则：运行中、已完成、刷新重放。
      //
      //   hooks 顺序：组件体里的 hook 调用必须无条件、定序，所以「我不在窗口里」
      //   这类早退一律放在所有 hook 之后（认领时用 claimable=false 拒绝认领）。
      // 工具组节点 = 边界 + 实体。异常**不在实体里就地吞掉**：就地吞等于让钩子序列
      //   半途而废，下一次渲染 React 的数就对不上。让异常走到边界，React 会把这棵
      //   子树整体卸下、只画降级行，钩子账本随之作废得干干净净。
      function ToolGroupNode(props) {
        return React.createElement(PrismNodeBoundary,
          { label: 'ToolGroupNode', fallback: React.createElement(DegradedRowNode, props) },
          React.createElement(ToolGroupBody, props));
      }
      function ToolGroupBody(props) { return renderToolGroup(props); }
      // 降级行：只有真崩了才渲染（无 hook、纯函数，随时画得出来）
      function DegradedRowNode(props) { return degradedRow(props); }
      // 没有任何 hook 的降级行：工具行退化为「工具名 + 状态」，重试行退化为一行汇总。
      function degradedRow(props) {
        const node = props && props.node;
        if (!node) return null;
        if (node.kind === 'model-retry') {
          return React.createElement('div', { className: 'prism-card prism-simple prism-retry' },
            React.createElement('span', { className: 'prism-emoji' }, '🔁'),
            React.createElement('span', { className: 'prism-plain' }, t('retrySummary') + retryCount(node) + t('retriesUnit')),
          );
        }
        const root = node.data ? node.data.root : null;
        if (!root) return null;
        return React.createElement('div', { className: 'prism-card prism-simple' },
          React.createElement('span', { className: 'prism-emoji' }, toolIcon(rootName(root))),
          React.createElement('span', { className: 'prism-plain' }, rootName(root) || 'tool'),
        );
      }
      function renderToolGroup(props) {
        const node = props.node;
        // framework 标准 hooks（session 作用域槽组件由 props 注入，不能裸用）：
        //   新版 DSH 用 useChat 供给 Chat 视图快照，旧版从 useSession 的 .chat 取；
        //   两者签名一致（selector + 可选比较器），按可用者取用。
        const useChatProp = props.useChat || props.useSession;
        const turn = turnOf(node.location);
        // 折叠机制是否可用：拿得到会话快照、也拿得到自己所属的 turn。
        //   不可用时不是「不渲染」，而是退化成单行 —— 详见下面的 canFold 分支。
        const canFold = typeof useChatProp === 'function' && turn !== null;
        // hook 次序必须恒定：没有 chat hook 时用一个同签名的空 hook 顶上
        //   （同一实例上这个分支不会来回变，props 的供给方式是装配期定的）。
        const chatHook = canFold ? useChatProp : function () { return EMPTY_NODES; };
        const mode = useMode();
        const sessionId = props.sessionId || '';
        const turnNodes = chatHook(
          function (sn) { return turn === null ? EMPTY_NODES : collectTurnNodes(sn, turn); },
          sameTurnView,
        );
        const answerStep = answerStepOf(props, node);
        // 产品自己的过程区正在折叠这一轮（默认 compact 档、轮次闭合、历史完整）：
        //   它把所有过程成员座位打成 hidden，插件那条折叠行就长在这些座位里 ——
        //   插件不该跟它抢同一行（抢了就是两行叠一起，而且插件的行先被藏掉）。
        const tp = props.turnProcess;
        const productFolding = !!(tp && tp.foldable === true && tp.open !== true);
        const productExpanded = !!(tp && tp.foldable === true && tp.open === true);
        // 分区（v1.10.0）：一轮按「有可见输出的步」切成若干组，本节点只负责
        //   自己所在那一段的那条折叠行。组内仍是「按 step 分段」的老口径。
        const parts = computeGroups(turnNodes, node, answerStep);
        const span = parts.mySpanIndex >= 0 ? parts.groups[parts.mySpanIndex] : null;
        const runtime = span ? spanRuntimeOf(span) : null;
        // hook 区（次序固定，全部无条件调用）：节拍 → 认领 → 面板开合。
        //   useSpanOpen 必须在任何早退之前调用（它内部是 useState + 订阅），
        //   否则「有段 / 无段」一变就是 hook 数变动 → React 抛错 → 槽位摘牌。
        const nowMs = useTick(!!(runtime && runtime.running));
        // 认领：只有「自己在窗口里 + 自己落在这一段内 + 本段确实有可折的内容」
        //   的节点能认领。少任何一个条件都会出现「认领者隐身」：占着渲染权
        //   却渲染不出折叠行，那一段的行就此消失。
        const presentKeys = [];
        for (var pk = 0; pk < turnNodes.length; pk++) presentKeys.push(turnNodes[pk].key);
        const claimable = !productFolding && !productExpanded
          && parts.inWindow && !!span && span.foldedCount > 0;
        const iAmGroupOwner = useGroupClaim(sessionId, turn, claimable, presentKeys, node.key, span ? span.id : null);
        const spanOpen = useSpanOpen(sessionId, turn, span ? span.id : null, !!(runtime && runtime.running));
        // 排错面（只读）：__PRISM_DEBUG__ = true 时打一行体检，覆盖「窗口里有什么、
        //   步号是多少、分成几组、我是不是认领者」。逐节点全量转储在契约核对完之后
        //   删除 —— 那一版结论已经落在上面的注释与报告里，留着只是又一份要维护的输出。
        if (typeof window !== 'undefined' && window.__PRISM_DEBUG__) {
          try {
            console.log('[prism] ' + JSON.stringify({
              turn: turn,
              node: node.key + '/' + node.kind,
              answerStep: answerStep,
              boundary: parts.boundary,
              myIndex: parts.myIndex,
              mySpan: parts.mySpanIndex,
              canFold: canFold,
              owner: iAmGroupOwner,
              window: (turnNodes || []).map(function (n) { return n.kind; }),
              steps: (turnNodes || []).map(function (n) { return segIdOf(n); }),
              spans: parts.groups.map(function (g) {
                return { id: g.id, head: g.head.key, nodes: g.nodes.length, tools: g.tools.length, folded: g.foldedCount };
              }),
              segments: span ? span.segments.map(function (sg) { return { step: sg.step, tools: sg.tools.length, retries: sg.retries.length, thoughts: sg.thoughts }; }) : [],
              totals: span ? { tools: span.tools.length, retries: span.retries.length, thoughts: span.thoughts, folded: span.foldedCount } : null,
            }));
          } catch (e) { console.log('[prism] dump failed: ' + (e && e.message)); }
        }

        // 让位的座位不占行距：与助手格共用同一个 effect（见 useFoldSeatsEffect
        //   的注释）。本段只管自己那批座位（foldedKeys）；allowed 按整轮给。
        useFoldSeatsEffect(iAmGroupOwner, turn, span ? span.foldedKeys : null, turnNodes, answerStep);

        // 折叠机制本身不可用（拿不到 turn、拿不到会话快照）：**不能消失**。
        //   这时没有别人替它渲染这一格，插件自己得把这一条工具调用摆出来
        //   （等于退化成原生档的单行），宁可不成组，也不能让工具凭空不见。
        if (!canFold) return renderStandaloneTool(props, mode);
        // 窗口里没有我这个节点：什么都不渲染。渲染空组会在时间线上留下一条
        //   无内容的占位（外观就是空档），这是之前「一空一空」的来源之一；
        //   而它在折叠范围内的那一份，已经由认领者的面板带着了。
        if (!parts.inWindow) return null;

        // 现场留痕（只读，见 noteTurnSnap）：记录「工具这一格当时看到什么」。
        //   主人报的「一轮回复完有时呈现原生效果」若再出现，这几个字段就能分辨
        //   是「段没成」（span=false）、「认领失败」（claimOK=false）、还是
        //   「产品自己在折这一轮」（foldable=true 且 open=false）。
        noteTurnSnap(turn, 'tool', {
          nodes: turnNodes.length,
          kinds: turnNodes.map(function (x) { return x.kind; }).join(','),
          ans: answerStep === null || answerStep === undefined ? null : answerStep,
          inWin: !!parts.inWindow,
          span: !!span,
          folded: span ? span.foldedCount : 0,
          turnStatus: (turnNodes[0] && turnNodes[0].location && turnNodes[0].location.turn ? turnNodes[0].location.turn.status : null),
          nodeStatus: node.data ? node.data.status : null,
          claimOK: !!iAmGroupOwner,
          foldable: productFolding,
          open: productExpanded,
        }, sessionId);
        // 产品自己在折叠这一轮：让位。未展开时那一片本来就被产品藏着，插件
        //   渲染什么都看不见（还白占一次认领）；用户展开后改为逐行给，
        //   保证展开出来的过程里**看得见**内容。
        if (productFolding) return null;
        if (productExpanded) return renderStandaloneTool(props, mode);
        // 顺序要紧：**先判「不在任何一段里」**，再判「没什么可折的」。反过来的
        //   话，答案步之后那些工具（没有段接手）会撞上「不渲染」而整片消失 ——
        //   它们得自己一行（renderStandaloneTool）。
        if (!span) return renderStandaloneTool(props, mode);
        // 本段没有可折的东西：不渲染，也不认领。
        if (span.foldedCount === 0) return null;
        if (!iAmGroupOwner) return null;
        // 认领者画这条折叠行（收起一行 / 展开面板），与助手格共用同一套画法。
        return renderSpanCard({
          group: span,
          mode: mode,
          sessionId: sessionId,
          turn: turn,
          isOpen: spanOpen,
          running: runtime.running,
          autoOpen: runtime.running,
          autoSegmentIndex: runtime.autoSegmentIndex,
          nowMs: nowMs,
        });
      }

      // 答案步及其之后的工具节点：不折叠也不能消失 —— 照档位渲染独立一行。
      //   （答案步通常没有工具调用；真有时也不能因为归组把它吞掉。）
      function renderStandaloneTool(props, mode) {
        const node = props.node;
        // 重试节点也走这里：它没有工具根，但仍要有自己的一行（换了别的分支就是空白）
        if (node && node.kind === 'model-retry') {
          return React.createElement(RetryRow, { node: node, mode: mode });
        }
        const root = node && node.data ? node.data.root : null;
        if (!root) return null;
        if (mode === 'medium') {
          return React.createElement(NativeToolRow, {
            primitives: primitives,
            block: root,
            toolName: rootName(root),
            sessionId: props.sessionId,
            nodeKey: node.key,
          });
        }
        return React.createElement(ToolCard, {
          block: root, toolName: rootName(root), sessionId: props.sessionId, nodeKey: node.key,
        });
      }

      // ---- 侧栏脚区入口（官方 sidebar.footer.action 槽，与「设置」同排、在其上方）----
      //   rail（窄栏 56px）与 wide（展开）都用圆形标记按钮；菜单用 fixed 定位，
      //   从按钮旁弹出，避免被侧栏容器裁剪。
      function tierMark(m) {
        if (lang === 'en') return m === 'simple' ? 'P' : (m === 'medium' ? 'T' : 'N');
        return m === 'simple' ? '白' : (m === 'medium' ? '整' : '原');
      }

      function PrismTierEntry(props) {
        const mode = useMode();
        const hideComplex = useHideComplex();
        const open = useMenuOpen();
        const wide = !!(props && props.wide);
        const btnRef = React.useRef(null);
        const [anchor, setAnchor] = React.useState(null);
        React.useEffect(function () {
          if (!open) { setAnchor(null); return; }
          function measure() {
            const el = btnRef.current;
            if (!el) return;
            const r = el.getBoundingClientRect();
            const MENU_W = 220, GAP = 8, EDGE = 8;
            const left = Math.min(r.right + GAP, Math.max(EDGE, window.innerWidth - MENU_W - EDGE));
            setAnchor({ left: left, bottom: Math.max(EDGE, window.innerHeight - r.bottom) });
          }
          measure();
          window.addEventListener('resize', measure);
          return function () { window.removeEventListener('resize', measure); };
        }, [open]);
        const cur = mode === 'simple' ? t('simple') : (mode === 'medium' ? t('medium') : t('native'));
        const items = [
          { key: 'native', label: t('native'), note: t('nativeNote') },
          { key: 'medium', label: t('medium'), note: t('mediumNote') },
          { key: 'simple', label: t('simple'), note: t('simpleNote') },
        ];
        const entryLabel = t('fabTitle') + cur + t('fabTitleEnd');
        // 入口的两种形态（2026-09-19 主人点名：这颗「原/整/白」的按钮要与周围按钮协调）：
        // 入口形态（主人 2026-09-19 两次定调后定稿）：**只有一个字标** —— 原 / 整 / 白。
        //   中途试过把它铺成「整行条」（标签 + 当前档名），真机上把同排邻居的按钮顶出
        //   了边界，主人当场否掉。这条不回头：宽窄两档都是圆点，只差尺寸（28 / 36），
        //   与同槽其它插件的按钮同规格。
        return React.createElement('span', { className: 'prism-entry-wrap' },
          React.createElement('button', {
            type: 'button',
            ref: btnRef,
            className: 'prism-entry' + (wide ? ' wide' : ' rail') + (open ? ' open' : ''),
            title: entryLabel,
            'aria-label': entryLabel,
            'aria-haspopup': 'menu',
            'aria-expanded': open ? 'true' : 'false',
            onClick: toggleMenu,
          },
            React.createElement('span', { className: 'prism-entry-mark', 'aria-hidden': true }, tierMark(mode)),
          ),
          open ? React.createElement('div', { className: 'prism-menu-backdrop', onClick: closeMenu }) : null,
          open && anchor ? React.createElement('div', {
            className: 'prism-menu',
            style: { left: anchor.left + 'px', bottom: anchor.bottom + 'px' },
            onClick: function (e) { e.stopPropagation(); },
          },
            React.createElement('div', { className: 'prism-menu-title' },
              t('interfaceMode') + ' · v' + PRISM_VERSION + ' · ' + diagSummary()),
            React.createElement('div', { className: 'prism-menu-title prism-menu-counters' }, diagCounters()),
            items.map(function (it) {
              return React.createElement('button', {
                type: 'button',
                className: 'prism-menu-item' + (mode === it.key ? ' on' : ''),
                key: it.key,
                onClick: function () { setMode(it.key); closeMenu(); },
              },
                React.createElement('span', { className: 'prism-menu-check' }, mode === it.key ? '✓' : ''),
                React.createElement('span', { className: 'prism-menu-label' }, it.label),
                React.createElement('span', { className: 'prism-menu-note' }, it.note),
              );
            }),
            React.createElement('div', { className: 'prism-menu-divider' }),
            React.createElement('div', { className: 'prism-menu-title' }, t('simpleOptions')),
            React.createElement('button', {
              type: 'button',
              className: 'prism-menu-item',
              disabled: mode !== 'simple',
              onClick: function () { setHideComplex(!hideComplex); },
            },
              React.createElement('span', { className: 'prism-menu-check' }),
              React.createElement('span', { className: 'prism-menu-label' }, t('hideComplex')),
              React.createElement('span', { className: 'prism-switch' + (hideComplex ? ' on' : '') }),
            ),
            React.createElement('div', { className: 'prism-menu-hint' },
              mode === 'simple'
                ? (hideComplex ? t('hintSimpleOn') : t('hintSimpleOff'))
                : (mode === 'medium' ? t('hintMedium') : t('hintNative')),
            ),
          ) : null,
        );
      }

      // ---- 样式 ----
      const css = [
        // —— 侧栏脚区入口：一个圆点 + 一个「原 / 整 / 白」字标 ——
        // 主人 2026-09-19 两次定调：一个字就够；曾铺成「整行条」，真机上把同排邻居的
        //   按钮顶出了边界，当即退回。flex:none 是这次唯一留下的加固：入口不参与伸缩，
        //   既不会被邻居挤扁，也不去抢邻居的宽度。
        '.prism-entry-wrap { display:inline-flex; flex:none; }',
        '.prism-entry { flex:none; display:inline-flex; align-items:center; justify-content:center; width:28px; height:28px; padding:0; border:none; border-radius:50%; background:transparent; cursor:pointer; color:var(--dsw-alias-label-secondary); transition:background-color 120ms ease, color 120ms ease; }',
        '.prism-entry:hover, .prism-entry.open { background:var(--dsw-alias-interactive-bg-hover); color:var(--dsw-alias-label-primary); }',
        '.prism-entry:focus-visible { outline:2px solid var(--dsw-alias-state-business-primary); outline-offset:1px; }',
        '.prism-entry.rail { width:36px; height:36px; color:var(--dsw-alias-label-primary); }',
        '.prism-entry-mark { display:inline-flex; align-items:center; justify-content:center; font-size:13px; font-weight:600; line-height:1; user-select:none; }',
        '.prism-entry.rail .prism-entry-mark { font-size:16px; }',
        '.prism-menu-backdrop { position:fixed; inset:0; pointer-events:auto; }',
        '.prism-menu { position:fixed; z-index:1002; min-width:220px; background:var(--dsw-alias-bg-overlay); border:1px solid var(--dsw-alias-border-l1); border-radius:12px; padding:8px; pointer-events:auto; box-shadow:var(--dsw-shadow-lv2); }',
        '.prism-menu-title { font-size:12px; color:var(--dsw-alias-label-secondary); margin-bottom:4px; padding:2px 6px; }',
        '.prism-menu-counters { font-variant-numeric:tabular-nums; color:var(--dsw-alias-label-tertiary); margin-bottom:6px; }',
        '.prism-menu-item { display:flex; align-items:center; gap:8px; width:100%; box-sizing:border-box; padding:7px 8px; border:none; background:transparent; cursor:pointer; border-radius:8px; text-align:left; }',
        '.prism-menu-item:hover { background:var(--dsw-alias-bg-layer-2); }',
        '.prism-menu-item.on { background:var(--dsw-alias-bg-layer-2); }',
        '.prism-menu-item:disabled { opacity:.55; cursor:default; }',
        '.prism-menu-check { width:14px; flex:0 0 auto; font-size:12px; color:var(--dsw-alias-brand-primary); }',
        '.prism-menu-label { font-size:13px; font-weight:600; color:var(--dsw-alias-label-primary); }',
        '.prism-menu-note { font-size:12px; color:var(--dsw-alias-label-secondary); }',
        '.prism-menu-hint { font-size:11px; color:var(--dsw-alias-label-secondary); padding:4px 8px 2px; line-height:1.5; }',
        '.prism-menu-divider { height:1px; background:var(--dsw-alias-border-l1); margin:6px 4px; }',
        '.prism-switch { position:relative; width:26px; height:15px; flex:0 0 auto; margin-left:auto; border-radius:999px; border:1px solid var(--dsw-alias-border-l1); background:var(--dsw-alias-bg-layer-2); transition:background .15s, border-color .15s; }',
        '.prism-switch::after { content:\'\'; position:absolute; top:2px; left:2px; width:9px; height:9px; border-radius:50%; background:var(--dsw-alias-label-secondary); transition:left .15s; }',
        '.prism-switch.on { background:var(--dsw-alias-brand-primary); border-color:var(--dsw-alias-brand-primary); }',
        '.prism-switch.on::after { left:13px; background:var(--dsw-alias-bg-overlay); }',
        '.prism-card { border:1px solid var(--dsw-alias-border-l1); border-radius:8px; padding:10px 12px; margin:6px 0; background:var(--dsw-alias-bg-layer-1); font-size:13px; }',
        // —— 简化档时间线行 ——
        '.prism-card.prism-simple { display:flex; flex-wrap:wrap; align-items:center; gap:8px; font-size:14px; border-radius:12px; padding:6px 10px; margin:6px 0; cursor:pointer; }',
        '.prism-emoji { font-size:14px; line-height:1; flex:0 0 auto; }',
        '.prism-plain { color:var(--dsw-alias-label-primary); flex:1 1 auto; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }',
        '.prism-ico { font-size:11px; line-height:1; font-weight:700; flex:0 0 auto; }',
        '.prism-ico.ok { color:var(--dsw-alias-state-success-primary); }',
        '.prism-ico.err { color:var(--dsw-alias-state-error-primary); }',
        '.prism-ico.running { color:var(--dsw-alias-state-warn-primary); }',
        '.prism-ico.mixed { color:var(--dsw-alias-state-warn-primary); }',
        '.prism-fold { color:var(--dsw-alias-label-secondary); font-size:12px; flex:0 0 auto; cursor:pointer; white-space:nowrap; }',
        '.prism-fold:hover { color:var(--dsw-alias-label-primary); }',
        // —— 详情面板（交付文档）——
        '.prism-detail { flex-basis:100%; max-height:420px; overflow:auto; margin-top:4px; background:var(--dsw-alias-bg-layer-2); border-radius:8px; padding:10px 12px; }',
        '.prism-doc-name { font-family:ui-monospace,SFMono-Regular,Consolas,monospace; font-size:11px; color:var(--dsw-alias-label-secondary); }',
        '.prism-args { margin-top:4px; }',
        '.prism-args-line { display:flex; gap:6px; font-size:12px; line-height:1.6; }',
        '.prism-args-key { flex:0 0 auto; color:var(--dsw-alias-label-secondary); font-family:ui-monospace,SFMono-Regular,Consolas,monospace; }',
        '.prism-args-val { flex:1 1 auto; min-width:0; color:var(--dsw-alias-label-primary); font-family:ui-monospace,SFMono-Regular,Consolas,monospace; white-space:pre-wrap; word-break:break-word; }',
        '.prism-args-toggle { margin-left:6px; font-size:11px; color:var(--dsw-alias-label-secondary); cursor:pointer; white-space:nowrap; }',
        '.prism-args-toggle:hover { color:var(--dsw-alias-label-primary); }',
        '.prism-doc-label { font-size:12px; font-weight:600; color:var(--dsw-alias-label-secondary); margin-top:8px; }',
        // —— 折叠组（收拢行 + 展开面板）——
        //  收拢行的类名只有 .prism-group-row 一项：一行的判据就是它本身
        //  （回归桩也按这个类名数「这一轮渲染了几条收拢行」）。
        '.prism-group-row { display:flex; align-items:center; gap:8px; padding:8px 12px; margin:0; border:1px solid var(--dsw-alias-border-l1); border-radius:12px; background:var(--dsw-alias-bg-layer-1); cursor:pointer; box-shadow:var(--dsw-shadow-lv2); }',
        // 面板紧贴其所在行，不让行距在面板内部再叠一层
        '.prism-group-panel > .prism-group-head { margin-top:0; }',
        '.prism-group-row:hover { background:var(--dsw-alias-bg-layer-2); }',
        '.prism-group-emoji { font-size:14px; line-height:1; flex:0 0 auto; }',
        '.prism-group-title { color:var(--dsw-alias-label-primary); font-weight:600; flex:1 1 auto; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }',
        '.prism-group-status { font-size:11px; line-height:1; font-weight:700; flex:0 0 auto; }',
        '.prism-group-status.ok { color:var(--dsw-alias-state-success-primary); }',
        '.prism-group-status.err { color:var(--dsw-alias-state-error-primary); }',
        '.prism-group-status.running { color:var(--dsw-alias-state-warn-primary); }',
        '.prism-group-status.mixed { color:var(--dsw-alias-state-warn-primary); }',
        '.prism-group-caret { color:var(--dsw-alias-label-secondary); font-size:12px; flex:0 0 auto; white-space:nowrap; }',
        '.prism-group-panel { border:1px solid var(--dsw-alias-border-l1); border-radius:12px; background:var(--dsw-alias-bg-layer-1); padding:8px 10px; margin:0; box-shadow:var(--dsw-shadow-lv2); }',
        '.prism-group-head { display:flex; align-items:center; gap:8px; padding:4px 2px 6px; cursor:pointer; user-select:none; }',
        '.prism-group-list { display:flex; flex-direction:column; }',
        '.prism-group-note { font-size:11px; color:var(--dsw-alias-label-secondary); padding:6px 4px 2px; line-height:1.5; }',
        // —— 分段（step）：段头 + 段内条目 ——
        // 一段＝段头 + 思考原文（可折叠）+ 该段的工作日志（常驻）。
        //   归属靠**整段左侧那条细线**表达：段头与工具行左对齐同一层，
        //   不再用「段体缩进」把工作日志压到思考底下。
        '.prism-seg { display:flex; flex-direction:column; margin:4px 0; padding-left:8px; border-left:2px solid var(--dsw-alias-border-l1); }',
        '.prism-seg-head { display:flex; align-items:center; gap:6px; padding:4px 2px; cursor:pointer; user-select:none; border-radius:6px; }',
        // 没有思考原文的段：段头不是开关，游标与悬停都不该装成能点
        '.prism-seg-head.flat { cursor:default; }',
        '.prism-seg-head.flat:hover { background:transparent; }',
        '.prism-seg-rows { display:flex; flex-direction:column; }',
        '.prism-seg-head:hover { background:var(--dsw-alias-bg-layer-2); }',
        '.prism-seg-head:focus-visible { outline:2px solid var(--dsw-alias-state-business-primary); outline-offset:1px; }',
        '.prism-seg-caret { width:12px; flex:0 0 auto; font-size:11px; color:var(--dsw-alias-label-secondary); }',
        '.prism-seg-title { font-size:12px; color:var(--dsw-alias-label-secondary); flex:0 0 auto; }',
        '.prism-seg-status { font-size:11px; line-height:1; font-weight:700; flex:0 0 auto; }',
        '.prism-seg-status.ok { color:var(--dsw-alias-state-success-primary); }',
        '.prism-seg-status.err { color:var(--dsw-alias-state-error-primary); }',
        '.prism-seg-status.running { color:var(--dsw-alias-state-warn-primary); }',
        '.prism-seg-status.mixed { color:var(--dsw-alias-state-warn-primary); }',

        '.prism-assistant-text { margin:4px 0; }',
        // 正文 + 本段折叠卡片的容器（v1.10.0）：正文在上、卡片紧随其下。
        //   卡片只在「本段确有可折内容」时才有节点，容器此时才生成，所以
        //   空容器不会存在，也不用给 :empty 兜高度。
        '.prism-assistant-block { display:flex; flex-direction:column; gap:8px; margin:4px 0; }',
        '.prism-assistant-block > .prism-assistant-text { margin:0; }',
        '.prism-stopped { font-size:12px; color:var(--dsw-alias-label-secondary); margin-top:4px; }',
        // 答案步的思考：默认只有一行「思考」，点开才铺原文（与面板里的段头同一套语言）
        '.prism-answer-thought { margin:4px 0; }',
        '.prism-answer-thought-head { display:flex; align-items:center; gap:6px; padding:4px 2px; cursor:pointer; user-select:none; border-radius:6px; }',
        '.prism-answer-thought-head:hover { background:var(--dsw-alias-bg-layer-2); }',
        '.prism-answer-thought-caret { width:12px; flex:0 0 auto; font-size:11px; color:var(--dsw-alias-label-secondary); }',
        '.prism-answer-thought-label { font-size:12px; color:var(--dsw-alias-label-secondary); }',
        '.prism-answer-thought-text { margin:2px 0 6px; padding:8px 10px; background:var(--dsw-alias-bg-layer-2); border-radius:6px; font-size:12px; line-height:1.6; color:var(--dsw-alias-label-secondary); white-space:pre-wrap; word-break:break-word; }',
        '.prism-images { margin:6px 0; }',
        '.prism-images-missing { font-size:12px; color:var(--dsw-alias-label-secondary); margin:6px 0; }',
        // 段内展开的思考全文
        '.prism-seg-thought { margin:2px 0 6px; padding:8px 10px; background:var(--dsw-alias-bg-layer-2); border-radius:6px; }',
        '.prism-seg-thought-label { display:block; font-size:11px; color:var(--dsw-alias-label-secondary); margin-bottom:4px; }',
        // 不设 max-height / overflow：设了就必然在长思考时留下盒内空白与内滚动条，
        //   看起来像「内容被收走后留下空格」。整页滚动即可。
        '.prism-seg-thought-text { font-size:12px; line-height:1.6; color:var(--dsw-alias-label-secondary); white-space:pre-wrap; word-break:break-word; }',
        '.prism-seg-rows .prism-card { margin:3px 0; }',
        // —— 行耗时 ——
        '.prism-dur { font-size:11px; flex:0 0 auto; font-variant-numeric:tabular-nums; color:var(--dsw-alias-label-tertiary); }',
        '.prism-dur.err { color:var(--dsw-alias-state-error-primary); }',
        '.prism-dur.running { color:var(--dsw-alias-state-warn-primary); }',
        '.prism-dur.mixed { color:var(--dsw-alias-state-warn-primary); }',
        // —— 重试汇总行（不重画官方重试行，只汇总）——
        '.prism-card.prism-retry { cursor:default; }',
        // —— 中级档：原版行（官方 DisclosureRow / StateDot + 产品同款度量）——
        // 度量值照抄 ui-tool 的 ToolRow.module.css（.title/.sep/.summary），
        // 主题令牌沿用产品变量，明暗主题自动跟随。
        '.prism-group-list > * { margin:4px 0; }',
        '.prism-native-title { font-weight:400; }',
        '.prism-native-meta { display:flex; align-items:center; flex:1 1 auto; min-width:0; }',
        '.prism-native-sep { flex:none; width:2px; height:2px; border-radius:1px; margin:0 8px; background:var(--dsw-alias-label-caption); }',
        '.prism-native-summary { flex:1 1 auto; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-size:var(--dsh-content-font-size-secondary,13px); line-height:calc(24px + var(--dsh-content-font-delta,0px)); color:var(--dsw-alias-label-tertiary); }',
        // 原版行里的耗时：不参与弹性伸缩，靠右由 flex 自动推到末端；
        // 少了这条，长摘要会与耗时文字重叠（整洁档回归时抓到的）。
        '.prism-native-meta > .prism-dur { flex:0 0 auto; margin-left:8px; }',
        '.prism-native-detail { margin:6px 0 2px; }',
        '.prism-native-fallback { display:flex; align-items:center; gap:8px; flex-wrap:wrap; cursor:pointer; }',
        '.prism-native-leading { display:inline-flex; align-items:center; }',
        // —— 窄屏（手机浏览器）适配：触控目标加大、菜单与面板不溢出、详情降高 ——
        '@media (max-width: 560px) { .prism-menu { min-width:200px; max-width:calc(100vw - 24px); } .prism-menu-item { padding:9px 8px; } .prism-group-panel { padding:8px; } .prism-group-list > * { margin:6px 0; } .prism-detail { max-height:52vh; } .prism-doc-pre { max-height:40vh; } }',

        '.prism-group-dot { flex:none; margin-left:8px; }',
        '.prism-group-count { flex:none; margin-left:8px; font-size:var(--dsh-content-font-size-secondary,13px); color:var(--dsw-alias-label-tertiary); }',
        '.prism-group-toggle { flex:none; margin-left:8px; }',
        '.prism-official-block { margin-top:6px; }',
        '.prism-result-fallback { margin-top:6px; }',
        '.prism-detail.prism-detail-plain { background:none; padding:0; }',
      ].join('\n');

      ctx.effect(function () {
        if (typeof document === 'undefined') return;
        const tag = document.createElement('style');
        tag.dataset.plugin = 'dsh-prism';
        tag.textContent = css;
        document.head.appendChild(tag);
        return function () { tag.remove(); };
      });

      // 点开时把被点的那一块钉在屏幕上（见 §六点六点二）：一处 capture 监听
      //   覆盖插件自己所有会改变高度的开合。插件卸载 / 声明消失时整批撤掉，
      //   不留监听、不留补位中的状态。
      ctx.effect(function () { return installRowPin(); });

      // ---- 注册：左下角悬浮入口 + 二级菜单 ----
      // ---- 注册：侧栏脚区入口（官方 sidebar.footer.action，与「设置」同排、在其上方）----
      slots.inject('sidebar.footer.action', function () {
        return slots.register(
          { name: 'sidebar.footer.action', id: 'prism-tier' },
          PrismTierEntry,
        );
      });

      // ---- 注册：折叠组节点（仅折叠档注册，shadow 产品的三个节点渲染器）----
      // 原生档不注册 → 产品原样渲染（ToolCallTree / AssistantNodeView / RetryNodeView）。
      // 折叠档注册三个 keyed 渲染器，把一轮长活收成一条折叠行：
      //   tool-call      → ToolGroupNode（认领者渲染收拢行与面板，其余让位）
      //   assistant-step → AssistantTextOnly（答案步交还产品，其余只留正文）
      //   model-retry    → 返回 null（重试链的汇总在折叠面板里，产品那一行
      //                    若还渲染就是同一个事实画两遍，且会在折好的时间线
      //                    里再插一条；信息没有丢，面板里有它的一行）
      // keyed 槽同 key 同 priority 的注册会直接抛错，必须以更低的 priority
      // 才能 shadow 产品的同 key 渲染器（lowest renders），故这里用 priority: -1；
      // 档位切换时动态注册/注销，并且**无条件 notify**（见 setMode 的注释）。
      // 不注册 tool.call.toolview：该槽的消费方是产品 ToolCallTree 内部的原子
      // 分发，折叠档下 ToolCallTree 已被 shadow，注册了也没有消费方；面板内的
      // 工具行直接渲染 ToolCard / NativeToolRow，不经过槽分发。
      slots.inject('conversation.chat.node', function* () {
        var disposers = {};
        function dropAll() {
          resetClaims();
          var keys = Object.keys(disposers);
          for (var i = 0; i < keys.length; i++) {
            try { if (disposers[keys[i]]) disposers[keys[i]](); } catch (e) { logPrismError('dispose ' + keys[i], e); }
            disposers[keys[i]] = null;
            delete diag.registered[keys[i]];
          }
          // 交还渲染权的同时把座位还回去：本插件加过的 hidden 一律撤回，
          //   否则切回原生档后产品的行会停在隐藏里（只有刷新才恢复）。
          //   切档 / 卸载走「整批还」—— 这时插件退出战场，不该留任何标记。
          releaseAllFoldedSeats(diag);
          releaseCompactRows();
        }
        const WANTED = [
          ['tool-call', ToolGroupNode],
          ['assistant-step', AssistantTextOnly],       // 思考行不再单独占位：助手节点也交给棱镜
          ['model-retry', ToolGroupNode],              // 重试行：有工具时在面板里，没有工具时自己认领
        ];
        function sync() {
          var want = store.mode !== 'native';
          if (want) {
            for (var i = 0; i < WANTED.length; i++) {
              const key = WANTED[i][0];
              if (disposers[key]) continue;
              try {
                disposers[key] = slots.register({ name: 'conversation.chat.node', key: key, priority: -1 }, WANTED[i][1]);
                diag.registered[key] = true;
              // 失败时**不写 disposers**：写进去就再也重试不了，而且会挡住 dropAll 的判断
              } catch (e) { logPrismError('register ' + key, e); }
            }
          } else {
            dropAll();                                   // 无论前一次注册成没成，切原生档都要清干净
          }
        }
        sync();
        yield subscribe(sync);   // 档位切换 → 同步注册状态
        yield function () {      // 声明消失 / 插件卸载：清理注册与座位
          dropAll();
        };
      });
    }

    exports.apply = apply;
    exports.inject = inject;
    return module.exports;
  }
});
