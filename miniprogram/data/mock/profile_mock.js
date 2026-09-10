// miniprogram/data/mock/profile_mock.js
/**
 * 个人中心与学习进度 Mock 数据
 * 严格契合 docs/mockups/profile.svg 视觉稿
 */

const mockProfileData = {
  user: {
    nickname: "Dev_Learner",
    targetDomain: "攻坚领域: Level 2 计算机网络",
    syncStatus: "云端同步中 ✓"
  },
  stats: {
    masteredWords: 238,
    streakDays: 5,
    collectedWords: 24,
    readArticles: 12
  },
  moduleProgress: [
    {
      id: "mod_l1_basic",
      level: "Level 1",
      name: "编程基础 & 高频报错",
      mastered: 180,
      total: 180,
      percent: 100,
      statusTag: "180 / 180 (100%) ✓",
      statusType: "completed" // 'completed' | 'active' | 'pending'
    },
    {
      id: "mod_l2_net",
      level: "Level 2",
      name: "计算机网络 (TCP / HTTP)",
      mastered: 45,
      total: 120,
      percent: 37,
      statusTag: "45 / 120 (37%)",
      statusType: "active"
    },
    {
      id: "mod_l2_os",
      level: "Level 2",
      name: "操作系统与并发编程",
      mastered: 12,
      total: 100,
      percent: 12,
      statusTag: "12 / 100 (12%)",
      statusType: "pending"
    },
    {
      id: "mod_l2_algo",
      level: "Level 2",
      name: "数据结构与核心算法",
      mastered: 0,
      total: 80,
      percent: 0,
      statusTag: "0 / 80 (0%)",
      statusType: "not_started"
    }
  ],
  settings: [
    { id: "daily_goal", title: "每日学习目标", value: "20 词 / 天 ›" },
    { id: "review_alarm", title: "每日回炉复习提醒", value: "每天 21:00 ›" },
    { id: "custom_import", title: "自定义词单导入", tag: "Beta", value: "›" },
    { id: "about", title: "关于 TechVocab 码词", value: "v1.0.0 MVP ›" }
  ]
};

module.exports = mockProfileData;
