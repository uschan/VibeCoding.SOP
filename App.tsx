import React, { useState, useRef } from 'react';
import { 
  BrainCircuit, 
  Layers, 
  GitCommit, 
  SearchCheck, 
  Wrench,
  ChevronRight,
  ShieldAlert,
  Terminal,
  Code2,
  ListChecks,
  ThumbsUp,
  ThumbsDown,
  ScrollText,
  ArchiveRestore,
  Globe
} from 'lucide-react';
import { SOPPhase, PhaseId } from './types';
import EntropyChart from './components/EntropyChart';
import PlannerTool from './components/PlannerTool';

// English Content
const phasesEn: SOPPhase[] = [
  {
    id: PhaseId.MANIFESTO,
    title: "Phase 0: The Mindset",
    subtitle: "Habits > Rules",
    icon: <BrainCircuit className="w-6 h-6" />,
    content: "We used to think a perfect 'System Prompt' with 15+ rules would save us. But as you realized: 'In actual development, good conversation habits and clear, explicit instructions are more important.' Rules are the Map; Habits are the Steering. If you don't actively enforce boundaries in every prompt, the AI will ignore your rules.",
    standardOps: [
      "The Mindset: Rules are not 'Set and Forget'. You must enforce them.",
      "The 5-Minute Rule: If a chat session loops on a bug for >5 mins, STOP. Do not argue. Restart.",
      "Explicit Instructions: Don't just say 'Fix it'. Say 'Fix it by modifying X, keeping Y constant, and explaining Z'.",
      "Ownership: You are not 'training' the AI; you are managing a chaotic intern."
    ],
    dos: [
      "Use static rules (like the 15-point list) as a baseline", 
      "Reinforce rules when the AI drifts",
      "Focus on 'One-Shot Compilation' habits"
    ],
    donts: [
      "Rely solely on a pre-prompt to control the whole session", 
      "Assume AI remembers rule #13 from 50 messages ago", 
      "Allow 'lazy code' (placeholders/snippets)"
    ],
    positiveExample: {
      type: 'text',
      content: "Habit:\n'You violated Rule #5 (One-shot compilation). The code you provided references a missing variable. Rewrite it to be self-contained and compile-ready.'",
      annotation: "Active enforcement of rules."
    },
    negativeExample: {
      type: 'text',
      content: "Habit:\n'The code is missing imports, but I'll just add them myself...'",
      annotation: "Passive acceptance. This trains the AI to be lazy."
    }
  },
  {
    id: PhaseId.DECOMPOSITION,
    title: "Phase 1: The Setup",
    subtitle: "Greenfield & Brownfield",
    icon: <Layers className="w-6 h-6" />,
    content: "A strong start defines the project. For new projects (Greenfield), define the 'Constitution'. For existing projects (Brownfield), you must first Map the Territory before you build. Never let AI touch legacy code without first extracting its 'Shape' (Types).",
    standardOps: [
      "New Project? -> Paste 'Golden System Instruction' + Ask for `types.ts`.",
      "Legacy Code? -> 'Reverse Engineer' first. Ask AI to read the old file and generate a clean `interface` that describes it.",
      "Define the Tech Stack explicitly.",
      "Do not write logic until the Contract (Types) is accepted."
    ],
    dos: ["Mandate 'One-Shot Compilation'", "Reverse-engineer types for legacy code", "Force 'Role Boundaries'"],
    donts: ["Start without a System Prompt", "Let AI guess how old code works", "Mix Refactoring with New Features"],
    positiveExample: {
      type: 'text',
      content: `Legacy Strategy:
"Read the file 'OldSpaghetti.js'.
1. Do NOT modify it yet.
2. Analyze it and generate a TypeScript interface 'IOldSpaghetti' that describes its props and state.
3. List its side effects."`,
      annotation: "Safe entry into legacy codebases."
    },
    negativeExample: {
      type: 'text',
      content: "Here is 'OldSpaghetti.js'. Add a dark mode toggle to it.",
      annotation: "High risk. AI will break hidden dependencies."
    }
  },
  {
    id: PhaseId.CONTEXT,
    title: "Phase 2: Context Hygiene",
    subtitle: "The Best Strategy: Stop & Restart",
    icon: <Terminal className="w-6 h-6" />,
    content: "The single best strategy when AI starts hallucinating is to STOP. Do not try to 'convince' it to fix the bug in a long thread. The context window is polluted. Close the tab. Open a new one. Provide the 'Context Payload' (current file + types) and restate the specific task.",
    standardOps: [
      "Deviation Detected? -> STOP. Do not debug inside a confused chat.",
      "Task Complete? -> CLOSE the chat. Don't carry baggage to the next task.",
      "The 'Context Payload': Always paste `types.ts` + the specific file you are working on.",
      "Re-state the Rules: 'Remember Rule #3: No placeholders.'"
    ],
    dos: ["Start new chats aggressively", "Paste clean context every time", "Use markdown to delimit code blocks"],
    donts: ["Argue with the AI for 10+ turns", "Paste backend code when styling frontend", "Trust AI's memory of previous chats"],
    positiveExample: {
      type: 'code',
      content: `(New Chat Session)
Context:
\`\`\`typescript
// types.ts content...
\`\`\`
System Reminder:
"Remember: One-shot compilation only. No placeholders."

Task: Add a 'isOnline' badge to the UserCard.`,
      annotation: "High signal-to-noise ratio with Rule Reinforcement."
    },
    negativeExample: {
      type: 'text',
      content: "(Message #42) ...No, you broke the layout again. Revert that. Wait, why is the import missing now?",
      annotation: "The 'Context Spiral of Death'. The AI is confused; you are frustrated."
    }
  },
  {
    id: PhaseId.ITERATION,
    title: "Phase 3: Atomic Iteration",
    subtitle: "The Golden Rule of Git",
    icon: <GitCommit className="w-6 h-6" />,
    content: "The Golden Rule: COMMIT your code before asking AI to change it. If the AI produces garbage (which it often does), you must be able to `git reset --hard` instantly. Never build new features on top of uncommitted, broken code.",
    standardOps: [
      "Git Commit BEFORE pasting code into AI.",
      "Select ONE small component or function (Atomic Unit).",
      "Feed the 'Context Payload'.",
      "Verify the result. If it fails, `git reset` and refine the prompt.",
      "Run Linter/Formatter on the generated code immediately."
    ],
    dos: ["Commit before prompting", "Implement happy-paths first", "Add error handling as a separate pass"],
    donts: ["Ask for Auth + Database + UI in one go", "Apply AI changes to dirty working trees"],
    positiveExample: {
      type: 'code',
      content: `Task: Implement the 'calculateTotal' function.
Input: \`CartItem[]\` interface.
Constraint: Handle empty arrays and negative prices. Returns number. Do not implement the UI yet.`,
      annotation: "Specific, isolated logic. Easy to verify unit test."
    },
    negativeExample: {
      type: 'text',
      content: "Create the shopping cart page with checkout stripe integration and email notifications.",
      annotation: "Too much. AI will hallucinate the Stripe API or simplify the cart logic."
    }
  },
  {
    id: PhaseId.REVIEW,
    title: "Phase 4: The Review Loop",
    subtitle: "Security & Logic Audit",
    icon: <SearchCheck className="w-6 h-6" />,
    content: "Treat every AI response as a Pull Request from a junior intern. AI loves to hardcode secrets and skip error handling. Your job is to catch their mistakes before they reach production.",
    standardOps: [
      "Security Scan: Did it hardcode an API Key? Did it skip Auth checks?",
      "Logic Check: Ask 'Why did you change this?' if unclear.",
      "Import Check: Are libraries actually installed?",
      "Refuse 'any' types or `@ts-ignore`."
    ],
    dos: ["Check for hardcoded secrets", "Verify error handling paths", "Ask for explanations on complex logic"],
    donts: ["Commit code with 'TODO: Fix later'", "Allow AI to invent new environment variables without documenting them"],
    positiveExample: {
      type: 'text',
      content: "REJECTED.\nYou hardcoded the API URL. Change this to use `process.env.API_URL` and update the `.env.example` file.",
      annotation: "Security-first review."
    },
    negativeExample: {
      type: 'text',
      content: "Looks good, I'll commit it.",
      annotation: "Blind trust. A security breach waiting to happen."
    }
  },
  {
    id: PhaseId.CLOSING,
    title: "Phase 5: The Closing Protocol",
    subtitle: "Docs, Polish, & Debt",
    icon: <ArchiveRestore className="w-6 h-6" />,
    content: "A feature isn't done when the code runs; it's done when it's maintainable. AI is excellent at writing documentation and cleaning up its own mess. Use the final phase to pay down the technical debt created during the sprint.",
    standardOps: [
      "Docs Update: Ask AI to 'Generate a markdown table explaining the new Env Vars'.",
      "Cleanup: Ask AI to 'Remove all console.logs and add JSDoc comments to exported functions'.",
      "Architecture Update: Update `ARCHITECTURE.md` if new modules were added.",
      "Final Test: Verify the build passes with strict linting."
    ],
    dos: ["Update README.md immediately", "Remove dead code/imports", "Document edge cases"],
    donts: ["Leave 'magic numbers' in code", "Forget to export new types", "Skip the documentation step"],
    positiveExample: {
      type: 'text',
      content: "Task: We finished the Auth module.\n1. Scan for any console.logs and remove them.\n2. 为 `login` 函数生成 JSDoc。\n3. Update the README 'Auth' section with the new flow.",
      annotation: "Professional closure. Leaves the campground cleaner than found."
    },
    negativeExample: {
      type: 'text',
      content: "It works! Moving to next task.",
      annotation: "Leaves tech debt. Future self will suffer."
    }
  },
  {
    id: PhaseId.TOOLKIT,
    title: "The Workshop",
    subtitle: "Interactive Planning",
    icon: <Wrench className="w-6 h-6" />,
    content: "The theory is good, but practice is better. Use this AI-powered planner to break down your specific feature requirements into the Vibe Coding phases.",
    standardOps: [],
    dos: [],
    donts: []
  }
];

// Chinese Content
const phasesZh: SOPPhase[] = [
  {
    id: PhaseId.MANIFESTO,
    title: "阶段 0：心法",
    subtitle: "习惯 > 规则",
    icon: <BrainCircuit className="w-6 h-6" />,
    content: "我们曾以为一套完美的包含15条规则的“系统提示词”就能拯救一切。但正如你所悟到的：“在实际开发中，良好的对话习惯和清晰明确的指令更重要。” 规则是地图，习惯是方向盘。如果你不主动在每一个提示词中确立边界，AI 就会无视你的规则。",
    standardOps: [
      "心态：规则不是“设完即忘”，必须强制执行。",
      "5分钟法则：如果在一个 Bug 上纠缠超过 5 分钟，停止。别争论，重启。",
      "明确指令：别只说“修复它”，要说“通过修改 X 来修复，保持 Y 不变，并解释 Z”。",
      "所有权：你不是在“训练”AI，你是在管理一个混乱的实习生。"
    ],
    dos: [
      "使用静态规则（如15条规则清单）作为基准", 
      "当 AI 跑偏时强制重申规则",
      "专注于“一次性编译通过”的习惯"
    ],
    donts: [
      "仅依赖预设 Prompt 来控制整个会话", 
      "假设 AI 还记得 50 条消息前的第 13 条规则", 
      "允许“懒惰代码”（占位符/代码片段）"
    ],
    positiveExample: {
      type: 'text',
      content: "习惯示例：\n'你违反了第 5 条规则（一次性编译）。你提供的代码引用了一个丢失的变量。重写它，使其包含所有依赖并能直接编译。'",
      annotation: "主动强制执行规则。"
    },
    negativeExample: {
      type: 'text',
      content: "习惯示例：\n'代码少了 import，不过没事，我自己加一下...'",
      annotation: "被动接受。这会训练 AI 变得懒惰。"
    }
  },
  {
    id: PhaseId.DECOMPOSITION,
    title: "阶段 1：立项",
    subtitle: "绿地与棕地",
    icon: <Layers className="w-6 h-6" />,
    content: "良好的开端定义了项目。对于新项目（绿地），定义“宪法”。对于现有项目（棕地），在构建之前必须先绘制领土。永远不要让 AI 在没有提取“形状”（Types）的情况下接触遗留代码。",
    standardOps: [
      "新项目？ -> 粘贴“黄金系统指令” + 索要 `types.ts`。",
      "旧代码？ -> 先“逆向工程”。让 AI 读取旧文件并生成一个清晰的 `interface` 来描述它。",
      "明确定义技术栈。",
      "在合同（Types）被接受之前，不要编写逻辑代码。"
    ],
    dos: ["强制“一次性编译”", "对旧代码进行类型逆向", "强制“角色边界”"],
    donts: ["在没有 System Prompt 的情况下开始", "让 AI 猜测旧代码如何工作", "将重构与新功能混合在一起"],
    positiveExample: {
      type: 'text',
      content: `旧代码策略：
"读取文件 'OldSpaghetti.js'。
1. 暂时不要修改它。
2. 分析它并生成一个 TypeScript 接口 'IOldSpaghetti' 来描述它的属性和状态。
3. 列出它的副作用。"`,
      annotation: "安全进入遗留代码库。"
    },
    negativeExample: {
      type: 'text',
      content: "这是 'OldSpaghetti.js'。给它加个暗黑模式开关。",
      annotation: "高风险。AI 会破坏隐藏的依赖关系。"
    }
  },
  {
    id: PhaseId.CONTEXT,
    title: "阶段 2：语境卫生",
    subtitle: "最佳策略：停止并重启",
    icon: <Terminal className="w-6 h-6" />,
    content: "当 AI 开始产生幻觉时，最好的策略就是停止。不要试图在长对话中“说服”它修复 Bug。上下文窗口已经被污染了。关闭标签页。打开一个新的。提供“上下文载荷”（当前文件 + 类型）并重述具体任务。",
    standardOps: [
      "发现跑偏？ -> 停止。不要在混乱的对话中调试。",
      "任务完成？ -> 关闭对话。不要把包袱带到下一个任务。",
      "“上下文载荷”：始终粘贴 `types.ts` + 你正在处理的具体文件。",
      "重述规则：'记住规则 #3：禁止占位符。'"
    ],
    dos: ["积极开启新对话", "每次都粘贴干净的上下文", "使用 Markdown 分隔代码块"],
    donts: ["与 AI 争论超过 10 轮", "在写前端样式时粘贴后端代码", "相信 AI 对之前对话的记忆"],
    positiveExample: {
      type: 'code',
      content: `(新会话)
上下文：
\`\`\`typescript
// types.ts 内容...
\`\`\`
系统提醒：
"记住：仅限一次性编译通过的代码。禁止占位符。"

任务：给 UserCard 添加一个 'isOnline' 徽章。`,
      annotation: "高信噪比 + 规则强化。"
    },
    negativeExample: {
      type: 'text',
      content: "(第 42 条消息) ...不，你又把布局搞坏了。回滚那个。等等，为什么 import 不见了？",
      annotation: "“上下文死亡螺旋”。AI 困惑了；你崩溃了。"
    }
  },
  {
    id: PhaseId.ITERATION,
    title: "阶段 3：原子迭代",
    subtitle: "Git 黄金法则",
    icon: <GitCommit className="w-6 h-6" />,
    content: "黄金法则：在让 AI 修改代码之前，先提交（COMMIT）。如果 AI 生成了垃圾（常有的事），你必须能立即 `git reset --hard`。永远不要在未提交、已破坏的代码之上构建新功能。",
    standardOps: [
      "粘贴代码给 AI 前先 Git Commit。",
      "选择一个小的组件或函数（原子单元）。",
      "投喂“上下文载荷”。",
      "验证结果。如果失败，`git reset` 并优化提示词。",
      "立即对生成的代码运行 Linter/Formatter。"
    ],
    dos: ["提问前先 Commit", "优先实现 Happy Path", "单独一轮做错误处理"],
    donts: ["一次性要求 Auth + 数据库 + UI", "在脏工作区应用 AI 变更"],
    positiveExample: {
      type: 'code',
      content: `任务：实现 'calculateTotal' 函数。
输入：\`CartItem[]\` 接口。
约束：处理空数组和负数价格。返回数字。暂不要实现 UI。`,
      annotation: "具体、隔离的逻辑。易于验证单元测试。"
    },
    negativeExample: {
      type: 'text',
      content: "创建购物车页面，包含结账 Stripe 集成和邮件通知。",
      annotation: "太多了。AI 会幻想 Stripe API 或简化购物车逻辑。"
    }
  },
  {
    id: PhaseId.REVIEW,
    title: "阶段 4：审查闭环",
    subtitle: "安全与逻辑审计",
    icon: <SearchCheck className="w-6 h-6" />,
    content: "把每一次 AI 的回复都当作初级实习生提交的 Pull Request。AI 喜欢硬编码密钥和跳过错误处理。你的工作是在它们进入生产环境之前抓住这些错误。",
    standardOps: [
      "安全扫描：有没有硬编码 API Key？有没有跳过 Auth 检查？",
      "逻辑检查：如果不清楚，问它“为什么改这里？”。",
      "导入检查：这些库真的安装了吗？",
      "拒绝 'any' 类型或 `@ts-ignore`。"
    ],
    dos: ["检查硬编码密钥", "验证错误处理路径", "要求解释复杂逻辑"],
    donts: ["提交带有 'TODO: Fix later' 的代码", "允许 AI 发明新的环境变量而不记录文档"],
    positiveExample: {
      type: 'text',
      content: "驳回。\n你硬编码了 API URL。改成使用 `process.env.API_URL` 并更新 `.env.example` 文件。",
      annotation: "安全第一的审查。"
    },
    negativeExample: {
      type: 'text',
      content: "看着不错，我提交了。",
      annotation: "盲目信任。安全漏洞的温床。"
    }
  },
  {
    id: PhaseId.CLOSING,
    title: "阶段 5：收尾协议",
    subtitle: "文档、打磨与债",
    icon: <ArchiveRestore className="w-6 h-6" />,
    content: "代码能跑不代表功能完成；可维护才算完成。AI 非常擅长编写文档和清理它自己留下的烂摊子。利用最后阶段来偿还冲刺期间产生的技术债务。",
    standardOps: [
      "文档更新：让 AI “生成一个 Markdown 表格解释新的 Env 变量”。",
      "清理：让 AI “删除所有 console.log 并给导出函数添加 JSDoc 注释”。",
      "架构更新：如果添加了新模块，更新 `ARCHITECTURE.md`。",
      "最终测试：验证构建是否通过严格的 Lint。"
    ],
    dos: ["立即更新 README.md", "删除死代码/导入", "记录边界情况"],
    donts: ["在代码中留下“魔术数字”", "忘记导出新类型", "跳过文档步骤"],
    positiveExample: {
      type: 'text',
      content: "任务：我们完成了 Auth 模块。\n1. 扫描并删除所有 console.log。\n2. 为 `login` 函数生成 JSDoc。\n3. 更新 README 的 'Auth' 章节，说明新流程。",
      annotation: "专业的收尾。离开时比来时更干净。"
    },
    negativeExample: {
      type: 'text',
      content: "能跑了！做下一个任务去。",
      annotation: "留下技术债。未来的你会遭殃。"
    }
  },
  {
    id: PhaseId.TOOLKIT,
    title: "工作坊",
    subtitle: "交互式规划",
    icon: <Wrench className="w-6 h-6" />,
    content: "理论虽好，实践更佳。使用这个 AI 驱动的规划器，将你的具体功能需求拆解为符合 Vibe Coding 阶段的执行计划。",
    standardOps: [],
    dos: [],
    donts: []
  }
];

export default function App() {
  const [activePhase, setActivePhase] = useState<PhaseId>(PhaseId.MANIFESTO);
  const [lang, setLang] = useState<'en' | 'zh'>('en');
  const contentRef = useRef<HTMLElement>(null);

  const phases = lang === 'en' ? phasesEn : phasesZh;
  const currentPhaseData = phases.find(p => p.id === activePhase);

  const t = {
    nav: lang === 'en' ? 'Navigation' : '导航',
    standardOps: lang === 'en' ? 'Standard Operating Procedure' : '标准作业程序 (SOP)',
    dos: lang === 'en' ? 'Quick Dos' : '做 (Dos)',
    donts: lang === 'en' ? 'Quick Donts' : '别做 (Donts)',
    currentPhase: lang === 'en' ? 'Current Phase' : '当前阶段'
  };

  const handlePhaseChange = (id: PhaseId) => {
    setActivePhase(id);
    // On mobile, scroll to content after selection
    if (window.innerWidth < 1024 && contentRef.current) {
       // Small timeout to allow render
       setTimeout(() => {
         contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
       }, 50);
    }
  };

  return (
    <div className="min-h-screen bg-vibe-dark text-vibe-text font-sans selection:bg-vibe-accent selection:text-white pb-20">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-vibe-dark/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="w-6 h-6 text-vibe-accent" />
            <span className="font-mono font-bold tracking-tight text-lg">VibeCoding<span className="text-vibe-accent">.SOP</span></span>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setLang(l => l === 'en' ? 'zh' : 'en')}
              className="flex items-center gap-2 text-xs font-mono text-vibe-muted hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-full border border-white/10"
            >
              <Globe className="w-3 h-3" />
              {lang === 'en' ? 'CN' : 'EN'}
            </button>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noreferrer" 
              className="text-xs font-mono text-vibe-muted hover:text-white transition-colors border border-white/10 px-3 py-1 rounded-full hidden sm:block"
            >
              v1.6.0
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar Navigation */}
        <aside className="lg:col-span-4 lg:sticky lg:top-24 h-fit space-y-2">
          <div className="glass-panel rounded-xl p-4 mb-6">
             <div className="text-xs font-bold text-vibe-muted uppercase tracking-wider mb-3 ml-2">{t.nav}</div>
             {phases.map((phase) => (
               <button
                 key={phase.id}
                 onClick={() => handlePhaseChange(phase.id)}
                 className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all duration-200 group relative overflow-hidden ${
                   activePhase === phase.id 
                     ? 'bg-vibe-accent/10 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] border border-vibe-accent/50' 
                     : 'text-slate-400 hover:bg-white/5 hover:text-white'
                 }`}
               >
                 <div className={`transition-colors duration-200 ${activePhase === phase.id ? 'text-vibe-accent' : 'text-slate-500 group-hover:text-slate-300'}`}>
                   {phase.icon}
                 </div>
                 <div className="flex-1">
                   <div className="font-semibold text-sm">{phase.title}</div>
                   <div className="text-[10px] opacity-70 truncate max-w-[180px]">{phase.subtitle}</div>
                 </div>
                 {activePhase === phase.id && <ChevronRight className="w-4 h-4 text-vibe-accent animate-pulse" />}
               </button>
             ))}
          </div>
          
          <div className="hidden lg:block">
            <EntropyChart />
          </div>
        </aside>

        {/* Active Content Area */}
        <section ref={contentRef} className="lg:col-span-8 space-y-6 scroll-mt-28">
          
          {/* Header Card */}
          <div className="glass-panel p-8 rounded-2xl border-l-4 border-l-vibe-accent relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-vibe-accent/20 blur-3xl rounded-full pointer-events-none"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2 text-vibe-accent font-mono text-sm uppercase tracking-widest">
                {currentPhaseData?.icon}
                <span>{t.currentPhase}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {currentPhaseData?.title}
              </h1>
              <p className="text-xl text-slate-300 font-light">
                {currentPhaseData?.subtitle}
              </p>
            </div>
          </div>

          {/* Content Body */}
          <div className="space-y-8 animate-in fade-in duration-500">
            {activePhase !== PhaseId.TOOLKIT ? (
              <>
                {/* Main Theory */}
                <div className="prose prose-invert prose-lg max-w-none text-slate-300 leading-relaxed">
                  <p>{currentPhaseData?.content}</p>
                </div>

                {/* Standard Operating Procedure (New Section) */}
                {currentPhaseData?.standardOps && (
                  <div className="bg-slate-900/40 rounded-xl p-6 border border-slate-700">
                    <h3 className="flex items-center gap-2 text-white font-bold mb-6 text-lg">
                      <ListChecks className="w-5 h-5 text-vibe-accent" /> 
                      {t.standardOps}
                    </h3>
                    <div className="space-y-4">
                      {currentPhaseData.standardOps.map((step, idx) => (
                        <div key={idx} className="flex gap-4">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center font-mono text-sm text-vibe-accent font-bold">
                            {idx + 1}
                          </div>
                          <p className="pt-1 text-slate-300 text-sm leading-relaxed">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Examples Section (New Section) */}
                {(currentPhaseData?.positiveExample || currentPhaseData?.negativeExample) && (
                   <div className="grid md:grid-cols-2 gap-6">
                      {/* Negative Example */}
                      {currentPhaseData.negativeExample && (
                        <div className="flex flex-col h-full bg-red-950/10 border border-red-500/20 rounded-xl overflow-hidden">
                          <div className="p-4 border-b border-red-500/20 bg-red-950/20 flex items-center gap-2">
                            <ThumbsDown className="w-4 h-4 text-red-400" />
                            <span className="text-red-400 font-bold text-xs uppercase tracking-wider">The Chaos Prompt</span>
                          </div>
                          <div className="p-4 flex-grow font-mono text-xs text-slate-400 whitespace-pre-wrap">
                            {currentPhaseData.negativeExample.content}
                          </div>
                          <div className="p-3 bg-red-950/30 text-xs text-red-300 border-t border-red-500/20 italic">
                            "{currentPhaseData.negativeExample.annotation}"
                          </div>
                        </div>
                      )}

                      {/* Positive Example */}
                      {currentPhaseData.positiveExample && (
                        <div className="flex flex-col h-full bg-emerald-950/10 border border-emerald-500/20 rounded-xl overflow-hidden">
                          <div className="p-4 border-b border-emerald-500/20 bg-emerald-950/20 flex items-center gap-2">
                            {currentPhaseData.title.includes("Setup") || currentPhaseData.title.includes("立项") ? <ScrollText className="w-4 h-4 text-emerald-400" /> : <ThumbsUp className="w-4 h-4 text-emerald-400" />}
                            <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider">
                              {currentPhaseData.title.includes("Setup") || currentPhaseData.title.includes("立项") ? "The Golden Template" : "The Vibe Prompt"}
                            </span>
                          </div>
                          <div className="p-4 flex-grow font-mono text-xs text-emerald-300 whitespace-pre-wrap bg-black/20">
                            {currentPhaseData.positiveExample.content}
                          </div>
                          <div className="p-3 bg-emerald-950/30 text-xs text-emerald-300 border-t border-emerald-500/20 italic">
                            "{currentPhaseData.positiveExample.annotation}"
                          </div>
                        </div>
                      )}
                   </div>
                )}

                {/* Quick Dos and Donts */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* DOs */}
                  <div className="bg-emerald-900/5 border border-emerald-500/10 rounded-xl p-6">
                    <h3 className="flex items-center gap-2 text-emerald-500 font-bold mb-4 uppercase text-xs tracking-wider">
                      {t.dos}
                    </h3>
                    <ul className="space-y-3">
                      {currentPhaseData?.dos.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-slate-400">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* DON'Ts */}
                  <div className="bg-red-900/5 border border-red-500/10 rounded-xl p-6">
                    <h3 className="flex items-center gap-2 text-red-500 font-bold mb-4 uppercase text-xs tracking-wider">
                      {t.donts}
                    </h3>
                    <ul className="space-y-3">
                      {currentPhaseData?.donts.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-slate-400">
                          <ShieldAlert className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            ) : (
              <PlannerTool lang={lang} />
            )}
            
            {/* Mobile Chart for context */}
            <div className="lg:hidden mt-8">
              <EntropyChart />
            </div>
          </div>

        </section>
      </main>
    </div>
  );
}

function CheckCircle2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}