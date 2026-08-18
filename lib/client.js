window.__ModuleLoader__.load({
  id: "dsh-ux-simple",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    const React = require("react");

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
      { tools: ['read'], doing: '正在读取一个文件的内容', done: '文件读完了', arg: { pick: ['file_path'], mode: 'file', prefix: '读取文件', fallback: '读取文件' } },
      { tools: ['write'], doing: '正在创建或覆盖一个文件', done: '文件写好了', arg: { pick: ['file_path'], mode: 'file', prefix: '写入文件', fallback: '写入文件' } },
      { tools: ['edit'], doing: '正在修改文件里的某段文字', done: '修改完成', arg: { pick: ['file_path'], mode: 'file', prefix: '修改文件', fallback: '修改文件' } },
      { tools: ['read_image'], doing: '正在读取一张图片', done: '图片读好了', arg: { pick: ['file_path'], mode: 'file', prefix: '读取图片', fallback: '读取图片' } },
      { tools: ['glob'], doing: '正在按文件名规则查找文件', done: '查找完成', arg: { pick: ['pattern'], mode: 'raw', prefix: '按规则查找', fallback: '查找文件' } },
      { tools: ['grep'], doing: '正在文件内容里搜索关键词', done: '搜索完成', arg: { pick: ['pattern'], mode: 'raw', prefix: '搜索内容', fallback: '搜索文件内容' } },
      { tools: ['web_search'], doing: '正在上网搜索信息', done: '搜索完成', arg: { pick: ['query'], mode: 'raw', prefix: '搜索', fallback: '上网搜索' } },
      { tools: ['web_fetch'], doing: '正在抓取网页内容', done: '网页抓取完成', arg: { pick: ['url', 'query'], mode: 'raw', prefix: '抓取', fallback: '抓取网页' } },
      { tools: ['skill'], doing: '正在学习一项技能的使用说明', done: '技能已学会，可以继续了', arg: { pick: ['name'], mode: 'raw', prefix: '学习技能', fallback: '学习一个技能' } },
      { tools: ['todo_write'], doing: '正在更新任务清单', done: '任务清单已更新', arg: { pick: ['todos'], mode: 'count', prefix: '更新任务清单（', unit: ' 项）' } },
      { tools: ['ask_user_question'], doing: '正在向您提问，等您回答', done: '等待您回答', arg: { pick: ['questions'], mode: 'count', prefix: '向您提 ', unit: ' 个问题' } },
      { tools: ['pwsh'], doing: '正在电脑上执行一条命令', done: '命令执行完毕', arg: { pick: ['command'], mode: 'short', max: 80, prefix: '执行命令', fallback: '执行一条命令' } },

      // —— 目标与计划（复杂）——
      { tools: ['get_goal'], doing: '正在读取当前目标', done: '目标已读取', complex: true, noArgs: true },
      { tools: ['create_goal'], doing: '正在创建目标', done: '目标已创建', complex: true, arg: { pick: ['objective'], mode: 'short', max: 60, prefix: '目标', fallback: '创建目标' } },
      { tools: ['update_goal'], doing: '正在更新目标', done: '目标已更新', complex: true, arg: { pick: ['action'], mode: 'wrap', prefix: '更新目标', fallback: '更新目标' } },
      { tools: ['exit_plan_mode'], doing: '正在提交计划供您审阅', done: '计划已提交', complex: true, arg: { mode: 'fixed', prefix: '提交计划，等您审阅' } },

      // —— 子代理与任务编排（复杂）——
      { tools: ['send_message'], doing: '正在给子代理发送消息', done: '消息已送达', complex: true, arg: { pick: ['message'], mode: 'short', max: 60, prefix: '发消息', fallback: '给子代理发消息' } },
      { tools: ['interrupt_agent'], doing: '正在打断子代理', done: '已请求打断', complex: true, arg: { pick: ['agent_id'], mode: 'raw', prefix: '打断子代理', fallback: '打断子代理' } },
      { tools: ['list_agents'], doing: '正在列出子代理', done: '列表已生成', complex: true, noArgs: true },
      { tools: ['subagent'], doing: '正在派一个子代理去干活', done: '子代理已派出', complex: true, arg: { pick: ['description'], mode: 'raw', prefix: '子代理任务', fallback: '派子代理干活' } },
      { tools: ['subagent_fork'], doing: '正在派一个子代理继续当前工作', done: '子代理已派出', complex: true, arg: { pick: ['description'], mode: 'raw', prefix: '子代理任务', fallback: '派子代理干活' } },
      { tools: ['workflow'], doing: '正在编排多个代理协作', done: '协作完成', complex: true, noArgs: true },
      { tools: ['ralph'], doing: '正在循环迭代推进目标', done: '迭代完成', complex: true, arg: { pick: ['objective'], mode: 'short', max: 60, prefix: '目标', fallback: '循环迭代' } },

      // —— 后台任务（复杂）——
      { tools: ['job_output'], doing: '正在读取后台任务的结果', done: '结果读取完成', complex: true, arg: { pick: ['job_id'], mode: 'raw', prefix: '后台任务', fallback: '操作后台任务' } },
      { tools: ['job_list'], doing: '正在列出后台任务', done: '任务列表已生成', complex: true, noArgs: true },
      { tools: ['job_kill'], doing: '正在停止一个后台任务', done: '任务已停止', complex: true, arg: { pick: ['job_id'], mode: 'raw', prefix: '后台任务', fallback: '操作后台任务' } },

      // —— 插件系统（复杂）——
      { tools: ['cordis_inspect_list'], doing: '正在查看可用的插件能力', done: '能力清单已获取', complex: true, noArgs: true },
      { tools: ['cordis_inspect_query'], doing: '正在查看某个接口的详细信息', done: '信息已获取', complex: true, arg: { pick: ['provider'], mode: 'raw', prefix: '查看接口', fallback: '查看接口详情' } },
      { tools: ['cordis_inspect_self'], doing: '正在查看自身插件的状态', done: '状态已获取', complex: true, noArgs: true },
      { tools: ['cordis_define'], doing: '正在定义一个插件', done: '插件已定义', complex: true, arg: { pick: ['pluginId'], mode: 'raw', prefix: '插件', fallback: '操作插件' } },
      { tools: ['cordis_run'], doing: '正在启动一个插件', done: '插件已启动', complex: true, arg: { pick: ['pluginId'], mode: 'raw', prefix: '插件', fallback: '操作插件' } },
      { tools: ['cordis_stop'], doing: '正在停用一个插件', done: '插件已停止', complex: true, arg: { pick: ['pluginId'], mode: 'raw', prefix: '插件', fallback: '操作插件' } },
      { tools: ['cordis_undefine'], doing: '正在删除一个插件', done: '插件已删除', complex: true, arg: { pick: ['pluginId'], mode: 'raw', prefix: '插件', fallback: '操作插件' } },
    ];

    // ============================================================
    // 二、参数名规则：没有显式 arg 的工具（含未来新增工具）按参数名
    // 自动生成白话摘要，按顺序先命中先使用；敏感参数名永不展示。
    // ============================================================
    const ARG_NAME_RULES = [
      { keys: ['file_path', 'path', 'dir', 'directory', 'folder', 'filename'], mode: 'file', label: '文件' },
      { keys: ['url', 'link', 'href', 'endpoint'], mode: 'raw', label: '链接' },
      { keys: ['query', 'question', 'search', 'keyword', 'pattern', 'glob'], mode: 'raw', label: '关键词' },
      { keys: ['command', 'cmd', 'script', 'shell'], mode: 'short', max: 80, label: '命令' },
      { keys: ['name', 'title', 'label'], mode: 'raw', label: '名称' },
      { keys: ['objective', 'goal', 'target', 'purpose', 'reason'], mode: 'short', max: 60, label: '目标' },
      { keys: ['description', 'message', 'content', 'text', 'body'], mode: 'short', max: 60, label: '内容' },
      { keys: ['code', 'source', 'program', 'data', 'value'], mode: 'short', max: 60, label: '内容' },
      { keys: ['id', 'job_id', 'agent_id', 'pluginId', 'packageId', 'call_id', 'uid'], mode: 'id', label: '标识' },
      { keys: ['model', 'provider', 'engine'], mode: 'raw', label: '模型' },
    ];

    // 敏感参数名：值在任何情况下都不展示（脱敏底线）。
    const SENSITIVE_KEY = /(token|secret|password|passwd|credential|api[_-]?key|authorization|access[_-]?key|private[_-]?key)/i;

    // ============================================================
    // 三、注册名单推导：规则表 − 产品原生卡片
    // 有产品原生卡片的 key（NATIVE_KEYS）保持产品原版，插件不接管
    // （纯增量）；其余规则表内的工具全部注册白话卡片。
    // ============================================================
    const NATIVE_KEYS = ['ask_user_question', 'bash', 'cordis_define', 'cordis_run', 'cordis_stop', 'cordis_undefine', 'edit', 'glob', 'grep', 'read', 'skill', 'todo_write', 'web_fetch', 'web_search', 'write'];
    const REGISTERED_TOOLS = (function () {
      var seen = {};
      var out = [];
      TOOL_RULES.forEach(function (rule) {
        rule.tools.forEach(function (t) {
          if (seen[t] || NATIVE_KEYS.indexOf(t) !== -1) return;
          seen[t] = true;
          out.push(t);
        });
      });
      return out;
    })();

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

    // 简化档展示脱敏：常见密钥形态替换为占位符（仅影响展示，不改动数据）。
    function redact(text) {
      if (typeof text !== 'string') return text;
      return text
        .replace(/\b(sk|pk|rk)-[A-Za-z0-9_-]{16,}\b/g, '$1-••••••')
        .replace(/\b(Bearer|Authorization|X-API-Key)\s+[A-Za-z0-9._~+/=-]{12,}\b/gi, '$1 ••••')
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

    // 无显式 arg 规则时的自动摘要：按参数名规则取第一个非敏感命中。
    function autoArgs(args) {
      if (!args || typeof args !== 'object') return '';
      for (var i = 0; i < ARG_NAME_RULES.length; i++) {
        var r = ARG_NAME_RULES[i];
        var k = firstKey(args, r.keys);
        if (k === undefined) continue;
        if (SENSITIVE_KEY.test(k)) continue;
        var v = args[k];
        if (r.mode === 'file') return r.label + '：' + basename(v);
        if (r.mode === 'short') return r.label + '：' + shorten(v, r.max);
        if (r.mode === 'id') return r.label + '：' + shorten(v, 24);
        return r.label + '：' + shorten(v, 40);
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
      if (spec.mode === 'fixed') return spec.prefix;
      if (spec.mode === 'count') {
        var list = args && args[spec.pick[0]];
        return spec.prefix + (Array.isArray(list) ? list.length : 0) + spec.unit;
      }
      var v = pickArg(args, spec.pick);
      if (v === undefined) return spec.fallback || '';
      if (spec.mode === 'file') return spec.prefix + '：' + basename(v);
      if (spec.mode === 'wrap') return spec.prefix + '（' + v + '）';
      if (spec.mode === 'short') return spec.prefix + '：' + shorten(v, spec.max);
      return spec.prefix + '：' + v;
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
    // 六、交付文档渲染：脱敏后的结果文本 → 轻量 Markdown 子集
    //   语法：``` 围栏代码块 / | 表格（首行表头，|---| 分隔行跳过）/
    //   #、## 标题 / - 列表项 / 空行分段 / 普通段落；
    //   行内：**粗体**、`行内代码`、7~40 位十六进制 commit 哈希高亮。
    //   全部用 React.createElement 构造；任何解析失败都退化为
    //   一整段 pre-wrap 文本，绝不抛异常。
    // ============================================================
    // 行内解析：把普通文本/表格单元格拆成文本与高亮片段元素数组。
    function inlineDoc(text, keyPrefix) {
      var out = [];
      var re = /\*\*([^*\n]+)\*\*|`([^`\n]+)`|\b(?=[0-9a-fA-F]*[a-fA-F])([0-9a-fA-F]{7,40})\b/g;
      var last = 0;
      var n = 0;
      var m;
      while ((m = re.exec(text)) !== null) {
        if (m.index > last) {
          out.push(React.createElement('span', { key: keyPrefix + 't' + n }, text.slice(last, m.index)));
        }
        n++;
        if (m[1] !== undefined) {
          out.push(React.createElement('strong', { key: keyPrefix + 'b' + n }, m[1]));
        } else if (m[2] !== undefined) {
          out.push(React.createElement('code', { key: keyPrefix + 'c' + n }, m[2]));
        } else {
          out.push(React.createElement('span', { key: keyPrefix + 'h' + n, className: 'ux-commit' }, m[3]));
        }
        last = m.index + m[0].length;
      }
      if (last < text.length) {
        out.push(React.createElement('span', { key: keyPrefix + 't' + n }, text.slice(last)));
      }
      return out;
    }

    // 表格行解析：去掉首尾 | 后按 | 拆分，单元格去空白。
    function parseTableRow(line) {
      var s = line.trim();
      if (s.charAt(0) === '|') s = s.slice(1);
      if (s.charAt(s.length - 1) === '|') s = s.slice(0, -1);
      return s.split('|').map(function (c) { return c.trim(); });
    }

    // 分隔行判断：如 |---|:---:|
    function isSepRow(cells) {
      if (!cells || cells.length === 0) return false;
      return cells.every(function (c) { return /^:?-+:?$/.test(c); });
    }

    // 主入口：脱敏后的字符串 → React 元素数组（逐行状态机）。
    function markdownDoc(text) {
      try {
        if (typeof text !== 'string') {
          return [React.createElement('p', { key: 'ux0', className: 'ux-doc-p' }, String(text == null ? '' : text))];
        }
        var lines = text.split('\n');
        var out = [];
        var seq = 0;
        var para = [];        // 当前段落缓冲（普通行）
        var code = null;      // 围栏代码块缓冲（进入 ``` 后非 null）
        var tableRows = null; // 表格原始行缓冲

        function nextKey() { return 'ux' + (seq++); }

        function flushPara() {
          if (para.length === 0) return;
          var s = para.join('\n');
          para = [];
          out.push(React.createElement('p', { key: nextKey(), className: 'ux-doc-p' }, inlineDoc(s, 'i' + (seq++))));
        }

        function flushCode() {
          if (code === null) return;
          var s = code;
          code = null;
          out.push(React.createElement('pre', { key: nextKey(), className: 'ux-doc-pre' }, s));
        }

        function flushTable() {
          if (tableRows === null || tableRows.length === 0) return;
          var raw = tableRows;
          tableRows = null;
          var header = parseTableRow(raw[0]);
          var body = [];
          for (var i = 1; i < raw.length; i++) {
            var cells = parseTableRow(raw[i]);
            if (i === 1 && isSepRow(cells)) continue;
            body.push(cells);
          }
          out.push(React.createElement('table', { key: nextKey(), className: 'ux-doc-table' },
            React.createElement('thead', { key: nextKey() },
              React.createElement('tr', { key: nextKey() },
                header.map(function (c) {
                  return React.createElement('th', { key: nextKey() }, inlineDoc(c, 'i' + (seq++)));
                }),
              ),
            ),
            React.createElement('tbody', { key: nextKey() },
              body.map(function (row) {
                return React.createElement('tr', { key: nextKey() },
                  row.map(function (c) {
                    return React.createElement('td', { key: nextKey() }, inlineDoc(c, 'i' + (seq++)));
                  }),
                );
              }),
            ),
          ));
        }

        for (var i = 0; i < lines.length; i++) {
          var line = lines[i];
          if (code !== null) {
            if (/^\s*```/.test(line)) {
              flushCode();
            } else {
              code = code.length === 0 ? line : code + '\n' + line;
            }
            continue;
          }
          if (tableRows !== null) {
            if (/^\s*\|/.test(line)) {
              tableRows.push(line);
              continue;
            }
            flushTable();
            // 该行落回普通处理
          }
          if (/^\s*```/.test(line)) {
            flushPara();
            code = '';
            continue;
          }
          if (/^\s*\|/.test(line)) {
            flushPara();
            tableRows = [line];
            continue;
          }
          if (/^##\s+/.test(line)) {
            flushPara();
            out.push(React.createElement('h2', { key: nextKey() }, inlineDoc(line.replace(/^##\s+/, ''), 'i' + (seq++))));
            continue;
          }
          if (/^#\s+/.test(line)) {
            flushPara();
            out.push(React.createElement('h1', { key: nextKey() }, inlineDoc(line.replace(/^#\s+/, ''), 'i' + (seq++))));
            continue;
          }
          if (/^-\s+/.test(line)) {
            flushPara();
            out.push(React.createElement('div', { key: nextKey(), className: 'ux-doc-li' }, inlineDoc(line.replace(/^-\s+/, ''), 'i' + (seq++))));
            continue;
          }
          if (/^\s*$/.test(line)) {
            flushPara();
            continue;
          }
          para.push(line);
        }
        flushTable();
        flushCode();
        flushPara();
        if (out.length === 0) {
          out.push(React.createElement('p', { key: nextKey(), className: 'ux-doc-p' }, '（无内容）'));
        }
        return out;
      } catch (e) {
        // 解析失败退化：一整段 pre-wrap 文本
        return [React.createElement('pre', {
          key: 'ux-fallback',
          className: 'ux-doc-pre',
          style: { whiteSpace: 'pre-wrap', wordBreak: 'break-word' },
        }, String(text == null ? '' : text))];
      }
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
      const doing = rule ? rule.doing : '正在执行「' + name + '」';
      const done = rule ? rule.done : '「' + name + '」执行完毕';
      const argPlain = plainArgs(name, argsRaw);
      // 行文本：进行中带参数 → 「正在…」；已结算带参数 → 参数摘要；否则白话文案
      const plainLine = settled ? done : doing;
      const lineText = settled
        ? (argPlain ? argPlain : plainLine)
        : (argPlain ? '正在' + argPlain : plainLine);
      const statusIcon = !settled ? '●' : (isError ? '✕' : '✓');
      const statusCls = !settled ? 'running' : (isError ? 'err' : 'ok');
      const statusWord = !settled ? '进行中' : (isError ? '出错' : '已完成');
      const rowLabel = statusWord + '：' + lineText;
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

    // 从会话快照收集某 turn 内与本组相关的节点（tool-call 与
    // assistant-step，保持渲染顺序）；供 useSession 选择器使用。
    function collectTurnNodes(sn, turn) {
      if (!sn || !sn.chat) return EMPTY_NODES;
      var keys = sn.chat.locations.getTurn(turn);
      var out = [];
      for (var i = 0; i < keys.length; i++) {
        var n = sn.chat.nodes.get(keys[i]);
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

    // 正式回复锚点：已结算（finalNode 存在）且 blocks 含非空文本。
    function hasTextAssistant(data) {
      if (!data || !data.finalNode || !data.blocks) return false;
      for (var i = 0; i < data.blocks.length; i++) {
        var b = data.blocks[i];
        if (b && b.kind === 'text' && b.text && b.text.trim() !== '') return true;
      }
      return false;
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
    //   组 = 正式回复锚点之前的全部工具调用；无锚点（运行中/中断）时 =
    //   当前全部工具调用。当前节点不在组内（拿不到 turn / 锚点之后的
    //   调用）时退化为只含自己的单行组，保证每个工具节点恰好渲染一次。
    //   返回 { tools, thoughts, boundary }：tools 组内工具节点；
    //   thoughts 组内思考计数；boundary 当前节点是否为组的边界
    //   （组由组内最后一个工具节点的槽位渲染，其余节点渲染空）。
    function computeGroup(turnNodes, myNode) {
      var anchor = -1;
      var i, n;
      for (i = 0; i < turnNodes.length; i++) {
        n = turnNodes[i];
        if (n.kind === 'assistant-step' && hasTextAssistant(n.data)) anchor = i;
      }
      var tools = [];
      var thoughts = 0;
      for (i = 0; i < turnNodes.length; i++) {
        n = turnNodes[i];
        if (anchor !== -1 && i >= anchor) break;
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

    // 组状态汇总：任一调用运行中 → 运行中；有出错 → 有出错；否则已完成。
    function groupStatus(tools) {
      var running = 0;
      var err = 0;
      for (var i = 0; i < tools.length; i++) {
        var root = tools[i].data ? tools[i].data.root : null;
        if (!root) continue;
        if (root.kind === 'tool-result') { if (root.isError) err++; }
        else running++;
      }
      if (running > 0) return { icon: '●', cls: 'running', word: '运行中' };
      if (err > 0) return { icon: '✕', cls: 'err', word: '有出错' };
      return { icon: '✓', cls: 'ok', word: '已完成' };
    }

    // 工具根调用的 wire 名（供组内行兜底）。
    function rootName(root) {
      if (!root) return '';
      return root.kind === 'tool-result' ? (root.call ? root.call.name : '') : (root.name || '');
    }

    const inject = ['slots'];

    function apply(ctx) {
      const slots = ctx.slots;

      // ---- 状态（内存态，刷新回默认）----
      const store = {
        mode: 'native',      // native | simple
        hideComplex: true,   // 简化档：把复杂工具折叠成一行
        menuOpen: false,
        groupOpen: false,    // 简化档：折叠组的统计行开合（收起=一行统计，展开=面板）
        listeners: new Set(),
      };
      function notify() { store.listeners.forEach(function (fn) { fn(); }); }
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
      function toggleGroup() {
        store.groupOpen = !store.groupOpen;
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
      function useGroupOpen() {
        const [v, setLocal] = React.useState(store.groupOpen);
        React.useEffect(function () { return subscribe(function () { setLocal(store.groupOpen); }); }, []);
        return v;
      }

      // ---- 工具卡片（白话卡片，仅在简化档注册；原生档由产品原样渲染）----
      // 时间线行：行首类别图标 + 白话行文本 + 行尾状态图标；
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
            className: 'ux-card ux-simple',
            title: rowLabel,
            'aria-label': rowLabel,
            onClick: function () { setRevealed(true); setOpen(true); },
          },
            React.createElement('span', { className: 'ux-emoji' }, toolIcon(name)),
            React.createElement('span', { className: 'ux-plain' }, plainLine),
            React.createElement('span', {
              className: 'ux-fold',
              onClick: function (e) { e.stopPropagation(); setRevealed(true); setOpen(true); },
            }, '展开'),
          );
        }

        // 普通时间线行：整行点击切换详情面板
        return React.createElement('div', {
          className: 'ux-card ux-simple',
          title: rowLabel,
          'aria-label': rowLabel,
          onClick: function () { setOpen(!open); },
        },
          React.createElement('span', { className: 'ux-emoji' }, toolIcon(name)),
          React.createElement('span', { className: 'ux-plain' }, lineText),
          React.createElement('span', { className: 'ux-ico ' + statusCls, 'aria-hidden': true }, statusIcon),
          React.createElement('span', {
            className: 'ux-fold',
            onClick: function (e) { e.stopPropagation(); setOpen(!open); },
          }, open ? '收起 ▴' : '详情 ▾'),
          open ? React.createElement('div', {
            className: 'ux-detail',
            onClick: function (e) { e.stopPropagation(); },
          },
            React.createElement('div', { className: 'ux-doc' },
              React.createElement('div', { className: 'ux-doc-name' }, name),
              argPlain ? React.createElement('div', { className: 'ux-doc-args' }, argPlain) : null,
              (settled && text) ? React.createElement('div', { className: 'ux-doc-label' }, '结果：') : null,
              // 结果必须先脱敏再渲染成交付文档
              (settled && text) ? markdownDoc(redact(text)) : null,
            ),
          ) : null,
        );
      }

      // ---- 折叠组节点（仅简化档注册，替换产品 tool-call 树；原生档零注册）----
      // 总结档：正式回复之前的整串工具调用收成一行统计「N 个工具 · M 次思考」；
      // 中间档：点开统计行渲染文档化面板（标题区 + 清单区 + 说明区），
      //   每行复用 ToolCard 的行样式与文案规则（含 hideComplex 折叠），
      //   点单行展开该工具的 markdownDoc(redact(结果)) 详情。
      // 组由组内最后一个工具节点的槽位渲染（前面的工具节点渲染空，产品
      //   flowItem:empty 自动隐藏），保证每个工具节点只出现在一个组里一次；
      //   运行中、已完成、刷新重放三种情况都按同一规则归组。
      function ToolGroupNode(props) {
        const groupOpen = useGroupOpen();
        const node = props.node;
        const turn = turnOf(node.location);
        const turnNodes = useSession(
          function (sn) { return turn === null ? EMPTY_NODES : collectTurnNodes(sn, turn); },
          sameNodeRefs,
        );
        const group = computeGroup(turnNodes, node);
        if (!group.boundary) return null;
        const toolCount = group.tools.length;
        const countText = toolCount + ' 个工具' + (group.thoughts > 0 ? ' · ' + group.thoughts + ' 次思考' : '');
        const status = groupStatus(group.tools);
        if (!groupOpen) {
          // 总结档：一行统计，点击展开中间档面板
          return React.createElement('div', {
            className: 'ux-group ux-group-row',
            title: '本次工具调用：' + countText + '，点击展开',
            'aria-label': '本次工具调用：' + countText + '，点击展开',
            onClick: toggleGroup,
          },
            React.createElement('span', { className: 'ux-group-emoji', 'aria-hidden': true }, '🔧'),
            React.createElement('span', { className: 'ux-group-title' }, countText),
            React.createElement('span', { className: 'ux-group-status ' + status.cls, 'aria-hidden': true }, status.icon),
            React.createElement('span', { className: 'ux-group-caret' }, '展开 ▾'),
          );
        }
        // 中间档：文档化面板（标题区 + 清单区 + 说明区）
        return React.createElement('div', { className: 'ux-group ux-group-panel' },
          React.createElement('div', {
            className: 'ux-group-head',
            title: '点击收起',
            onClick: toggleGroup,
          },
            React.createElement('span', { className: 'ux-group-emoji', 'aria-hidden': true }, '🔧'),
            React.createElement('span', { className: 'ux-group-title' }, '本次调用 ' + countText),
            React.createElement('span', { className: 'ux-group-status ' + status.cls, 'aria-hidden': true }, status.icon),
            React.createElement('span', { className: 'ux-group-caret' }, '收起 ▴'),
          ),
          React.createElement('div', { className: 'ux-group-list' },
            group.tools.map(function (n) {
              var root = n.data ? n.data.root : null;
              return React.createElement(ToolCard, {
                key: n.key,
                block: root || {},
                toolName: rootName(root),
              });
            }),
          ),
          React.createElement('div', { className: 'ux-group-note' },
            '每行记录一次工具调用，点行可查看脱敏后的处理详情。',
          ),
        );
      }

      // ---- 悬浮入口定位：优先停在输入框左侧、与输入框底边对齐；
      // 放不下（窄窗口 / 侧栏展开）时移到输入框上方，绝不遮输入框。
      // 元素缺失时回退到固定位置。 ----
      function useFabPlacement() {
        const [pos, setPos] = React.useState({ left: 72, bottom: 96 });
        React.useEffect(function () {
          var raf = 0;
          function setPosIfChanged(left, bottom) {
            setPos(function (prev) {
              if (prev.left === left && prev.bottom === bottom) return prev;
              return { left: left, bottom: bottom };
            });
          }
          function measure() {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(function () {
              var overlay = document.querySelector('[data-shell-overlay]');
              var frame = overlay && overlay.parentElement;
              var sidebar = frame ? frame.firstElementChild : null;
              var sidebarW = sidebar ? sidebar.getBoundingClientRect().width : 56;
              var card = document.querySelector('[data-composer-card]');
              var FAB_W = 68, GAP = 12, EDGE = 16;
              if (!card) { setPosIfChanged(sidebarW + EDGE, 96); return; }
              var r = card.getBoundingClientRect();
              var left = r.left - FAB_W - GAP;
              if (left >= sidebarW + EDGE) {
                setPosIfChanged(left, EDGE);
              } else {
                setPosIfChanged(sidebarW + EDGE, Math.max(EDGE, window.innerHeight - r.top + GAP));
              }
            });
          }
          measure();
          window.addEventListener('resize', measure);
          var ro = new ResizeObserver(measure);
          var overlayEl = document.querySelector('[data-shell-overlay]');
          var frameEl = overlayEl && overlayEl.parentElement;
          if (frameEl && frameEl.firstElementChild) ro.observe(frameEl.firstElementChild);
          var mo = new MutationObserver(measure);
          mo.observe(document.body, { childList: true, subtree: true });
          return function () {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', measure);
            ro.disconnect();
            mo.disconnect();
          };
        }, []);
        return pos;
      }

      // ---- 左下角悬浮入口 + 二级菜单（两档 + 简化档选项）----
      function UxControl(props) {
        const mode = useMode();
        const hideComplex = useHideComplex();
        const open = useMenuOpen();
        const pos = useFabPlacement();
        const cur = mode === 'simple' ? '简化' : '原生';
        const items = [
          { key: 'simple', label: '简化', note: '术语白话，更易懂' },
          { key: 'native', label: '原生', note: '完整原生界面' },
        ];
        return React.createElement('div', { className: 'ux-root', style: { left: pos.left, bottom: pos.bottom } },
          React.createElement('button', {
            type: 'button',
            className: 'ux-fab' + (open ? ' open' : ''),
            title: '界面模式（当前：' + cur + '）',
            'aria-label': '界面模式（当前：' + cur + '）',
            onClick: toggleMenu,
          },
            cur,
            React.createElement('span', { className: 'ux-fab-caret' }, '▾'),
          ),
          open ? React.createElement('div', { className: 'ux-menu-backdrop', onClick: closeMenu }) : null,
          open ? React.createElement('div', { className: 'ux-menu', onClick: function (e) { e.stopPropagation(); } },
            React.createElement('div', { className: 'ux-menu-title' }, '界面模式'),
            items.map(function (it) {
              return React.createElement('button', {
                type: 'button',
                className: 'ux-menu-item' + (mode === it.key ? ' on' : ''),
                key: it.key,
                onClick: function () { setMode(it.key); closeMenu(); },
              },
                React.createElement('span', { className: 'ux-menu-check' }, mode === it.key ? '✓' : ''),
                React.createElement('span', { className: 'ux-menu-label' }, it.label),
                React.createElement('span', { className: 'ux-menu-note' }, it.note),
              );
            }),
            React.createElement('div', { className: 'ux-menu-divider' }),
            React.createElement('div', { className: 'ux-menu-title' }, '简化档选项'),
            React.createElement('button', {
              type: 'button',
              className: 'ux-menu-item',
              disabled: mode !== 'simple',
              onClick: function () { setHideComplex(!hideComplex); },
            },
              React.createElement('span', { className: 'ux-menu-check' }),
              React.createElement('span', { className: 'ux-menu-label' }, '隐藏复杂工具'),
              React.createElement('span', { className: 'ux-switch' + (hideComplex ? ' on' : '') }),
            ),
            React.createElement('div', { className: 'ux-menu-hint' },
              mode === 'simple'
                ? (hideComplex ? '高级操作折叠成一行，点「展开」可查看' : '高级操作与普通工具一样完整显示')
                : '原生模式始终完整显示，此选项不生效',
            ),
          ) : null,
        );
      }

      // ---- 样式 ----
      const css = [
        '.ux-root { position: fixed; z-index: 1001; pointer-events: auto; }',
        '.ux-fab { position:relative; z-index:2; display:flex; align-items:center; gap:5px; padding:5px 12px; font-size:12px; line-height:1.6; cursor:pointer; border:1px solid var(--dsw-alias-border-l2-darkmode-thin); background:var(--dsw-alias-button-floating-fill); color:var(--dsw-alias-label-primary); border-radius:999px; box-shadow:var(--dsw-shadow-lv2); pointer-events:auto; user-select:none; transition:background .15s, border-color .15s; }',
        '.ux-fab:hover, .ux-fab.open { background:var(--dsw-alias-button-floating-hover); border-color:var(--dsw-alias-border-l3); }',
        '.ux-fab.open { border-color:var(--dsw-alias-brand-primary); }',
        '.ux-fab-caret { font-size:9px; color:var(--dsw-alias-label-secondary); }',
        '.ux-menu-backdrop { position:fixed; inset:0; pointer-events:auto; }',
        '.ux-menu { position:absolute; left:0; bottom:calc(100% + 10px); z-index:3; min-width:240px; background:var(--dsw-alias-bg-overlay); border:1px solid var(--dsw-alias-border-l1); border-radius:12px; padding:8px; pointer-events:auto; box-shadow:var(--dsw-shadow-lv2); }',
        '.ux-menu-title { font-size:12px; color:var(--dsw-alias-label-secondary); margin-bottom:4px; padding:2px 6px; }',
        '.ux-menu-item { display:flex; align-items:center; gap:8px; width:100%; box-sizing:border-box; padding:7px 8px; border:none; background:transparent; cursor:pointer; border-radius:8px; text-align:left; }',
        '.ux-menu-item:hover { background:var(--dsw-alias-bg-layer-2); }',
        '.ux-menu-item.on { background:var(--dsw-alias-bg-layer-2); }',
        '.ux-menu-item:disabled { opacity:.55; cursor:default; }',
        '.ux-menu-check { width:14px; flex:0 0 auto; font-size:12px; color:var(--dsw-alias-brand-primary); }',
        '.ux-menu-label { font-size:13px; font-weight:600; color:var(--dsw-alias-label-primary); }',
        '.ux-menu-note { font-size:12px; color:var(--dsw-alias-label-secondary); }',
        '.ux-menu-hint { font-size:11px; color:var(--dsw-alias-label-secondary); padding:4px 8px 2px; line-height:1.5; }',
        '.ux-menu-divider { height:1px; background:var(--dsw-alias-border-l1); margin:6px 4px; }',
        '.ux-switch { position:relative; width:26px; height:15px; flex:0 0 auto; margin-left:auto; border-radius:999px; border:1px solid var(--dsw-alias-border-l1); background:var(--dsw-alias-bg-layer-2); transition:background .15s, border-color .15s; }',
        '.ux-switch::after { content:\'\'; position:absolute; top:2px; left:2px; width:9px; height:9px; border-radius:50%; background:var(--dsw-alias-label-secondary); transition:left .15s; }',
        '.ux-switch.on { background:var(--dsw-alias-brand-primary); border-color:var(--dsw-alias-brand-primary); }',
        '.ux-switch.on::after { left:13px; background:var(--dsw-alias-bg-overlay); }',
        '.ux-card { border:1px solid var(--dsw-alias-border-l1); border-radius:8px; padding:10px 12px; margin:6px 0; background:var(--dsw-alias-bg-layer-1); font-size:13px; }',
        // —— 简化档时间线行 ——
        '.ux-card.ux-simple { display:flex; flex-wrap:wrap; align-items:center; gap:8px; font-size:14px; border-radius:12px; padding:6px 10px; margin:6px 0; cursor:pointer; }',
        '.ux-emoji { font-size:14px; line-height:1; flex:0 0 auto; }',
        '.ux-plain { color:var(--dsw-alias-label-primary); flex:1 1 auto; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }',
        '.ux-ico { font-size:11px; line-height:1; font-weight:700; flex:0 0 auto; }',
        '.ux-ico.ok { color:var(--dsw-alias-state-success-primary); }',
        '.ux-ico.err { color:var(--dsw-alias-state-error-primary); }',
        '.ux-ico.running { color:var(--dsw-alias-state-warn-primary); }',
        '.ux-fold { color:var(--dsw-alias-label-secondary); font-size:12px; flex:0 0 auto; cursor:pointer; white-space:nowrap; }',
        '.ux-fold:hover { color:var(--dsw-alias-label-primary); }',
        // —— 详情面板（交付文档）——
        '.ux-detail { flex-basis:100%; max-height:420px; overflow:auto; margin-top:4px; background:var(--dsw-alias-bg-layer-2); border-radius:8px; padding:10px 12px; }',
        '.ux-doc-name { font-family:ui-monospace,SFMono-Regular,Consolas,monospace; font-size:11px; color:var(--dsw-alias-label-secondary); }',
        '.ux-doc-args { font-size:12px; color:var(--dsw-alias-label-primary); margin-top:4px; }',
        '.ux-doc-label { font-size:12px; font-weight:600; color:var(--dsw-alias-label-secondary); margin-top:8px; }',
        '.ux-doc-p { margin:6px 0; font-size:12px; line-height:1.6; color:var(--dsw-alias-label-primary); white-space:pre-wrap; word-break:break-word; }',
        '.ux-doc h1, .ux-doc h2 { margin:10px 0 4px; font-weight:700; color:var(--dsw-alias-brand-primary); line-height:1.4; }',
        '.ux-doc h1 { font-size:13px; }',
        '.ux-doc h2 { font-size:12px; }',
        '.ux-doc-table { border-collapse:collapse; width:100%; margin:8px 0; font-size:12px; color:var(--dsw-alias-label-primary); }',
        '.ux-doc-table th { border:1px solid var(--dsw-alias-border-l1); background:var(--dsw-alias-bg-layer-2); font-weight:700; padding:4px 8px; text-align:left; }',
        '.ux-doc-table td { border:1px solid var(--dsw-alias-border-l1); padding:4px 8px; }',
        '.ux-doc-table td:first-child { font-family:ui-monospace,SFMono-Regular,Consolas,monospace; }',
        '.ux-doc-pre { margin:8px 0; padding:8px; background:var(--dsw-alias-bg-layer-2); border:1px solid var(--dsw-alias-border-l1); border-radius:8px; font-family:ui-monospace,SFMono-Regular,Consolas,monospace; font-size:12px; line-height:1.5; color:var(--dsw-alias-label-primary); white-space:pre; overflow-x:auto; max-height:320px; }',
        '.ux-doc code { font-family:ui-monospace,SFMono-Regular,Consolas,monospace; font-size:11px; background:var(--dsw-alias-bg-layer-2); border-radius:4px; padding:1px 4px; color:var(--dsw-alias-label-secondary); }',
        '.ux-doc .ux-commit { font-family:ui-monospace,SFMono-Regular,Consolas,monospace; font-size:11px; background:var(--dsw-alias-bg-layer-2); border-radius:4px; padding:1px 4px; color:var(--dsw-alias-brand-primary); }',
        '.ux-doc-li { position:relative; margin:4px 0; padding-left:16px; font-size:12px; line-height:1.6; color:var(--dsw-alias-label-primary); }',
        '.ux-doc-li::before { content:\'•\'; position:absolute; left:2px; color:var(--dsw-alias-label-secondary); }',
        // —— 折叠组（总结档统计行 + 中间档面板）——
        '.ux-group-row { display:flex; align-items:center; gap:8px; padding:8px 12px; border:1px solid var(--dsw-alias-border-l1); border-radius:12px; background:var(--dsw-alias-bg-layer-1); cursor:pointer; box-shadow:var(--dsw-shadow-lv2); }',
        '.ux-group-row:hover { background:var(--dsw-alias-bg-layer-2); }',
        '.ux-group-emoji { font-size:14px; line-height:1; flex:0 0 auto; }',
        '.ux-group-title { color:var(--dsw-alias-label-primary); font-weight:600; flex:1 1 auto; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }',
        '.ux-group-status { font-size:11px; line-height:1; font-weight:700; flex:0 0 auto; }',
        '.ux-group-status.ok { color:var(--dsw-alias-state-success-primary); }',
        '.ux-group-status.err { color:var(--dsw-alias-state-error-primary); }',
        '.ux-group-status.running { color:var(--dsw-alias-state-warn-primary); }',
        '.ux-group-caret { color:var(--dsw-alias-label-secondary); font-size:12px; flex:0 0 auto; white-space:nowrap; }',
        '.ux-group-panel { border:1px solid var(--dsw-alias-border-l1); border-radius:12px; background:var(--dsw-alias-bg-layer-1); padding:8px 10px; box-shadow:var(--dsw-shadow-lv2); }',
        '.ux-group-head { display:flex; align-items:center; gap:8px; padding:4px 2px 6px; cursor:pointer; user-select:none; }',
        '.ux-group-list { display:flex; flex-direction:column; }',
        '.ux-group-list .ux-card { margin:4px 0; }',
        '.ux-group-note { font-size:11px; color:var(--dsw-alias-label-secondary); padding:6px 4px 2px; line-height:1.5; }',
      ].join('\n');

      ctx.effect(function () {
        if (typeof document === 'undefined') return;
        const tag = document.createElement('style');
        tag.dataset.plugin = 'dsh-ux-simple';
        tag.textContent = css;
        document.head.appendChild(tag);
        return function () { tag.remove(); };
      });

      // ---- 注册：左下角悬浮入口 + 二级菜单 ----
      slots.inject('shell.overlay', function () {
        return slots.register(
          { name: 'shell.overlay', id: 'ux-control', order: 100 },
          UxControl,
        );
      });

      // ---- 注册：白话卡片（仅简化档注册）----
      // 原生档 = 完全不接管：19 个工具全部交还产品原样渲染（含通用卡片）。
      // 简化档才注册白话卡片；模式切换时动态注册/注销，即时生效。
      slots.inject('tool.call.toolview', function* () {
        var disposers = {};
        function sync() {
          var simple = store.mode === 'simple';
          REGISTERED_TOOLS.forEach(function (tool) {
            var want = simple;
            var has = Object.prototype.hasOwnProperty.call(disposers, tool);
            if (want && !has) disposers[tool] = slots.register({ name: 'tool.call.toolview', key: tool }, ToolCard);
            if (!want && has) { disposers[tool](); delete disposers[tool]; }
          });
        }
        sync();
        yield subscribe(sync);   // 模式切换 → 同步注册状态
        yield function () {      // 声明消失 / 插件卸载：清理剩余注册
          Object.keys(disposers).forEach(function (k) { disposers[k](); });
          disposers = {};
        };
      });

      // ---- 注册：折叠组节点（仅简化档注册，替换产品 tool-call 树）----
      // 原生档不注册 → 产品 ToolCallTree 原样渲染（含通用卡片）；
      // 简化档注册 key='tool-call' 的节点渲染器，把正式回复之前的整串
      // 工具调用收成折叠组。与 tool.call.toolview 相同的 generator 注入
      // 模式，模式切换时动态注册/注销，即时生效。
      slots.inject('conversation.chat.node', function* () {
        var disposer = null;
        function sync() {
          var want = store.mode === 'simple';
          if (want && !disposer) disposer = slots.register({ name: 'conversation.chat.node', key: 'tool-call' }, ToolGroupNode);
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
