// miniprogram/data/mock/home_mock.js
/**
 * 首页/学习中心 Mock 数据
 * 严格契合 docs/wireframes/home.svg 视觉稿
 */

const mockHomeData = {
  todayProgress: {
    current: 12,
    goal: 20,
    remain: 8,
    percent: 60,
    streakDays: 5
  },
  reviewAlert: {
    count: 8,
    label: "生词本有 8 个技术生词待回炉巩固"
  },
  moduleList: [
    {
      id: "mod_net",
      level: "Level 2",
      name: "计算机网络 (TCP / HTTP)",
      learned: 45,
      total: 120,
      percent: 37,
      status: "active",
      actionText: "学习中"
    },
    {
      id: "mod_basic",
      level: "Level 1",
      name: "编程入门基础 & 高频报错",
      learned: 180,
      total: 180,
      percent: 100,
      status: "completed",
      actionText: "已通关 ✓"
    },
    {
      id: "mod_os",
      level: "Level 2",
      name: "操作系统与并发编程",
      learned: 12,
      total: 100,
      percent: 12,
      status: "pending",
      actionText: "切换 ›"
    }
  ],
  readerTeaser: {
    title: "📖 真实技术文档阅读",
    desc: "支持粘贴外部英文报错/文档，点词即查专业释义",
    btnText: "粘贴阅读"
  }
};

module.exports = mockHomeData;
