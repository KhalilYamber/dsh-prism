window.__ModuleLoader__.load({
  id: "dsh-ux-simple",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    const React = require("react");

    // ---- 工具白话说明（全部 33 个工具） ----
    const TOOL_PLAIN = {
      read_image: { doing: '正在读取一张图片', done: '图片读好了' },
      pwsh: { doing: '正在电脑上执行一条命令', done: '命令执行完毕' },
      read: { doing: '正在读取一个文件的内容', done: '文件读完了' },
      write: { doing: '正在创建或覆盖一个文件', done: '文件写好了' },
      edit: { doing: '正在修改文件里的某段文字', done: '修改完成' },
      glob: { doing: '正在按文件名规则查找文件', done: '查找完成' },
      grep: { doing: '正在文件内容里搜索关键词', done: '搜索完成' },
      web_search: { doing: '正在上网搜索信息', done: '搜索完成' },
      web_fetch: { doing: '正在抓取网页内容', done: '网页抓取完成' },
      todo_write: { doing: '正在更新任务清单', done: '任务清单已更新' },
      ask_user_question: { doing: '正在向您提问，等您回答', done: '等待您回答' },
      skill: { doing: '正在学习一项技能的使用说明', done: '技能已学会，可以继续了' },
      job_output: { doing: '正在读取后台任务的结果', done: '结果读取完成' },
      job_list: { doing: '正在列出后台任务', done: '任务列表已生成' },
      job_kill: { doing: '正在停止一个后台任务', done: '任务已停止' },
      get_goal: { doing: '正在读取当前目标', done: '目标已读取' },
      create_goal: { doing: '正在创建目标', done: '目标已创建' },
      update_goal: { doing: '正在更新目标', done: '目标已更新' },
      exit_plan_mode: { doing: '正在提交计划供您审阅', done: '计划已提交' },
      send_message: { doing: '正在给子代理发送消息', done: '消息已送达' },
      interrupt_agent: { doing: '正在打断子代理', done: '已请求打断' },
      list_agents: { doing: '正在列出子代理', done: '列表已生成' },
      subagent: { doing: '正在派一个子代理去干活', done: '子代理已派出' },
      subagent_fork: { doing: '正在派一个子代理继续当前工作', done: '子代理已派出' },
      workflow: { doing: '正在编排多个代理协作', done: '协作完成' },
      ralph: { doing: '正在循环迭代推进目标', done: '迭代完成' },
      cordis_inspect_list: { doing: '正在查看可用的插件能力', done: '能力清单已获取' },
      cordis_inspect_query: { doing: '正在查看某个接口的详细信息', done: '信息已获取' },
      cordis_inspect_self: { doing: '正在查看自身插件的状态', done: '状态已获取' },
      cordis_define: { doing: '正在定义一个插件', done: '插件已定义' },
      cordis_run: { doing: '正在启动一个插件', done: '插件已启动' },
      cordis_stop: { doing: '正在停用一个插件', done: '插件已停止' },
      cordis_undefine: { doing: '正在删除一个插件', done: '插件已删除' },
    };

    function shorten(s, n) {
      if (typeof s !== 'string') return '';
      return s.length > n ? s.slice(0, n) + '…' : s;
    }

    function basename(p) {
      if (typeof p !== 'string') return p;
      const parts = p.split(/[\\/]/);
      return parts[parts.length - 1] || p;
    }

    function plainArgs(toolName, argsRaw) {
      let args = null;
      if (argsRaw) { try { args = JSON.parse(argsRaw); } catch (e) { args = null; } }
      const str = (v) => (v && typeof v === 'string') ? v : '';
      switch (toolName) {
        case 'read': case 'write': case 'edit': {
          const p = str(args && args.file_path);
          const verb = toolName === 'read' ? '读取文件' : (toolName === 'write' ? '写入文件' : '修改文件');
          return p ? verb + '：' + basename(p) : verb;
        }
        case 'read_image': { const p = str(args && args.file_path); return p ? '读取图片：' + basename(p) : '读取图片'; }
        case 'glob': { const p = str(args && args.pattern); return p ? '按规则查找：' + p : '查找文件'; }
        case 'grep': { const p = str(args && args.pattern); return p ? '搜索内容：' + p : '搜索文件内容'; }
        case 'web_search': { const q = str(args && args.query); return q ? '搜索：' + q : '上网搜索'; }
        case 'web_fetch': { const u = str(args && args.url) || str(args && args.query); return u ? '抓取：' + u : '抓取网页'; }
        case 'skill': { const n = str(args && args.name); return n ? '学习技能：' + n : '学习一个技能'; }
        case 'todo_write': { const t = args && Array.isArray(args.todos) ? args.todos.length : 0; return '更新任务清单（' + t + ' 项）'; }
        case 'ask_user_question': { const t = args && Array.isArray(args.questions) ? args.questions.length : 0; return '向您提 ' + t + ' 个问题'; }
        case 'pwsh': { const c = str(args && args.command); return c ? '执行命令：' + shorten(c, 80) : '执行一条命令'; }
        case 'job_output': case 'job_kill': { const j = str(args && args.job_id); return j ? '后台任务：' + j : '操作后台任务'; }
        case 'create_goal': { const o = str(args && args.objective); return o ? '目标：' + shorten(o, 60) : '创建目标'; }
        case 'update_goal': { const a = str(args && args.action); return a ? '更新目标（' + a + '）' : '更新目标'; }
        case 'send_message': { const m = str(args && args.message); return m ? '发消息：' + shorten(m, 60) : '给子代理发消息'; }
        case 'interrupt_agent': { const a = str(args && args.agent_id); return a ? '打断子代理：' + a : '打断子代理'; }
        case 'subagent': case 'subagent_fork': { const d = str(args && args.description); return d ? '子代理任务：' + d : '派子代理干活'; }
        case 'ralph': { const o = str(args && args.objective); return o ? '目标：' + shorten(o, 60) : '循环迭代'; }
        case 'exit_plan_mode': { return '提交计划，等您审阅'; }
        case 'cordis_define': case 'cordis_run': case 'cordis_stop': case 'cordis_undefine': {
          const p = str(args && args.pluginId); return p ? '插件：' + p : '操作插件';
        }
        case 'cordis_inspect_query': {
          const p = str(args && args.provider); return p ? '查看接口：' + p : '查看接口详情';
        }
        default: return '';
      }
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

    const inject = ['slots'];

    function apply(ctx) {
      const slots = ctx.slots;

      // ---- 两档模式 + 菜单开合状态（内存态，刷新回原生） ----
      const store = {
        mode: 'native', // native | simple
        menuOpen: false,
        listeners: new Set(),
      };
      function notify() { store.listeners.forEach(function (fn) { fn(); }); }
      function setMode(m) {
        if (store.mode === m) return;
        store.mode = m;
        notify();
      }
      function toggleMenu() {
        store.menuOpen = !store.menuOpen;
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

      // ---- 工具卡片（两档：简化=白话，原生=完整） ----
      function ToolCard(props) {
        const mode = useMode();
        const isSimple = mode === 'simple';
        const block = props.block || {};
        const toolName = props.toolName || '';
        const settled = block.kind === 'tool-result';
        const name = settled ? (block.call ? block.call.name : toolName) : (block.name || toolName);
        const argsRaw = settled ? (block.call ? block.call.argsRaw : '') : (block.argsRaw || '');
        const isError = settled ? !!block.isError : false;
        const text = settled ? resultText(block) : '';
        const plain = TOOL_PLAIN[name] || { doing: '正在执行「' + name + '」', done: '「' + name + '」执行完毕' };
        const argPlain = plainArgs(name, argsRaw);
        const [open, setOpen] = React.useState(false);

        const dot = !settled ? 'running' : (isError ? 'err' : 'ok');
        const label = !settled ? '进行中' : (isError ? '出错了' : '完成');
        const plainLine = settled ? plain.done : plain.doing;
        const argLine = isSimple ? argPlain : (argsRaw ? '参数：' + shorten(argsRaw, 120) : '');
        const showPlain = isSimple;
        const resultLen = isSimple ? 100 : 400;
        const cardClass = 'ux-card' + (isSimple ? ' ux-simple' : '');

        return React.createElement('div', { className: cardClass },
          React.createElement('div', { className: 'ux-head' },
            React.createElement('span', { className: 'ux-dot ' + dot }),
            React.createElement('span', { className: 'ux-name' }, name),
            React.createElement('span', { className: 'ux-meta' }, label),
          ),
          showPlain ? React.createElement('div', { className: 'ux-plain' }, plainLine) : null,
          argLine ? React.createElement('div', { className: 'ux-meta' }, argLine) : null,
          (settled && text) ? React.createElement('div', { className: 'ux-result' }, shorten(text, resultLen)) : null,
          React.createElement('div', { className: 'ux-foldrow' },
            React.createElement('span', { className: 'ux-fold', onClick: function () { setOpen(!open); } }, open ? '收起细节 ▲' : '看细节 ▼'),
          ),
          open ? React.createElement('div', { className: 'ux-detail' },
            argsRaw ? '参数：\n' + argsRaw : null,
            (argsRaw && settled && text) ? '\n\n结果：\n' + text : (settled && text ? '结果：\n' + text : null),
          ) : null,
        );
      }

      // ---- 左下角悬浮入口 + 二级菜单（两档） ----
      function UxControl(props) {
        const mode = useMode();
        const open = useMenuOpen();
        const cur = mode === 'simple' ? '简化' : '原生';
        const items = [
          { key: 'simple', label: '简化', note: '术语白话，更易懂' },
          { key: 'native', label: '原生', note: '完整原生界面' },
        ];
        return React.createElement('div', null,
          React.createElement('button', {
            className: 'ux-fab' + (open ? ' open' : ''),
            title: '界面模式（当前：' + cur + '）',
            onClick: toggleMenu,
          }, '界面'),
          open ? React.createElement('div', { className: 'ux-menu-backdrop', onClick: closeMenu },
            React.createElement('div', { className: 'ux-menu', onClick: function (e) { e.stopPropagation(); } },
              React.createElement('div', { className: 'ux-menu-title' }, '界面模式'),
              items.map(function (it) {
                return React.createElement('button', {
                  className: 'ux-menu-item' + (mode === it.key ? ' on' : ''),
                  key: it.key,
                  onClick: function () { setMode(it.key); closeMenu(); },
                },
                  React.createElement('span', { className: 'ux-menu-label' }, it.label),
                  React.createElement('span', { className: 'ux-menu-note' }, it.note),
                );
              }),
            ),
          ) : null,
        );
      }

      // ---- 样式 ----
      const css = [
        '.ux-fab { position:fixed; left:76px; bottom:104px; z-index:1001; padding:4px 10px; font-size:12px; line-height:1.6; cursor:pointer; border:1px solid var(--dsw-alias-border-l1); background:var(--dsw-alias-bg-overlay); color:var(--dsw-alias-label-secondary); border-radius:8px; box-shadow:0 2px 10px rgba(0,0,0,0.22); pointer-events:auto; }',
        '.ux-fab:hover, .ux-fab.open { color:var(--dsw-alias-label-primary); border-color:var(--dsw-alias-brand-primary); }',
        '.ux-menu-backdrop { position:fixed; inset:0; z-index:1000; pointer-events:auto; }',
        '.ux-menu { position:fixed; left:76px; bottom:140px; z-index:1002; min-width:210px; background:var(--dsw-alias-bg-overlay); border:1px solid var(--dsw-alias-border-l1); border-radius:10px; padding:8px; pointer-events:auto; box-shadow:0 8px 30px rgba(0,0,0,0.28); }',
        '.ux-menu-title { font-size:12px; color:var(--dsw-alias-label-secondary); margin-bottom:6px; padding:0 6px; }',
        '.ux-menu-item { display:flex; align-items:baseline; gap:8px; width:100%; box-sizing:border-box; padding:7px 8px; border:none; background:transparent; cursor:pointer; border-radius:6px; text-align:left; }',
        '.ux-menu-item:hover { background:var(--dsw-alias-bg-layer-2); }',
        '.ux-menu-item.on { background:var(--dsw-alias-bg-layer-2); }',
        '.ux-menu-label { font-size:13px; font-weight:600; color:var(--dsw-alias-label-primary); }',
        '.ux-menu-note { font-size:12px; color:var(--dsw-alias-label-secondary); }',
        '.ux-card { border:1px solid var(--dsw-alias-border-l1); border-radius:8px; padding:10px 12px; margin:6px 0; background:var(--dsw-alias-bg-layer-1); font-size:13px; }',
        '.ux-card.ux-simple { font-size:14px; }',
        '.ux-head { display:flex; align-items:center; gap:8px; }',
        '.ux-dot { width:8px; height:8px; border-radius:50%; flex:0 0 auto; }',
        '.ux-dot.running { background:var(--dsw-alias-state-warn-primary); }',
        '.ux-dot.ok { background:var(--dsw-alias-state-success-primary); }',
        '.ux-dot.err { background:var(--dsw-alias-state-error-primary); }',
        '.ux-name { font-weight:600; color:var(--dsw-alias-label-primary); }',
        '.ux-plain { color:var(--dsw-alias-label-primary); margin-top:4px; }',
        '.ux-meta { color:var(--dsw-alias-label-secondary); font-size:12px; margin-top:2px; }',
        '.ux-result { margin-top:6px; color:var(--dsw-alias-label-primary); white-space:pre-wrap; word-break:break-word; }',
        '.ux-foldrow { margin-top:6px; }',
        '.ux-fold { color:var(--dsw-alias-label-secondary); font-size:12px; cursor:pointer; text-decoration:underline; }',
        '.ux-detail { margin-top:6px; white-space:pre-wrap; word-break:break-all; font-size:12px; color:var(--dsw-alias-label-secondary); background:var(--dsw-alias-bg-layer-2); border-radius:6px; padding:8px; max-height:260px; overflow:auto; }',
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

      // ---- 注册：全部工具的白话卡片 ----
      // 只接管「没有产品原生卡片」的工具（纯增量，不影响原生）；
      // 有原生卡片的 read/write/skill/web_search 等一律不碰，保持产品原版。
      const TOOLS = ['read_image', 'pwsh', 'job_output', 'job_list', 'job_kill', 'get_goal', 'create_goal', 'update_goal', 'exit_plan_mode', 'send_message', 'interrupt_agent', 'list_agents', 'subagent', 'subagent_fork', 'workflow', 'ralph', 'cordis_inspect_list', 'cordis_inspect_query', 'cordis_inspect_self'];
      TOOLS.forEach(function (tool) {
        slots.inject('tool.call.toolview', function () {
          return slots.register(
            { name: 'tool.call.toolview', key: tool },
            ToolCard,
          );
        });
      });
    }

    exports.apply = apply;
    exports.inject = inject;
    return module.exports;
  }
});
