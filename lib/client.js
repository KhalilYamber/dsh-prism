window.__ModuleLoader__.load({
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
      expand: '展开 ▾',
      collapse: '收起 ▴',
      collapseWord: '点击收起',
      groupTitle: '本次工具调用：',
      clickToExpand: '，点击展开',
      groupNote: '每行记录一次工具调用，点行可查看脱敏后的处理详情。',
      resultLabel: '结果：',
      detail: '详情 ▾',
      detailCollapse: '收起 ▴',
      expandWord: '展开',
      running: '运行中',
      hadErrors: '有出错',
      done: '已完成',
      inProgress: '进行中',
      error: '出错',
      doingAuto: '正在执行「',
      doingAutoEnd: '」',
      argDoing: '正在',
      doneAuto: '「',
      doneAutoEnd: '」执行完毕',
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
      expand: 'Expand ▾',
      collapse: 'Collapse ▴',
      collapseWord: 'Click to collapse',
      groupTitle: 'Tool calls: ',
      clickToExpand: ', click to expand',
      groupNote: 'Each row is one tool call; click a row for redacted details.',
      resultLabel: 'Result: ',
      detail: 'Details ▾',
      detailCollapse: 'Collapse ▴',
      expandWord: 'Expand',
      running: 'Running',
      hadErrors: 'Had errors',
      done: 'Done',
      inProgress: 'In progress',
      error: 'Error',
      doingAuto: 'Running "',
      doingAutoEnd: '"',
      argDoing: 'Running ',
      doneAuto: '"',
      doneAutoEnd: '" finished',
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
    // 六点五、工具行元信息：从一次工具调用的生命周期块推导该行
    //   的全部展示要素（行文本 / 状态 / 详情材料）。
    //   时间线行（ToolCard）与折叠组面板共用同一套推导，保证两种
    //   呈现下的文案、图标与状态完全一致。
    // ============================================================
    function toolRowMeta(toolName, block) {
      const settled = block.kind === 'tool-result';
      const name = settled ? (block.call ? block.call.name : toolName) : (block.name || toolName);
      const argsRaw = settled ? (block.call ? block.call.argsRaw : '') : (block.argsRaw || '');
      const isError = settled ? !!block.isError : false;
      const text = settled ? resultText(block) : '';
      const rule = ruleFor(name);
      const doing = rule ? (lang === 'en' && rule.doingEn ? rule.doingEn : rule.doing) : t('doingAuto') + name + t('doingAutoEnd');
      const done = rule ? (lang === 'en' && rule.doneEn ? rule.doneEn : rule.done) : t('doneAuto') + name + t('doneAutoEnd');
      const argPlain = plainArgs(name, argsRaw);
      // 行文本：进行中带参数 → 「正在…」；已结算带参数 → 参数摘要；否则白话文案
      const plainLine = settled ? done : doing;
      const lineText = settled
        ? (argPlain ? argPlain : plainLine)
        : (argPlain ? t('argDoing') + argPlain : plainLine);
      const statusIcon = !settled ? '●' : (isError ? '✕' : '✓');
      const statusCls = !settled ? 'running' : (isError ? 'err' : 'ok');
      const statusWord = !settled ? t('inProgress') : (isError ? t('error') : t('done'));
      const rowLabel = statusWord + colon() + lineText;
      return { settled, name, argsRaw, isError, text, rule, argPlain, plainLine, lineText, statusIcon, statusCls, statusWord, rowLabel };
    }

    // ============================================================
    // 六点六、折叠组辅助：把一次 user turn 内、正式回复之前的整串
    //   工具调用归成一个折叠组（turn 级归组）。
    //   组边界：正式回复 = 最后一条「已结算且含非空文本」的 assistant
    //   消息（与产品 turn-tail 的 closing 判定一致）；正式回复之前的
    //   所有 tool-call 节点同属一组；turn 未完成（无正式回复）时组 =
    //   当前全部工具调用（运行中随新调用累计）。
    //   思考计数 = 组内 assistant 输出中非空 reasoning 块的数量，
    //   取自 assistant-step 节点的 blocks（kind === 'reasoning'）；
    //   形态依据：运行时 toAssistantBlock 把 ContentBlock type
    //   'reasoning' 分类为 AssistantBlock reasoning，assistant-step
    //   节点 data.blocks 即该步模型输出的完整块列表。
    // ============================================================
    const EMPTY_NODES = [];

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

    // 从会话快照收集某 turn 内与本组相关的节点（tool-call 与
    // assistant-step，保持渲染顺序）；供 useChat / useSession 选择器使用。
    function collectTurnNodes(sn, turn) {
      var chat = chatOf(sn);
      if (!chat) return EMPTY_NODES;
      var keys = chat.locations.getTurn(turn);
      var out = [];
      for (var i = 0; i < keys.length; i++) {
        var n = chat.nodes.get(keys[i]);
        if (!n) continue;
        if (n.kind === 'tool-call' || n.kind === 'assistant-step') out.push(n);
      }
      return out;
    }

    // 选择器比较器：仅当节点引用集合完全相同时跳过重渲染。
    function sameNodeRefs(a, b) {
      if (a === b) return true;
      if (!a || !b || a.length !== b.length) return false;
      for (var i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
      return true;
    }

    // 一次思考：assistant 输出里非空的 reasoning 块数。
    function countReasoning(data) {
      if (!data || !data.blocks) return 0;
      var c = 0;
      for (var i = 0; i < data.blocks.length; i++) {
        var b = data.blocks[i];
        if (b && b.kind === 'reasoning' && b.text && b.text.trim() !== '') c++;
      }
      return c;
    }

    // 组归属计算：
    //   组 = 本 turn 的**全部**工具调用。一个 user turn 恰好收成一行统计，
    //   不按「正式回复」切段——模型边写边调时，回复之间夹着的调用曾各自
    //   单独成行，看起来就是「没收干净」（v1.3.3 前的锚点切段行为）。
    //   拿不到 turn（location 异常）时退化为只含自己的单行组，保证每个
    //   工具节点恰好渲染一次。
    //   返回 { tools, thoughts, boundary }：tools 组内工具节点；
    //   thoughts 组内思考计数；boundary 当前节点是否为组的边界
    //   （组由组内最后一个工具节点的槽位渲染，其余节点渲染空）。
    function computeGroup(turnNodes, myNode) {
      var tools = [];
      var thoughts = 0;
      for (var i = 0; i < turnNodes.length; i++) {
        var n = turnNodes[i];
        if (n.kind === 'tool-call') tools.push(n);
        else if (n.kind === 'assistant-step') thoughts += countReasoning(n.data);
      }
      var self = false;
      for (i = 0; i < tools.length; i++) {
        if (tools[i].key === myNode.key) { self = true; break; }
      }
      if (!self) {
        tools = [myNode];
        thoughts = 0;
      }
      return { tools: tools, thoughts: thoughts, boundary: tools[tools.length - 1].key === myNode.key };
    }

    // 组状态汇总：任一调用运行中 → 运行中（跑完才给对错总结）；
    // 全部结束且全对 → 已完成；全部结束且全错 → 有出错；
    // 对错混合 → 警示符号 + 「✓ n · ✕ m」计数（对在前）。
    function groupStatus(tools) {
      var running = 0;
      var ok = 0;
      var err = 0;
      for (var i = 0; i < tools.length; i++) {
        var root = tools[i].data ? tools[i].data.root : null;
        if (!root) continue;
        if (root.kind === 'tool-result') { if (root.isError) err++; else ok++; }
        else running++;
      }
      if (running > 0) return { icon: '●', cls: 'running', word: t('running') };
      if (err > 0 && ok > 0) return { icon: '⚠', cls: 'mixed', word: '✓ ' + ok + ' · ✕ ' + err };
      if (err > 0) return { icon: '✕', cls: 'err', word: t('hadErrors') };
      return { icon: '✓', cls: 'ok', word: t('done') };
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
    function NativeToolRow(props) {
      const P = props.primitives;
      const toolName = props.toolName || '';
      const meta = toolRowMeta(toolName, props.block || {});
      const name = meta.name;
      const variant = nativeVariant(name);
      const title = nativeTitle(name);
      const summary = nativeSummary(name, meta.argsRaw || '');
      const [open, setOpen] = React.useState(false);

      var leading;
      if (P && P.StateDot && !meta.settled) leading = React.createElement(P.StateDot, { state: 'ongoing' });
      else if (P && P.StateDot && meta.isError) leading = React.createElement(P.StateDot, { state: 'error' });
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

      const detail = React.createElement('div', {
        className: 'prism-detail prism-native-detail',
        onClick: function (e) { e.stopPropagation(); },
      },
        React.createElement('div', { className: 'prism-doc' },
          React.createElement('div', { className: 'prism-doc-name' }, name),
          (meta.settled && meta.text) ? React.createElement(DocBody, { text: meta.text, primitives: P }) : null,
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
          onToggle: function () { setOpen(!open); },
          collapsedContent: collapsed,
          titleClassName: 'prism-native-title',
        }, open ? detail : null);
      }

      // primitives 不可用时的降级行（保持信息结构，样式从简）
      return React.createElement('div', {
        className: 'prism-card prism-native prism-native-fallback',
        title: title + (summary ? ' · ' + summary : ''),
        onClick: function () { setOpen(!open); },
      },
        React.createElement('span', { className: 'prism-native-leading' }, leading),
        React.createElement('span', { className: 'prism-native-title' }, title),
        collapsed,
        open ? detail : null,
      );    }

    const inject = ['slots', 'locale'];

    function apply(ctx) {
      const slots = ctx.slots;

      // 官方 UI 原语：宿主平台单例（modules 的静态表里有它），直接 require
      // 即得，无需打包或安装；取不到时中级档降级为普通布局（功能不丢）。
      let primitives = null;
      try { primitives = require('@deepseek-ai/dsh-client-ui-primitives') || null; } catch (e) { primitives = null; }

      // ---- 状态（内存态，刷新回默认）----
      const store = {
        mode: 'native',      // native | medium | simple
        hideComplex: true,   // 简化档：把复杂工具折叠成一行
        menuOpen: false,
        openTurns: new Set(), // 简化档：已展开面板的 turn 编号集合（每个折叠组
        //  独立开合，按 turn 编号作 key；刷新回默认收起；turn 拿不到的隔离组用 'none'）
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
      function setMode(m) {
        if (store.mode === m) return;
        store.mode = m;
        notify();
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
      // 展开态按「会话 + turn」记账：store 是插件级（不随会话切换重建），
      // 只用 turn 编号会让两个会话里同号 turn 互相串档。
      function groupKey(sessionId, turn) {
        return (sessionId || '') + ':' + (turn === null ? 'none' : turn);
      }
      function toggleGroup(sessionId, turn) {
        var key = groupKey(sessionId, turn);
        if (store.openTurns.has(key)) store.openTurns.delete(key);
        else store.openTurns.add(key);
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
      function useGroupOpen(sessionId, turn) {
        const key = groupKey(sessionId, turn);
        const [v, setLocal] = React.useState(store.openTurns.has(key));
        React.useEffect(function () {
          return subscribe(function () { setLocal(store.openTurns.has(key)); });
        }, [key]);
        return v;
      }

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
        const [open, setOpen] = React.useState(false);
        const [revealed, setRevealed] = React.useState(false);
        const hidden = !!(meta.rule && meta.rule.complex) && hideComplex && !revealed;

        if (hidden) {
          // 折叠行：类别图标 + 白话文案 + 「展开」；点击即展开并打开详情面板
          return React.createElement('div', {
            className: 'prism-card prism-simple',
            title: rowLabel,
            'aria-label': rowLabel,
            onClick: function () { setRevealed(true); setOpen(true); },
          },
            React.createElement('span', { className: 'prism-emoji' }, toolIcon(name)),
            React.createElement('span', { className: 'prism-plain' }, plainLine),
            React.createElement('span', {
              className: 'prism-fold',
              onClick: function (e) { e.stopPropagation(); setRevealed(true); setOpen(true); },
            }, t('expandWord')),
          );
        }

        // 普通时间线行：整行点击切换详情面板
        return React.createElement('div', {
          className: 'prism-card prism-simple',
          title: rowLabel,
          'aria-label': rowLabel,
          onClick: function () { setOpen(!open); },
        },
          React.createElement('span', { className: 'prism-emoji' }, toolIcon(name)),
          React.createElement('span', { className: 'prism-plain' }, lineText),
          React.createElement('span', { className: 'prism-ico ' + statusCls, 'aria-hidden': true }, statusIcon),
          React.createElement('span', {
            className: 'prism-fold',
            onClick: function (e) { e.stopPropagation(); setOpen(!open); },
          }, open ? t('detailCollapse') : t('detail')),
          open ? React.createElement('div', {
            className: 'prism-detail',
            onClick: function (e) { e.stopPropagation(); },
          },
            React.createElement('div', { className: 'prism-doc' },
              React.createElement('div', { className: 'prism-doc-name' }, name),
              argPlain ? React.createElement('div', { className: 'prism-doc-args' }, argPlain) : null,
              (settled && text) ? React.createElement('div', { className: 'prism-doc-label' }, t('resultLabel')) : null,
              // 结果必须先脱敏再渲染成交付文档
              (settled && text) ? React.createElement(DocBody, { text: text, primitives: primitives }) : null,
            ),
          ) : null,
        );
      }

      // ---- 折叠组节点（仅简化档注册，替换产品 tool-call 树；原生档零注册）----
      // 总结档：正式回复之前的整串工具调用收成一行统计「N 个工具 · M 次思考」；
      // 中间档：点开统计行渲染文档化面板（标题区 + 清单区 + 说明区），
      //   每行复用 ToolCard 的行样式与文案规则（含 hideComplex 折叠），
      //   点单行展开该工具的详情（脱敏结果交给官方 MarkdownText 渲染）。
      // 组由组内最后一个工具节点的槽位渲染（前面的工具节点渲染空，产品
      //   flowItem:empty 自动隐藏），保证每个工具节点只出现在一个组里一次；
      //   运行中、已完成、刷新重放三种情况都按同一规则归组。
      function ToolGroupNode(props) {
        const node = props.node;
        // framework 标准 hooks（session 作用域槽组件由 props 注入，不能裸用）：
        //   新版 DSH 用 useChat 供给 Chat 视图快照，旧版从 useSession 的 .chat 取；
        //   两者签名一致（selector + 可选比较器），按可用者取用。
        const useChat = props.useChat || props.useSession;
        const mode = useMode();
        const sessionId = props.sessionId || '';
        const turn = turnOf(node.location);
        const groupOpen = useGroupOpen(sessionId, turn);
        const turnNodes = useChat(
          function (sn) { return turn === null ? EMPTY_NODES : collectTurnNodes(sn, turn); },
          sameNodeRefs,
        );
        const group = computeGroup(turnNodes, node);
        if (typeof window !== 'undefined' && window.__PRISM_DEBUG__ && !window.__PRISM_DBG_DONE__) {
          window.__PRISM_DBG_DONE__ = true;
          console.log('[prism-debug] ' + JSON.stringify({
            turn: turn,
            nodeKey: node.key,
            nodeKind: node.kind,
            locKind: node.location && node.location.kind,
            hasUseChat: typeof props.useChat,
            hasUseSession: typeof props.useSession,
            turnNodes: (turnNodes || []).length,
            kinds: (turnNodes || []).map(function (n) { return n && n.kind; }).slice(0, 12),
            tools: group.tools.length,
            boundary: group.boundary,
          }));
        }
        if (!group.boundary) return null;
        const toolCount = group.tools.length;
        const countText = toolCount + t('toolsUnit') + (group.thoughts > 0 ? ' · ' + group.thoughts + t('thoughtsUnit') : '');
        const status = groupStatus(group.tools);
        // 混合态除警示符号外还要写出对错计数（对在前）；其余状态只有图标。
        const statusText = status.cls === 'mixed' ? status.icon + ' ' + status.word : status.icon;
        if (!groupOpen) {
          // 总结档：一行统计，点击展开中间档面板
          return React.createElement('div', {
            className: 'prism-group prism-group-row',
            title: t('groupTitle') + countText + t('clickToExpand'),
            'aria-label': t('groupTitle') + countText + t('clickToExpand'),
            onClick: function () { toggleGroup(sessionId, turn); },
          },
            React.createElement('span', { className: 'prism-group-emoji', 'aria-hidden': true }, '🔧'),
            React.createElement('span', { className: 'prism-group-title' }, countText),
            React.createElement('span', { className: 'prism-group-status ' + status.cls, 'aria-hidden': true }, statusText),
            React.createElement('span', { className: 'prism-group-caret' }, t('expand')),
          );
        }
        // 中间档：文档化面板（标题区 + 清单区 + 说明区）
        return React.createElement('div', { className: 'prism-group prism-group-panel' },
          React.createElement('div', {
            className: 'prism-group-head',
            title: t('collapseWord'),
            onClick: function () { toggleGroup(sessionId, turn); },
          },
            React.createElement('span', { className: 'prism-group-emoji', 'aria-hidden': true }, '🔧'),
            React.createElement('span', { className: 'prism-group-title' }, t('thisCall') + countText),
            React.createElement('span', { className: 'prism-group-status ' + status.cls, 'aria-hidden': true }, statusText),
            React.createElement('span', { className: 'prism-group-caret' }, t('collapse')),
          ),
          React.createElement('div', { className: 'prism-group-list' },
            group.tools.map(function (n) {
              var root = n.data ? n.data.root : null;
              // 中级档：每行走原版语言（官方原语 + 类别标题 + 参数摘要）
              if (mode === 'medium') {
                return React.createElement(NativeToolRow, {
                  key: n.key,
                  primitives: primitives,
                  block: root || {},
                  toolName: rootName(root),
                });
              }
              return React.createElement(ToolCard, {
                key: n.key,
                block: root || {},
                toolName: rootName(root),
              });
            }),
          ),
          React.createElement('div', { className: 'prism-group-note' },
            t('groupNote'),
          ),
        );
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
            React.createElement('div', { className: 'prism-menu-title' }, t('interfaceMode')),
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
        // 侧栏脚区入口：圆形标记按钮，尺寸对齐同槽其它插件的按钮（wide 28px / rail 36px）
        '.prism-entry-wrap { display:inline-flex; }',
        '.prism-entry { flex:none; display:inline-flex; align-items:center; justify-content:center; width:28px; height:28px; padding:0; border:none; border-radius:50%; background:transparent; cursor:pointer; color:var(--dsw-alias-label-secondary); transition:background-color 120ms ease, color 120ms ease; }',
        '.prism-entry:hover, .prism-entry.open { background:var(--dsw-alias-interactive-bg-hover); color:var(--dsw-alias-label-primary); }',
        '.prism-entry:focus-visible { outline:2px solid var(--dsw-alias-state-business-primary); outline-offset:1px; }',
        '.prism-entry.rail { width:36px; height:36px; color:var(--dsw-alias-label-primary); }',
        '.prism-entry-mark { font-size:13px; font-weight:600; line-height:1; user-select:none; }',
        '.prism-entry.rail .prism-entry-mark { font-size:16px; }',
        '.prism-menu-backdrop { position:fixed; inset:0; pointer-events:auto; }',
        '.prism-menu { position:fixed; z-index:1002; min-width:220px; background:var(--dsw-alias-bg-overlay); border:1px solid var(--dsw-alias-border-l1); border-radius:12px; padding:8px; pointer-events:auto; box-shadow:var(--dsw-shadow-lv2); }',
        '.prism-menu-title { font-size:12px; color:var(--dsw-alias-label-secondary); margin-bottom:4px; padding:2px 6px; }',
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
        '.prism-fold { color:var(--dsw-alias-label-secondary); font-size:12px; flex:0 0 auto; cursor:pointer; white-space:nowrap; }',
        '.prism-fold:hover { color:var(--dsw-alias-label-primary); }',
        // —— 详情面板（交付文档）——
        '.prism-detail { flex-basis:100%; max-height:420px; overflow:auto; margin-top:4px; background:var(--dsw-alias-bg-layer-2); border-radius:8px; padding:10px 12px; }',
        '.prism-doc-name { font-family:ui-monospace,SFMono-Regular,Consolas,monospace; font-size:11px; color:var(--dsw-alias-label-secondary); }',
        '.prism-doc-args { font-size:12px; color:var(--dsw-alias-label-primary); margin-top:4px; }',
        '.prism-doc-label { font-size:12px; font-weight:600; color:var(--dsw-alias-label-secondary); margin-top:8px; }',
        // —— 折叠组（总结档统计行 + 中间档面板）——
        '.prism-group-row { display:flex; align-items:center; gap:8px; padding:8px 12px; border:1px solid var(--dsw-alias-border-l1); border-radius:12px; background:var(--dsw-alias-bg-layer-1); cursor:pointer; box-shadow:var(--dsw-shadow-lv2); }',
        '.prism-group-row:hover { background:var(--dsw-alias-bg-layer-2); }',
        '.prism-group-emoji { font-size:14px; line-height:1; flex:0 0 auto; }',
        '.prism-group-title { color:var(--dsw-alias-label-primary); font-weight:600; flex:1 1 auto; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }',
        '.prism-group-status { font-size:11px; line-height:1; font-weight:700; flex:0 0 auto; }',
        '.prism-group-status.ok { color:var(--dsw-alias-state-success-primary); }',
        '.prism-group-status.err { color:var(--dsw-alias-state-error-primary); }',
        '.prism-group-status.running { color:var(--dsw-alias-state-warn-primary); }',
        '.prism-group-status.mixed { color:var(--dsw-alias-state-warn-primary); }',
        '.prism-group-caret { color:var(--dsw-alias-label-secondary); font-size:12px; flex:0 0 auto; white-space:nowrap; }',
        '.prism-group-panel { border:1px solid var(--dsw-alias-border-l1); border-radius:12px; background:var(--dsw-alias-bg-layer-1); padding:8px 10px; box-shadow:var(--dsw-shadow-lv2); }',
        '.prism-group-head { display:flex; align-items:center; gap:8px; padding:4px 2px 6px; cursor:pointer; user-select:none; }',
        '.prism-group-list { display:flex; flex-direction:column; }',
        '.prism-group-list .prism-card { margin:4px 0; }',
        '.prism-group-note { font-size:11px; color:var(--dsw-alias-label-secondary); padding:6px 4px 2px; line-height:1.5; }',
        // —— 中级档：原版行（官方 DisclosureRow / StateDot + 产品同款度量）——
        // 度量值照抄 ui-tool 的 ToolRow.module.css（.title/.sep/.summary），
        // 主题令牌沿用产品变量，明暗主题自动跟随。
        '.prism-group-list > * { margin:4px 0; }',
        '.prism-native-title { font-weight:400; }',
        '.prism-native-meta { display:flex; align-items:center; flex:1 1 auto; min-width:0; }',
        '.prism-native-sep { flex:none; width:2px; height:2px; border-radius:1px; margin:0 8px; background:var(--dsw-alias-label-caption); }',
        '.prism-native-summary { flex:1 1 auto; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-size:var(--dsh-content-font-size-secondary,13px); line-height:calc(24px + var(--dsh-content-font-delta,0px)); color:var(--dsw-alias-label-tertiary); }',
        '.prism-native-detail { margin:6px 0 2px; }',
        '.prism-native-fallback { display:flex; align-items:center; gap:8px; flex-wrap:wrap; cursor:pointer; }',
        '.prism-native-leading { display:inline-flex; align-items:center; }',
        // —— 窄屏（手机浏览器）适配：触控目标加大、菜单与面板不溢出、详情降高 ——
        '@media (max-width: 560px) { .prism-menu { min-width:200px; max-width:calc(100vw - 24px); } .prism-menu-item { padding:9px 8px; } .prism-group-panel { padding:8px; } .prism-group-list > * { margin:6px 0; } .prism-detail { max-height:52vh; } .prism-doc-pre { max-height:40vh; } }',
      ].join('\n');

      ctx.effect(function () {
        if (typeof document === 'undefined') return;
        const tag = document.createElement('style');
        tag.dataset.plugin = 'dsh-prism';
        tag.textContent = css;
        document.head.appendChild(tag);
        return function () { tag.remove(); };
      });

      // ---- 注册：左下角悬浮入口 + 二级菜单 ----
      // ---- 注册：侧栏脚区入口（官方 sidebar.footer.action，与「设置」同排、在其上方）----
      slots.inject('sidebar.footer.action', function () {
        return slots.register(
          { name: 'sidebar.footer.action', id: 'prism-tier' },
          PrismTierEntry,
        );
      });

      // ---- 注册：折叠组节点（仅简化档注册，shadow 产品 tool-call 树）----
      // 原生档不注册 → 产品 ToolCallTree 原样渲染（含通用卡片）。
      // 简化档注册 key='tool-call' 的节点渲染器，把正式回复之前的整串
      // 工具调用收成折叠组。keyed 槽同 key 同 priority 的注册会直接抛错，
      // 必须以更低的 priority 才能 shadow 产品 ToolCallTree（lowest
      // renders），故这里用 priority: -1；模式切换时动态注册/注销。
      // 不注册 tool.call.toolview：该槽的消费方是产品 ToolCallTree 内部
      // 的原子分发，简化档下 ToolCallTree 已被 shadow，注册了也没有消费
      // 方；折叠组面板内的工具行直接渲染 ToolCard，不经过槽分发。
      slots.inject('conversation.chat.node', function* () {
        var disposer = null;
        function sync() {
          var want = store.mode !== 'native';
          if (want && !disposer) disposer = slots.register({ name: 'conversation.chat.node', key: 'tool-call', priority: -1 }, ToolGroupNode);
          if (!want && disposer) { disposer(); disposer = null; }
        }
        sync();
        yield subscribe(sync);   // 模式切换 → 同步注册状态
        yield function () {      // 声明消失 / 插件卸载：清理注册
          if (disposer) { disposer(); disposer = null; }
        };
      });
    }

    exports.apply = apply;
    exports.inject = inject;
    return module.exports;
  }
});
