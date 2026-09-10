// miniprogram/pages/flashcard/flashcard.js
const store = require('../../data/store.js');
const audioPlayer = require('../../utils/audio_player.js');

function formatUnitText(current, total) {
  const c = current < 10 ? '0' + current : String(current);
  const t = total < 10 ? '0' + total : String(total);
  return `单元进度 ${c} / ${t}`;
}

Page({
  data: {
    statusBarHeight: 44,
    navBarHeight: 44,
    wordQueue: [],
    currentIndex: 0,
    moduleInfo: {},
    unitProgressText: "单元进度 01 / 24",
    word: {},
    isFlipped: false,
    isPlayingAudio: false,
    isPlayingContextAudio: false,
    isCompleted: false,
    sessionStats: {
      mastered: 0,
      fuzzy: 0,
      forgotten: 0
    },
    // 客观真测状态 (选项2: 单元尾声客观闯关)
    isQuizMode: false,
    quizQueue: [],
    currentQuizIndex: 0,
    currentQuiz: {},
    selectedOptionIndex: -1,
    quizAnswered: false,
    quizIsCorrect: false,
    quizStats: {
      totalCount: 0,
      correctCount: 0
    },
    quizResults: [],
    touchStartX: 0,
    touchStartY: 0,
    isSwiping: false
  },

  onLoad(options = {}) {
    // 挂载安全区域与自适应导航栏高度
    const app = (typeof getApp === 'function' && getApp()) || {};
    const globalData = app.globalData || {};
    const queue = store.getFlashcardQueue(options);
    const firstWord = queue[0] || {};

    this.setData({
      statusBarHeight: globalData.statusBarHeight || 44,
      navBarHeight: globalData.navBarHeight || 44,
      wordQueue: queue,
      currentIndex: 0,
      word: firstWord,
      unitProgressText: formatUnitText(1, queue.length),
      moduleInfo: {
        level: firstWord.level || "Level 2",
        categoryName: firstWord.categoryName || "计算机网络",
        currentUnitIndex: 1,
        totalUnits: queue.length,
        progressPercent: Math.round((1 / queue.length) * 100)
      },
      isCompleted: false,
      sessionStats: {
        mastered: 0,
        fuzzy: 0,
        forgotten: 0
      }
    });

    // 若从单词总览页面点击「🎯 挑战」直达客观闯关
    if (options.startQuiz === 'true' || options.startQuiz === true) {
      this.startQuizMode({
        mastered: 0,
        fuzzy: 0,
        forgotten: 0
      });
    }
  },

  // 返回上一页
  onTapBack() {
    if (getCurrentPages().length > 1) {
      wx.navigateBack();
    } else {
      wx.reLaunch({
        url: '/pages/home/home'
      });
    }
  },

  // 翻转卡片 (正面/反面)
  onFlipCard() {
    // 若刚刚发生过滑动或者上下滚动手势，坚决不翻卡，保护卡片内滚动浏览
    if (this.data.isSwiping || this._touchMoved) {
      return;
    }

    if (wx.vibrateShort) {
      wx.vibrateShort({ type: 'light' });
    }

    this.setData({
      isFlipped: !this.data.isFlipped
    });
  },

  // 播放标准发音 (集成真人发音流)
  onPlayAudio() {
    const currentWord = this.data.word && this.data.word.word;
    if (!currentWord) return;

    if (this.data.isPlayingAudio) {
      audioPlayer.stop();
      this.setData({ isPlayingAudio: false });
      return;
    }

    this.setData({ isPlayingAudio: true });

    audioPlayer.playWord(currentWord, {
      accent: 'us',
      onPlay: () => {
        this.setData({ isPlayingAudio: true });
      },
      onEnded: () => {
        this.setData({ isPlayingAudio: false });
      },
      onStop: () => {
        this.setData({ isPlayingAudio: false });
      },
      onError: () => {
        this.setData({ isPlayingAudio: false });
      }
    });
  },

  // 播放典型技术语境/例句朗读
  onPlayContextAudio() {
    const context = this.data.word && this.data.word.typicalContext;
    if (!context) return;

    if (this.data.isPlayingContextAudio) {
      audioPlayer.stop();
      this.setData({ isPlayingContextAudio: false });
      return;
    }

    this.setData({ isPlayingContextAudio: true });

    audioPlayer.playSentence(context, {
      onPlay: () => {
        this.setData({ isPlayingContextAudio: true });
      },
      onEnded: () => {
        this.setData({ isPlayingContextAudio: false });
      },
      onStop: () => {
        this.setData({ isPlayingContextAudio: false });
      },
      onError: () => {
        this.setData({ isPlayingContextAudio: false });
      }
    });
  },

  // 三态反馈操作 (1: 没记住, 2: 模糊, 3: 已掌握)
  onFeedback(e) {
    const grade = e.currentTarget.dataset.grade;
    const gradeMap = {
      '1': { title: '已标记：需回炉复习', icon: 'none', statKey: 'forgotten' },
      '2': { title: '已标记：稍后强化', icon: 'none', statKey: 'fuzzy' },
      '3': { title: '已掌握 ✓', icon: 'success', statKey: 'mastered' }
    };

    if (wx.vibrateShort) {
      wx.vibrateShort({ type: 'medium' });
    }

    const feedback = gradeMap[grade] || { title: '已记录', icon: 'none', statKey: 'mastered' };
    wx.showToast({
      title: feedback.title,
      icon: feedback.icon,
      duration: 500
    });

    const newStats = { ...this.data.sessionStats };
    if (feedback.statKey) {
      newStats[feedback.statKey] = (newStats[feedback.statKey] || 0) + 1;
    }

    // 同步持久化状态至本地数据中心 (保证生词本和首页数据完全对齐)
    const currentWord = this.data.word || {};
    const wordKey = currentWord.id || currentWord.word;
    if (wordKey) {
      if (grade === '3') {
        store.markWordMastered(wordKey);
      } else {
        store.markWordNeedReview(wordKey);
      }
      store.recordTodayStudy(1);
    }

    // 切换前终止发音
    audioPlayer.stop();
    this.setData({ isPlayingAudio: false, isPlayingContextAudio: false });

    // 延时 300ms 推进到下一个单词
    setTimeout(() => {
      const nextIndex = this.data.currentIndex + 1;
      const totalUnits = this.data.wordQueue.length;
      if (nextIndex < totalUnits) {
        const nextWord = this.data.wordQueue[nextIndex];
        this.setData({
          currentIndex: nextIndex,
          word: nextWord,
          isFlipped: false,
          sessionStats: newStats,
          unitProgressText: formatUnitText(nextIndex + 1, totalUnits),
          'moduleInfo.level': (nextWord && nextWord.level) || this.data.moduleInfo.level,
          'moduleInfo.categoryName': (nextWord && nextWord.categoryName) || this.data.moduleInfo.categoryName,
          'moduleInfo.currentUnitIndex': nextIndex + 1,
          'moduleInfo.progressPercent': totalUnits > 0 ? Math.round(((nextIndex + 1) / totalUnits) * 100) : 0
        });
      } else {
        // 卡片序列学习完毕 -> 自动进入选项2: 单元尾声客观真测大挑战！
        this.startQuizMode(newStats);
      }
    }, 300);
  },

  // 触发客观真测大挑战 (选项2: 纯自然语言场景题，绝无代码)
  startQuizMode(sessionStats) {
    if (wx.vibrateShort) {
      wx.vibrateShort({ type: 'medium' });
    }

    // 从本组已学词汇中提取包含 objectiveQuiz 的题目
    const candidates = (this.data.wordQueue || []).filter(w => w.objectiveQuiz && w.objectiveQuiz.scenario);
    // 每次客观闯关最多抽取 3 题 (若不足 3 题则全测)
    const quizQueue = candidates.slice(0, Math.min(3, candidates.length));

    if (quizQueue.length === 0) {
      // 容错处理: 若无题目则直接结算
      this.setData({
        sessionStats: sessionStats,
        isCompleted: true,
        'moduleInfo.progressPercent': 100
      });
      return;
    }

    this.setData({
      sessionStats: sessionStats,
      isQuizMode: true,
      quizQueue: quizQueue,
      currentQuizIndex: 0,
      currentQuiz: quizQueue[0],
      selectedOptionIndex: -1,
      quizAnswered: false,
      quizIsCorrect: false,
      quizStats: {
        totalCount: quizQueue.length,
        correctCount: 0
      },
      quizResults: [],
      'moduleInfo.progressPercent': 100
    });

    wx.showToast({
      title: '🎯 进入客观真测挑战！',
      icon: 'none',
      duration: 1200
    });
  },

  // 用户点击选项作答 (客观验真)
  onSelectQuizOption(e) {
    if (this.data.quizAnswered) return; // 已经回答过当前题，防止重复触发

    const optIndex = Number(e.currentTarget.dataset.index);
    const currentQ = this.data.currentQuiz || {};
    const options = (currentQ.objectiveQuiz && currentQ.objectiveQuiz.options) || [];
    const chosenOption = options[optIndex];
    if (!chosenOption) return;

    const isCorrect = Boolean(chosenOption.isCorrect);

    if (wx.vibrateShort) {
      wx.vibrateShort({ type: isCorrect ? 'light' : 'medium' });
    }

    // 记录客观验真结果到本地数据中心 (保证生词本和个人中心同步)
    const wordKey = currentQ.id || currentQ.word;
    store.recordQuizAnswer(wordKey, isCorrect);

    const newResults = [...this.data.quizResults, {
      word: currentQ.word,
      isCorrect: isCorrect,
      explanation: currentQ.objectiveQuiz.explanation
    }];

    const newStats = { ...this.data.quizStats };
    if (isCorrect) {
      newStats.correctCount += 1;
    }

    this.setData({
      selectedOptionIndex: optIndex,
      quizAnswered: true,
      quizIsCorrect: isCorrect,
      quizStats: newStats,
      quizResults: newResults
    });
  },

  // 进入下一道题或查看通关结果
  onNextQuiz() {
    if (wx.vibrateShort) {
      wx.vibrateShort({ type: 'light' });
    }

    const nextIndex = this.data.currentQuizIndex + 1;
    if (nextIndex < this.data.quizQueue.length) {
      const nextQ = this.data.quizQueue[nextIndex];
      this.setData({
        currentQuizIndex: nextIndex,
        currentQuiz: nextQ,
        selectedOptionIndex: -1,
        quizAnswered: false,
        quizIsCorrect: false
      });
    } else {
      // 全部题目作答完毕 -> 唤起最终真验结算面板
      this.setData({
        isQuizMode: false,
        isCompleted: true
      });
    }
  },

  // 手势触摸起点
  onTouchStart(e) {
    if (e.touches && e.touches.length > 0) {
      this.setData({
        touchStartX: e.touches[0].clientX,
        touchStartY: e.touches[0].clientY,
        isSwiping: false
      });
      this._touchMoved = false;
    }
  },

  // 手势触摸移动过程 (记录滑动，防止纵向滚动时误触翻牌)
  onTouchMove(e) {
    if (e.touches && e.touches.length > 0) {
      const dx = Math.abs(e.touches[0].clientX - this.data.touchStartX);
      const dy = Math.abs(e.touches[0].clientY - this.data.touchStartY);
      if (dx > 10 || dy > 10) {
        this._touchMoved = true;
      }
    }
  },

  // 手势触摸终点判断左右滑动
  onTouchEnd(e) {
    if (!e.changedTouches || e.changedTouches.length === 0) return;
    const deltaX = e.changedTouches[0].clientX - this.data.touchStartX;
    const deltaY = e.changedTouches[0].clientY - this.data.touchStartY;

    if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
      this._touchMoved = true;
    }

    // 仅在水平位移显著大于垂直位移时触发左右滑动手势
    if (Math.abs(deltaX) > 60 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      this.setData({ isSwiping: true });
      setTimeout(() => {
        this.setData({ isSwiping: false });
        this._touchMoved = false;
      }, 300);

      if (deltaX < 0) {
        this.goToNextWord();
      } else {
        this.goToPrevWord();
      }
    } else {
      // 延时重置 _touchMoved，确保如果是滚动/滑动手势不会误触发翻牌 tap
      setTimeout(() => {
        this._touchMoved = false;
      }, 200);
    }
  },

  goToNextWord() {
    const totalUnits = this.data.wordQueue.length;
    if (this.data.currentIndex < totalUnits - 1) {
      if (wx.vibrateShort) wx.vibrateShort({ type: 'light' });
      const nextIndex = this.data.currentIndex + 1;
      const nextWord = this.data.wordQueue[nextIndex];
      this.setData({
        currentIndex: nextIndex,
        word: nextWord,
        isFlipped: false,
        unitProgressText: formatUnitText(nextIndex + 1, totalUnits),
        'moduleInfo.level': (nextWord && nextWord.level) || this.data.moduleInfo.level,
        'moduleInfo.categoryName': (nextWord && nextWord.categoryName) || this.data.moduleInfo.categoryName,
        'moduleInfo.currentUnitIndex': nextIndex + 1,
        'moduleInfo.progressPercent': totalUnits > 0 ? Math.round(((nextIndex + 1) / totalUnits) * 100) : 0
      });
    } else {
      wx.showToast({ title: '已是本组最后一个词', icon: 'none', duration: 700 });
    }
  },

  goToPrevWord() {
    audioPlayer.stop();
    this.setData({ isPlayingAudio: false, isPlayingContextAudio: false });

    const totalUnits = this.data.wordQueue.length;
    if (this.data.currentIndex > 0) {
      if (wx.vibrateShort) wx.vibrateShort({ type: 'light' });
      const prevIndex = this.data.currentIndex - 1;
      const prevWord = this.data.wordQueue[prevIndex];
      this.setData({
        currentIndex: prevIndex,
        word: prevWord,
        isFlipped: false,
        unitProgressText: formatUnitText(prevIndex + 1, totalUnits),
        'moduleInfo.level': (prevWord && prevWord.level) || this.data.moduleInfo.level,
        'moduleInfo.categoryName': (prevWord && prevWord.categoryName) || this.data.moduleInfo.categoryName,
        'moduleInfo.currentUnitIndex': prevIndex + 1,
        'moduleInfo.progressPercent': totalUnits > 0 ? Math.round(((prevIndex + 1) / totalUnits) * 100) : 0
      });
    } else {
      wx.showToast({ title: '已是本组第一个词', icon: 'none', duration: 700 });
    }
  },

  // 页面隐藏或销毁时停止音频
  onHide() {
    audioPlayer.stop();
    this.setData({ isPlayingAudio: false, isPlayingContextAudio: false });
  },

  onUnload() {
    audioPlayer.stop();
    this.setData({ isPlayingAudio: false, isPlayingContextAudio: false });
  },

  // 通关操作：再练一组
  onRestartSession() {
    const queue = this.data.wordQueue;
    this.setData({
      currentIndex: 0,
      word: queue[0],
      isFlipped: false,
      isCompleted: false,
      isQuizMode: false,
      selectedOptionIndex: -1,
      quizAnswered: false,
      quizIsCorrect: false,
      quizStats: { totalCount: 0, correctCount: 0 },
      quizResults: [],
      unitProgressText: formatUnitText(1, queue.length),
      'moduleInfo.level': (queue[0] && queue[0].level) || "Level 2",
      'moduleInfo.categoryName': (queue[0] && queue[0].categoryName) || "计算机网络",
      'moduleInfo.currentUnitIndex': 1,
      'moduleInfo.progressPercent': queue.length > 0 ? Math.round((1 / queue.length) * 100) : 0,
      sessionStats: { mastered: 0, fuzzy: 0, forgotten: 0 }
    });
  },

  // 通关操作：完成并返回
  onFinishSession() {
    if (getCurrentPages().length > 1) {
      wx.navigateBack();
    } else {
      wx.reLaunch({
        url: '/pages/home/home'
      });
    }
  }
});
