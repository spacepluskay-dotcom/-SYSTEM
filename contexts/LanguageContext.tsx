
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: any;
}

const translations = {
  en: {
    nav: {
      items: {
        system: 'SYSTEM',
        engineering: 'ENGINEERING',
        entertainment: 'ENTERTAINMENT',
        ai: 'AI ENGINE',
        projects: 'ARTIFACTS',
        founder: 'FOUNDER',
        work: 'COLLABORATE'
      },
      status: 'SYS_STATUS',
      online: 'ONLINE'
    },
    projects: {
      label: 'DEPLOYED NODES',
      title: 'Operational Artifacts',
      lede: 'Real-world deployment of the Ø SYSTEM architecture. These H5 artifacts demonstrate our ability to engineer high-frequency entertainment interfaces.',
      items: [
        {
          id: 'NODE_01',
          name: 'PartyCraft OS',
          type: 'CORE_PLATFORM',
          desc: 'A universal engine for event lifecycle management. Integrating ticketing, social dynamics, and on-site interaction.',
          url: 'https://www.partycraft.app/',
          screenshot: 'https://images.unsplash.com/photo-1514525253361-bee8718a74a2?q=80&w=1000&auto=format&fit=crop',
          tech: ['Web3', 'Real-time Sync', 'H5 Game Eng.']
        },
        {
          id: 'NODE_02',
          name: 'ClubLink',
          type: 'CONVERSION_PROTOCOL',
          desc: 'High-performance link-in-bio optimized for nightlife operators. Converting social signals into verified guestlist entries.',
          url: 'https://partycraft.app/clublink/',
          screenshot: 'https://images.unsplash.com/photo-1566737236500-c8ac40014582?q=80&w=1000&auto=format&fit=crop',
          tech: ['Conversion Logic', 'Dynamic Routing']
        },
        {
          id: 'NODE_03',
          name: 'SpacePlus Worldwide',
          type: 'SPATIAL_INTERFACE',
          desc: 'The digital twin of a global nightclub brand. Immersive mobile-first exploration and VIP reservation engine.',
          url: 'https://spaceplusworldwide.club/',
          screenshot: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000&auto=format&fit=crop',
          tech: ['Immersive UI', 'Spatial Logic']
        },
        {
          id: 'NODE_04',
          name: 'AAA Access',
          type: 'ACCESS_GATEWAY',
          desc: 'Global membership and identity protocol for high-net-worth entertainment circles.',
          url: 'https://alwaysaccessall.web.app/',
          screenshot: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1000&auto=format&fit=crop',
          tech: ['Identity Auth', 'Encrypted Gateway']
        }
      ]
    },
    boot: { init: 'SYSTEM INITIALIZED', artifact: 'BRAND & AI ENGINEERING ARTIFACT', loading: 'LOADING MODULES...' },
    system: { label: 'SYSTEM ARCHITECTURE', title: 'Ø SYSTEM', lede: 'We do not build "brands". We engineer systems.\nØ SYSTEM is a cohesive infrastructure integrating brand strategy, entertainment logic, and artificial intelligence.', index_title: '[ SYSTEM INDEX ]', modules: [{ id: '01', name: 'Ø CORE', desc: 'Central Processing & Brand Strategy' }, { id: '02', name: 'Ø ENT', desc: 'Entertainment Logic Engineering', signal: 'BPM: 128 | DENSITY: HIGH' }, { id: '03', name: 'Ø AI', desc: 'Generative Intelligence Engine' }, { id: '04', name: 'Ø RUN', desc: 'Operational Execution Protocols' }, { id: '05', name: 'Ø SCALE', desc: 'Growth & Replication Systems' }] },
    engineering: { label: 'METHODOLOGY', title: 'Brand Engineering', lede: 'Applying engineering principles to the abstract art of brand building. Replacing guesswork with logic, structure, and scalable mechanisms.', blocks: [{ title: 'Structure', content: 'A brand is not a logo. It is a container of meaning. We build the container first, ensuring it can hold the weight of future scale.', usage: { apply: 'Foundation phase', avoid: 'Rapid prototyping' }, failure: 'System collapse under scale.' }, { title: 'Logic', content: 'Every creative decision must pass a logic gate. Why this color? Why this tone? If it cannot be explained, it is discarded.', usage: { apply: 'Decision making', avoid: 'Blue-sky ideation' }, failure: 'Subjective incoherence.' }, { title: 'Mechanism', content: 'We build self-sustaining loops. Content engines, community feedback loops, and automated growth triggers.', usage: { apply: 'Retention systems', avoid: 'One-off events' }, failure: 'High churn / Stagnation.' }, { title: 'Intelligence', content: 'Integrating AI not as a tool, but as a core team member. Data-driven insights informing every creative output.', usage: { apply: 'Pattern recognition', avoid: 'Human empathy replacement' }, failure: 'Generic / Hallucinated output.' }], manifesto: { label: 'ENGINEERING MANIFESTO', items: ['> We reject "vibes" without foundation.', '> We value systems over one-off campaigns.', '> We build assets that compound in value.', '> We believe specific is universal.'] } },
    entertainment: { label: 'VERTICAL DOMAIN', title: 'Entertainment Engineering', lede: 'Entertainment Engineering\nDecoding the physics of fun.\nWe treat fun as a system of controllable variables — not chaos, not inspiration.', formula: 'FUN = RHYTHM × DENSITY × SOCIAL_GRAVITY', formula_annotation: 'Rhythm: Temporal Pacing | Density: Information/Stimulus | Gravity: Attraction Force', pipeline_label: 'EXPERIENCE STACK_V1.0', console: { label: 'VARIABLES & MODES', modes: ['CLUB', 'FESTIVAL', 'BRAND_LAUNCH'], variables: [{ name: 'BPM', min: '90', max: '130' }, { name: 'DENSITY', levels: ['LOW', 'MID', 'HIGH'] }, { name: 'SOC_GRAVITY', levels: ['WEAK', 'BAL', 'STR'] }, { name: 'RITUAL_INT', levels: ['SOFT', 'STD', 'EXT'] }] }, sections: [{ code: 'ENT_01', title: 'Experience Engineering', objective: 'Design reproducible experience structures.', desc: 'Architecting the user journey from entry to exit. Managing sensory inputs, flow density, and emotional peaks.', controlled_variables: ['BPM', 'Density', 'Ritual'], risk_threshold: 'Sensory Overload / Bottlenecks', stack_map: 'ENTRY > IMMERSION > EXIT', metrics: [{ label: 'FLOW', type: 'flow', value: 3 }, { label: 'FRICTION', type: 'flow', value: 1 }] }, { code: 'ENT_02', title: 'Lifestyle Systems', objective: 'Integrate entertainment into daily behavior loops.', desc: 'Embedding brands into daily consumer rituals. Creating products that become habits, not just purchases.', controlled_variables: ['Frequency', 'Return Rate', 'Habit Loop'], risk_threshold: 'User Fatigue / Irrelevance', stack_map: 'DAILY > HABIT > LOYALTY', metrics: [{ label: 'RETENTION', type: 'rhythm', value: 'high' }] }, { code: 'ENT_03', title: 'Social Gravity Design', objective: 'Engineer gathering, dispersion, and return mechanics.', desc: 'Designing interaction protocols that encourage sharing, belonging, and advocacy.', controlled_variables: ['Entry Rate', 'Clustering', 'Exit Timing'], risk_threshold: 'Community Toxicity', stack_map: 'SIGNAL > GATHER > RETURN', metrics: [{ label: 'GRAVITY', type: 'gravity', value: 'high' }] }, { code: 'ENT_04', title: 'Ritual & Memory Architecture', objective: 'Create nodes that can be remembered and retold.', desc: 'Taking niche cultural signals and engineering them for mass adoption without losing authenticity.', controlled_variables: ['Peak Timing', 'Symbol', 'Release'], risk_threshold: 'Loss of Authenticity (Cringe)', stack_map: 'TRIGGER > RITUAL > MEMORY', metrics: [{ label: 'SCALE', type: 'rhythm', value: 'med' }] }], commercial: { label: "COMMERCIAL BINDING", title: "System Deployment", lede: "We don't sell creativity. We deploy entertainment systems.", matrix_header: { module: "MODULE", types: "APPLICABLE_PROJECTS", output: "DELIVERABLE" }, matrix: [{ id: "ENT_01", title: "Experience Eng.", types: ["Nightclub", "Bar", "Pop-up"], output: "Flow Struct / Energy Curve" }, { id: "ENT_02", title: "Lifestyle Systems", types: ["Brand IP", "City Nightlife", "Membership"], output: "Habit Loop / Freq Model" }, { id: "ENT_03", title: "Social Gravity", types: ["High-Density Club", "Festival", "Social Brand"], output: "Cluster Mech / Return Loop" }, { id: "ENT_04", title: "Ritual Arch.", types: ["Brand Launch", "Private Gala", "PR Event"], output: "Memory Anchor / Release" }], models: [{ title: "SYSTEM BUILD", type: "BUILD", desc: "Build once, run many times.", fit: "First-time Setup / 0-to-1" }, { title: "SYSTEM RUN", type: "RUN", desc: "We stay in the loop.", fit: "Long-term Ops / Optimization" }, { title: "SYSTEM LICENSE", type: "LICENSE", desc: "We engineer, you scale.", fit: "Group Scale / Multi-venue" }] }, footer_note: 'Chaos is not freedom.\nUncontrolled fun is a design failure.' },
    ai: { label: 'INTELLIGENCE LAYER', title: 'AI Engine', lede: 'We do not just use AI tools. We build custom models trained on brand-specific datasets to ensure consistency and speed.', real_time_inputs: { label: 'REAL-TIME SIGNAL INPUTS', items: ['CROWD DENSITY', 'ENTRY RATE', 'DWELL TIME', 'SENTIMENT PULSE'] }, feedback_loop: { title: 'ENTERTAINMENT SIGNAL FEEDBACK LOOP', steps: ['SIGNAL INPUT', 'AI PROCESSING', 'AMBIENT TUNING'] }, process: { input: { title: 'DATA INGESTION', desc: 'Market Trends\nCustomer Feedback' }, core: { title: 'Ø CORE MODEL', desc: 'Brand Voice Tuning\nStrategic Reasoning' }, output: { title: 'DEPLOYMENT', desc: 'Automated Content\nDynamic Responses' } }, modules: [{ name: 'BRAND VOICE MODEL', desc: 'Fine-tuned LLMs that speak exactly like your brand.' }, { name: 'NIGHTLIFE INTELLIGENCE', desc: 'Predictive models for venue capacity and trends.' }, { name: 'CONTENT AGENT', desc: 'Autonomous agents for social content.' }, { name: 'FOUNDER COPILOT', desc: 'Strategic decision support system.' }] },
    founder: { label: 'SYSTEM ARCHITECT', title: "Engineer's Statement", content: [{ bold: 'I believe branding is broken.', text: ' It has become an industry of decoration, not function. Agencies sell visuals; we build systems.' }, { bold: 'Creativity needs constraints.', text: ' Ø SYSTEM was founded on a simple premise: structure enables scale.' }, { bold: 'Engineering the intangible.', text: ' In entertainment, "vibes" are actually variables: rhythm, density, and social gravity. We just give them names and control them.' }, { bold: 'From Chaos to Order.', text: ' My background spans nightlife, technology, and design. In every field, I saw the same pattern: great ideas failing due to lack of structural integrity.' }, { bold: 'The Role.', text: ' I am not just a designer. I am an engineer of experience.' }], quote: '"A system that cannot run without its founder is not a business. It is a job."', role: 'Principal Architect' },
    work: { label: 'PROTOCOL', title: 'Initialize Partnership', lede: 'If your parameters align with our system capabilities, initiate contact. We accept limited partnerships per cycle.', targets: { label: 'TARGET_PROFILE', items: ['Visionaries scaling complex brands', 'Founders valuing logic over trend', 'Systems seeking AI integration'] }, anti_targets: { label: 'ANTI_PROFILE', items: ['Seeking "quick logo refresh"', 'Micro-management without trust', 'Unwilling to invest in infrastructure'] }, cta: 'INITIATE INQUIRY', meta: 'RESPONSE_TIME: ~24 HOURS' }
  },
  cn: {
    nav: {
      items: {
        system: '系统',
        engineering: '工程',
        entertainment: '娱乐',
        ai: 'AI 引擎',
        projects: '作品节点',
        founder: '创始人',
        work: '合作接入'
      },
      status: '系统状态',
      online: '运行中'
    },
    projects: {
      label: '已部署节点',
      title: '运行产物',
      lede: 'Ø SYSTEM 架构的真实部署案例。这些 H5 产物展示了我们工程化高频娱乐界面的能力。',
      items: [
        {
          id: 'NODE_01',
          name: 'PartyCraft 操作系统',
          type: '核心平台',
          desc: '活动全周期管理引擎。整合票务、社交动态与场内互动。',
          url: 'https://www.partycraft.app/',
          screenshot: 'https://images.unsplash.com/photo-1514525253361-bee8718a74a2?q=80&w=1000&auto=format&fit=crop',
          tech: ['Web3', '实时同步', 'H5 游戏引擎']
        },
        {
          id: 'NODE_02',
          name: 'ClubLink',
          type: '转化协议',
          desc: '针对夜生活运营商优化的聚合链接。将社交信号转化为验证后的卡座预订。',
          url: 'https://partycraft.app/clublink/',
          screenshot: 'https://images.unsplash.com/photo-1566737236500-c8ac40014582?q=80&w=1000&auto=format&fit=crop',
          tech: ['转化逻辑', '动态路由']
        },
        {
          id: 'NODE_03',
          name: 'SpacePlus 全球官网',
          type: '空间交互界面',
          desc: '全球夜店品牌的数字孪生。沉浸式移动优先探索与 VIP 预订引擎。',
          url: 'https://spaceplusworldwide.club/',
          screenshot: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000&auto=format&fit=crop',
          tech: ['沉浸式 UI', '空间逻辑']
        },
        {
          id: 'NODE_04',
          name: 'AAA 准入系统',
          type: '准入网关',
          desc: '针对高净值娱乐圈层的全球会员与身份识别协议。',
          url: 'https://alwaysaccessall.web.app/',
          screenshot: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1000&auto=format&fit=crop',
          tech: ['身份认证', '加密网关']
        }
      ]
    },
    boot: { init: '系统已初始化', artifact: '品牌与人工智能工程产物', loading: '模块加载中...' },
    system: { label: '系统架构', title: 'Ø SYSTEM', lede: '我们不构建“品牌”，我们工程化系统。\nØ SYSTEM 是一个融合品牌战略、娱乐逻辑和人工智能的综合基础设施。', index_title: '[ 系统索引 ]', modules: [{ id: '01', name: 'Ø CORE', desc: '中央处理与品牌战略' }, { id: '02', name: 'Ø ENT', desc: '娱乐逻辑工程', signal: 'BPM: 128 | 密度: 高' }, { id: '03', name: 'Ø AI', desc: '生成式智能引擎' }, { id: '04', name: 'Ø RUN', desc: '运营执行协议' }, { id: '05', name: 'Ø SCALE', desc: '增长与复制系统' }] },
    engineering: { label: '方法论', title: '品牌工程学', lede: '将工程原则应用于抽象的品牌构建艺术。用逻辑、结构和可扩展机制取代猜测。', blocks: [{ title: '结构 (Structure)', content: '品牌不是一个Logo，它是一个意义的容器。我们首先构建容器，确保它能承受未来规模化的重量。', usage: { apply: '基础建设阶段', avoid: '快速原型测试' }, failure: '规模化时系统崩溃。' }, { title: '逻辑 (Logic)', content: '每一个创意决策都必须通过逻辑门。为什么是这个颜色？为什么是这个语调？如果无法解释，即被丢弃。', usage: { apply: '关键决策', avoid: '天马行空的构思' }, failure: '主观且不连贯。' }, { title: '机制 (Mechanism)', content: '我们建立自我维持的循环。内容引擎、社区反馈循环和自动增长触发器。', usage: { apply: '用户留存系统', avoid: '一次性活动' }, failure: '高流失率 / 停滞。' }, { title: '智能 (Intelligence)', content: '整合 AI 不仅作为工具，而是作为核心团队成员。数据驱动的洞察力指导每一个创意输出。', usage: { apply: '模式识别', avoid: '替代人类共情' }, failure: '产出通用化 / 幻觉。' }], manifesto: { label: '工程宣言', items: ['> 我们拒绝没有基础的“氛围感”。', '> 我们重视系统胜过一次性营销。', '> 我们构建能够复利增值的资产。', '> 我们相信越具体，越通用。'] } },
    entertainment: { label: '垂直领域', title: '娱乐工程', lede: '娱乐工程\n解码乐趣的物理学。\n我们将娱乐视为一组可被设计、测量与控制的变量系统。', formula: 'FUN = RHYTHM × DENSITY × SOCIAL_GRAVITY', formula_annotation: 'Rhythm: 节奏 | Density: 密度 | Social Gravity: 社交重力', pipeline_label: '体验堆栈_V1.0', console: { label: '变量与模式', modes: ['CLUB', 'FESTIVAL', 'BRAND_LAUNCH'], variables: [{ name: 'BPM 范围', min: '90', max: '130' }, { name: '密度', levels: ['低', '中', '高'] }, { name: '社交重力', levels: ['弱', '平衡', '强'] }, { name: '仪式强度', levels: ['柔和', '标准', '极致'] }] }, sections: [{ code: 'ENT_01', title: '体验工程', objective: '设计可被重复验证的体验结构。', desc: '架构从进入到退出的用户旅程。管理感官输入、流量密度和情绪峰值。', controlled_variables: ['BPM', '密度', '仪式'], risk_threshold: '感官过载 / 瓶颈阻塞', stack_map: '进入 > 沉浸 > 退出', metrics: [{ label: '心流', type: 'flow', value: 3 }, { label: '摩擦', type: 'flow', value: 1 }] }, { code: 'ENT_02', title: '生活方式系统', objective: '将娱乐嵌入日常行为循环。', desc: '将品牌嵌入消费者的日常仪式中。创造不仅仅是购买，而是成为习惯的产品。', controlled_variables: ['频率', '回流率', '习惯回路'], risk_threshold: '用户疲劳 / 关联度丧失', stack_map: '日常 > 习惯 > 忠诚', metrics: [{ label: '留存', type: 'rhythm', value: 'high' }] }, { code: 'ENT_03', title: '社交重力设计', objective: '设计人群聚集、分散与回流机制。', desc: '设计鼓励分享、归属感和拥护的互动协议。', controlled_variables: ['入场率', '聚集', '退出时机'], risk_threshold: '社区毒性', stack_map: '信号 > 聚集 > 回流', metrics: [{ label: '重力', type: 'gravity', value: 'high' }] }, { code: 'ENT_04', title: '仪式与记忆架构', objective: '制造可被记住、被复述的节点。', desc: '提取小众文化信号并进行工程化处理，在不失真实性的前提下实现大规模采用。', controlled_variables: ['峰值时机', '符号', '释放'], risk_threshold: '真实性丧失 (Cringe)', stack_map: '触发 > 仪式 > 记忆', metrics: [{ label: '规模', type: 'rhythm', value: 'med' }] }], commercial: { label: "商业绑定层", title: "系统部署", lede: "我们不出售创意，我们部署娱乐系统。", matrix_header: { module: "模块", types: "适用项目类型", output: "交付物" }, matrix: [{ id: "ENT_01", title: "体验工程", types: ["夜店", "高端酒吧", "快闪活动"], output: "流量结构 / 能量曲线" }, { id: "ENT_02", title: "生活方式系统", types: ["品牌 IP", "城市夜生活", "会员制"], output: "习惯回路 / 频率模型" }, { id: "ENT_03", title: "社交重力", types: ["高密度夜店", "音乐节", "社交品牌"], output: "聚类机制 / 回流环" }, { id: "ENT_04", title: "仪式架构", types: ["品牌发布", "私享会", "PR 事件"], output: "记忆锚点 /情绪释放" }], models: [{ title: "SYSTEM BUILD", type: "BUILD", desc: "Build once, run many times.", fit: "首次搭建 / 0-1 阶段" }, { title: "SYSTEM RUN", type: "RUN", desc: "We stay in the loop.", fit: "长期运营 / 持续调优" }, { title: "SYSTEM LICENSE", type: "LICENSE", desc: "We engineer, you scale.", fit: "集团扩展 / 多店复制" }] }, footer_note: '娱乐不是混乱。\n失控的体验不是自由，而是系统设计失败。' },
    ai: { label: '智能层', title: 'AI 引擎', lede: '我们不仅仅使用 AI 工具。我们构建在品牌特定数据集上训练的定制模型，以确保一致性和速度。', real_time_inputs: { label: '实时信号输入', items: ['人群密度', '入场速率', '停留时长', '情绪脉冲'] }, feedback_loop: { title: '娱乐信号反馈循环', steps: ['信号输入', 'AI 处理', '环境调优'] }, process: { input: { title: '数据摄入', desc: '市场趋势\n客户反馈' }, core: { title: 'Ø 核心模型', desc: '品牌语调调优\n战略推理' }, output: { title: '部署输出', desc: '自动化内容\n动态响应' } }, modules: [{ name: '品牌语调模型', desc: '微调的大语言模型，完全像您的品牌一样说话。' }, { name: '夜生活智能', desc: '针对场地容量、趋势预测和音乐策展优化的预测模型。' }, { name: '内容代理', desc: '能够生成、安排和分析社交内容表现的自主代理。' }, { name: '创始人副驾驶', desc: '为领导层提供数据支持建议的战略决策支持系统。' }] },
    founder: { label: '系统架构师', title: "工程师声明", content: [{ bold: '我相信品牌建设已经崩坏。', text: ' 它已变成一个装饰行业，而非功能行业。代理商兜售视觉效果；我们构建系统。' }, { bold: '创造力需要约束。', text: ' Ø SYSTEM 建立在一个简单的前提之上：结构带来规模。' }, { bold: '工程化无形之物。', text: ' 在娱乐业，“氛围”实际上是变量：节奏、密度和社交重力。我们只是给它们命名并控制它们。' }, { bold: '从混乱到秩序。', text: ' 我的背景跨越夜生活、技术和设计。在每个领域，我都看到了同样的模式：伟大的想法因为缺乏支撑增长的结构完整性而失败。' }, { bold: '角色定义。', text: ' 我不仅仅是一个设计师。我是体验工程师。' }], quote: '“一个离不开创始人就无法运转的系统不是生意。那是一份工作。”', role: '首席架构师' },
    work: { label: '接入协议', title: '初始化合作', lede: '如果您的参数与我们的系统能力一致，请启动联系。我们每个周期仅接受有限的合作伙伴关系。', targets: { label: '目标画像', items: ['正在规模化复杂品牌的远见者', '重视逻辑胜过潮流的创始人', '寻求 AI 整合的系统'] }, anti_targets: { label: '非目标画像', items: ['寻找“快速 Logo 升级”', '没有信任的微观管理', '不愿意在基础设施上投资'] }, cta: '发起咨询', meta: '响应时间：~24 小时' }
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const value = { language, setLanguage, t: translations[language] };
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};
