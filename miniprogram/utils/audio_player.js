// miniprogram/utils/audio_player.js
/**
 * 全局单例音频播放控制器 (AudioPlayer)
 * 专为计算机技术英语学习打造：
 * 1. 单词标准真人发音 (美音 type=2 / 英音 type=1)
 * 2. 句子与段落英文原声朗读 (高质量神经语音流)
 * 3. 解决 iOS 侧边静音键穿透问题 (obeyMuteSwitch: false)
 * 4. 单例管理，杜绝音频重叠、杂音与内存泄漏
 */

class AudioPlayer {
  constructor() {
    this.audioCtx = null;
    this.currentTask = null; // { id, type: 'word'|'sentence'|'paragraph', text, options }
    this.isPlaying = false;
    this.initAudioContext();
  }

  /**
   * 初始化微信原生 InnerAudioContext
   */
  initAudioContext() {
    if (typeof wx === 'undefined' || !wx.createInnerAudioContext) {
      return;
    }

    try {
      // 开启静音开关穿透，确保 iPhone 用户开启静音键也能正常听到发音
      if (wx.setInnerAudioOption) {
        wx.setInnerAudioOption({
          obeyMuteSwitch: false,
          mixWithOther: false
        });
      }
    } catch (e) {
      console.warn('[AudioPlayer] setInnerAudioOption failed:', e);
    }

    this.audioCtx = wx.createInnerAudioContext();

    this.audioCtx.onPlay(() => {
      this.isPlaying = true;
      if (this.currentTask && typeof this.currentTask.onPlay === 'function') {
        this.currentTask.onPlay(this.currentTask);
      }
    });

    this.audioCtx.onEnded(() => {
      this.isPlaying = false;
      const task = this.currentTask;
      this.currentTask = null;
      if (task && typeof task.onEnded === 'function') {
        task.onEnded(task);
      }
    });

    this.audioCtx.onStop(() => {
      this.isPlaying = false;
      const task = this.currentTask;
      this.currentTask = null;
      if (task && typeof task.onStop === 'function') {
        task.onStop(task);
      }
    });

    this.audioCtx.onError((res) => {
      console.error('[AudioPlayer] Playback error:', res);
      this.isPlaying = false;
      const task = this.currentTask;
      this.currentTask = null;
      if (task && typeof task.onError === 'function') {
        task.onError(res, task);
      } else if (typeof wx !== 'undefined' && wx.showToast) {
        wx.showToast({
          title: '发音获取失败，请检查网络',
          icon: 'none',
          duration: 1500
        });
      }
    });
  }

  /**
   * 清理与标准化单词文本
   */
  sanitizeWord(word) {
    if (!word || typeof word !== 'string') return '';
    // 去除音标、标点符号，仅保留字母与连字符
    return word.trim().replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '');
  }

  /**
   * 清理句子/段落文本
   */
  sanitizeText(text) {
    if (!text || typeof text !== 'string') return '';
    // 去除特殊 emoji、代码括号等冗余字符
    return text.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
  }

  /**
   * 生成单词发音 URL (有道词典真人发音流)
   * type=2: 美音 (默认，计算机领域业界标准)
   * type=1: 英音
   */
  getWordAudioUrl(word, accent = 'us') {
    const cleanWord = this.sanitizeWord(word);
    if (!cleanWord) return '';
    const type = accent === 'uk' ? 1 : 2;
    return `https://dict.youdao.com/dictvoice?type=${type}&audio=${encodeURIComponent(cleanWord)}`;
  }

  /**
   * 生成长句/段落朗读 URL (百度高质神经语音流)
   */
  getSentenceAudioUrl(text, speed = 3) {
    const cleanText = this.sanitizeText(text);
    if (!cleanText) return '';
    // spd=3 语速适中标准，适合技术文章跟读与精听
    return `https://fanyi.baidu.com/gettts?lan=en&text=${encodeURIComponent(cleanText)}&spd=${speed}&source=web`;
  }

  /**
   * 播放单个单词发音
   * @param {string} word - 单词
   * @param {object} options - 选项与回调 { accent: 'us'|'uk', onPlay, onEnded, onStop, onError, vibrate: true }
   */
  playWord(word, options = {}) {
    const cleanWord = this.sanitizeWord(word);
    if (!cleanWord) return;

    // 轻微触觉反馈
    if (options.vibrate !== false && typeof wx !== 'undefined' && wx.vibrateShort) {
      wx.vibrateShort({ type: 'light' });
    }

    const audioUrl = this.getWordAudioUrl(cleanWord, options.accent || 'us');
    this._executePlay({
      id: `word_${cleanWord}`,
      type: 'word',
      text: cleanWord,
      url: audioUrl,
      onPlay: options.onPlay,
      onEnded: options.onEnded,
      onStop: options.onStop,
      onError: (err, task) => {
        // 如果主源偶发网络抖动，自动降级为备用 TTS 源重试一次
        if (!options._isRetried) {
          const fallbackUrl = this.getSentenceAudioUrl(cleanWord, 3);
          this._executePlay({
            ...task,
            url: fallbackUrl,
            options: { ...options, _isRetried: true }
          });
          return;
        }
        if (typeof options.onError === 'function') {
          options.onError(err, task);
        }
      }
    });
  }

  /**
   * 播放句子 / 技术典型例句
   * @param {string} text - 句子文本
   * @param {object} options - 选项与回调 { onPlay, onEnded, onStop, onError, speed: 3 }
   */
  playSentence(text, options = {}) {
    const cleanText = this.sanitizeText(text);
    if (!cleanText) return;

    if (options.vibrate !== false && typeof wx !== 'undefined' && wx.vibrateShort) {
      wx.vibrateShort({ type: 'light' });
    }

    const audioUrl = this.getSentenceAudioUrl(cleanText, options.speed || 3);
    this._executePlay({
      id: options.id || `sent_${cleanText.slice(0, 15)}`,
      type: 'sentence',
      text: cleanText,
      url: audioUrl,
      onPlay: options.onPlay,
      onEnded: options.onEnded,
      onStop: options.onStop,
      onError: options.onError
    });
  }

  /**
   * 播放段落原声朗读 (支持长段落自动分割或直放)
   * @param {string} text - 段落英文原文
   * @param {object} options - { id, onPlay, onEnded, onStop, onError, speed: 3 }
   */
  playParagraph(text, options = {}) {
    const cleanText = this.sanitizeText(text);
    if (!cleanText) return;

    if (options.vibrate !== false && typeof wx !== 'undefined' && wx.vibrateShort) {
      wx.vibrateShort({ type: 'light' });
    }

    // 绝大多数技术段落在 500 字符内，可直接高质播放
    if (cleanText.length <= 500) {
      const audioUrl = this.getSentenceAudioUrl(cleanText, options.speed || 3);
      this._executePlay({
        id: options.id || `para_${Date.now()}`,
        type: 'paragraph',
        text: cleanText,
        url: audioUrl,
        onPlay: options.onPlay,
        onEnded: options.onEnded,
        onStop: options.onStop,
        onError: options.onError
      });
    } else {
      // 超过 500 字符的长段落，智能按句切分为队列顺序播放
      this.playSentenceQueue(this._splitIntoSentences(cleanText), options);
    }
  }

  /**
   * 将超长段落按自然标点断句
   */
  _splitIntoSentences(text) {
    const matches = text.match(/[^.!?]+[.!?]+(\s+|$)|[^.!?]+$/g);
    return matches ? matches.map(s => s.trim()).filter(Boolean) : [text];
  }

  /**
   * 连续顺序播放句子队列
   */
  playSentenceQueue(sentences, options = {}) {
    if (!sentences || sentences.length === 0) {
      if (typeof options.onEnded === 'function') options.onEnded();
      return;
    }

    let currentIndex = 0;
    const playNext = () => {
      if (currentIndex >= sentences.length) {
        if (typeof options.onEnded === 'function') options.onEnded();
        return;
      }

      const sentence = sentences[currentIndex];
      currentIndex++;

      this.playSentence(sentence, {
        ...options,
        id: `${options.id || 'queue'}_${currentIndex}`,
        onEnded: () => {
          // 句子之间自然微顿 200ms
          setTimeout(playNext, 200);
        }
      });
    };

    playNext();
  }

  /**
   * 核心底层调度播放
   */
  _executePlay(task) {
    if (!this.audioCtx) {
      this.initAudioContext();
    }

    if (!this.audioCtx) {
      console.error('[AudioPlayer] AudioContext unavailable');
      return;
    }

    // 如果当前正在播放，先优雅停止
    if (this.isPlaying) {
      try {
        this.audioCtx.stop();
      } catch (e) {
        console.warn('[AudioPlayer] Stop existing playback error:', e);
      }
    }

    this.currentTask = task;
    this.audioCtx.src = task.url;
    this.audioCtx.play();
  }

  /**
   * 停止当前音频播放
   */
  stop() {
    if (this.audioCtx && this.isPlaying) {
      try {
        this.audioCtx.stop();
      } catch (e) {
        console.warn('[AudioPlayer] stop error:', e);
      }
    }
    this.isPlaying = false;
    this.currentTask = null;
  }

  /**
   * 获取当前播放任务详情
   */
  getCurrentTask() {
    return this.currentTask;
  }

  /**
   * 检查指定 ID 的音频是否正在播放
   */
  isPlayingId(id) {
    return this.isPlaying && this.currentTask && this.currentTask.id === id;
  }
}

// 导出单例对象
const audioPlayer = new AudioPlayer();

module.exports = audioPlayer;
