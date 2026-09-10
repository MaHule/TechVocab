// miniprogram/data/store.js
/**
 * TechVocab 统一本地数据中心 (Local-First Data Store)
 * 解决全站数据断层、页面状态未闭环及生词本数据不一致问题
 * 升级版：全面配备【通用生活常释】、【计算机专属释义】、【设计隐喻】与【非代码客观实战自测题】
 */

const STORAGE_KEY = 'tech_vocab_store_v3'; // 升级版本号以激活扩充后的计算机专业技术专属词典与离线通用词典

// 初始 24 个计算机核心词汇库 (全部配备音标、双轨释义、设计隐喻、典型语境、真实工程代码与客观实战题)
const initialWordLibrary = [
  {
    "id": "nb_01",
    "word": "idempotent",
    "phonetic": "/ˌaɪ.dəmˈpoʊ.tənt/",
    "pos": "adj.",
    "specTag": "RFC 7231 · SPEC",
    "level": "Level 2",
    "categoryName": "计算机网络",
    "techDefinition": "幂等的",
    "techDetail": "（操作执行多次与执行一次结果完全相同）",
    "typicalContext": "HTTP PUT/DELETE · 消息重试 · 接口防重",
    "source": "文档阅读",
    "status": "need_review",
    "statusLabel": "待复习",
    "statusColor": "warning",
    "reviewTimes": 1,
    "codeSnippet": {
      "fileName": "EXAMPLE.http_handler.go",
      "lines": [
        {
          "lineNum": "01",
          "isComment": true,
          "code": "// RFC 7231: Safe & Idempotent Methods"
        },
        {
          "lineNum": "02",
          "isComment": false,
          "code": "func HandleRequest(req *Request) {"
        },
        {
          "lineNum": "03",
          "isComment": false,
          "code": "  if req.",
          "highlight": "IsIdempotent",
          "suffix": "() {"
        },
        {
          "lineNum": "04",
          "isComment": false,
          "code": "    retryPolicy.",
          "highlightGreen": "EnableSafeRetry",
          "suffix": "()"
        },
        {
          "lineNum": "05",
          "isComment": false,
          "code": "  }"
        },
        {
          "lineNum": "06",
          "isComment": false,
          "code": "}"
        }
      ]
    },
    "generalDefinition": "【数】等幂的（连续自乘或连续作用其值保持不变）",
    "designMetaphor": "如同按电梯关门键，连续按 1 次或 10 次电梯都只是执行关门，在接口中保证网络重试无副作用。",
    "objectiveQuiz": {
      "scenario": "在设计高并发订单支付或退款接口时，为防止网络抖动超时导致客户端重试而引发重复扣款，架构师要求该接口必须具备哪种特性？",
      "options": [
        {
          "label": "A",
          "text": "Asynchronous (异步处理)",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Idempotent (幂等性)",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Deadlock (死锁特性)",
          "isCorrect": false
        },
        {
          "label": "D",
          "text": "Pipeline (流水线模式)",
          "isCorrect": false
        }
      ],
      "explanation": "幂等性 (Idempotent) 保证无论同一个操作执行 1 次还是多次，系统数据与资源状态均保持一致，无多余副作用。"
    },
    "isVerified": false
  },
  {
    "id": "nb_02",
    "word": "deadlock",
    "phonetic": "/ˈded.lɑːk/",
    "pos": "n.",
    "specTag": "POSIX · THREAD",
    "level": "Level 2",
    "categoryName": "操作系统与并发",
    "techDefinition": "死锁",
    "techDetail": "（多进程/线程相互持有资源并循环等待对方释放）",
    "typicalContext": "互斥锁竞争顺序 · 银行家算法 · 资源抢占",
    "source": "Level 2 操作系统",
    "status": "need_review",
    "statusLabel": "遗忘 2 次",
    "statusColor": "danger",
    "reviewTimes": 2,
    "codeSnippet": {
      "fileName": "EXAMPLE.mutex_deadlock.rs",
      "lines": [
        {
          "lineNum": "01",
          "isComment": true,
          "code": "// Rust: Potential circular lock acquisition"
        },
        {
          "lineNum": "02",
          "isComment": false,
          "code": "fn transfer(acc_a: &Mutex<u32>, acc_b: &Mutex<u32>) {"
        },
        {
          "lineNum": "03",
          "isComment": false,
          "code": "  let _lock_a = acc_a.",
          "highlight": "lock",
          "suffix": "().unwrap();"
        },
        {
          "lineNum": "04",
          "isComment": false,
          "code": "  let _lock_b = acc_b.",
          "highlight": "lock",
          "suffix": "().unwrap(); // Deadlock risk"
        },
        {
          "lineNum": "05",
          "isComment": false,
          "code": "}"
        }
      ]
    },
    "generalDefinition": "僵局、停顿、僵持不下（如谈判陷入僵局）",
    "designMetaphor": "如同窄桥上两辆车相对而行互不相让，操作系统中两个线程互锁对方所需资源导致无限期停滞。",
    "objectiveQuiz": {
      "scenario": "系统中有两个并发事务，事务 A 持有用户表行锁并请求账户表行锁，事务 B 持有账户表行锁并同时请求用户表行锁，双方互不释放导致业务无限期停滞。这种系统严重故障被称为？",
      "options": [
        {
          "label": "A",
          "text": "Cache Breakdown (缓存击穿)",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Deadlock (死锁)",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Memory Leak (内存泄漏)",
          "isCorrect": false
        },
        {
          "label": "D",
          "text": "Backpressure (背压现象)",
          "isCorrect": false
        }
      ],
      "explanation": "死锁 (Deadlock) 指多个执行单元相互持有对方所需的互斥资源，且都在等待对方先释放，从而陷入永久互相等待的僵局。"
    },
    "isVerified": false
  },
  {
    "id": "nb_03",
    "word": "traversal",
    "phonetic": "/trəˈvɜːr.səl/",
    "pos": "n.",
    "specTag": "ALGO · GRAPH/TREE",
    "level": "Level 2",
    "categoryName": "数据结构与核心算法",
    "techDefinition": "遍历",
    "techDetail": "（按确定规则无重复访问树或图的所有节点）",
    "typicalContext": "二叉树层序遍历 · 深度优先 DFS · 广度优先 BFS",
    "source": "Level 2 核心算法",
    "status": "mastered",
    "statusLabel": "已掌握 ✓",
    "statusColor": "success",
    "reviewTimes": 3,
    "codeSnippet": {
      "fileName": "EXAMPLE.tree_traversal.ts",
      "lines": [
        {
          "lineNum": "01",
          "isComment": true,
          "code": "// Pre-order Depth First Traversal"
        },
        {
          "lineNum": "02",
          "isComment": false,
          "code": "function dfsTraversal(root: TreeNode | null) {"
        },
        {
          "lineNum": "03",
          "isComment": false,
          "code": "  if (!root) return;"
        },
        {
          "lineNum": "04",
          "isComment": false,
          "code": "  visit(root.val);"
        },
        {
          "lineNum": "05",
          "isComment": false,
          "code": "  dfsTraversal(root.left);"
        },
        {
          "lineNum": "06",
          "isComment": false,
          "code": "}"
        }
      ]
    },
    "generalDefinition": "横跨、横贯、穿过（如穿越森林、横穿大陆）",
    "designMetaphor": "如同快递员按照地图挨家挨户送包裹，算法中沿着树或图的连线不重复地访问每一个节点。",
    "objectiveQuiz": {
      "scenario": "在深度优先搜索 (DFS) 与广度优先搜索 (BFS) 中，算法必须按照既定规则访问数据结构中的每一个节点且无遗漏，这种按序访问所有数据元素的操作在计算机中被称为？",
      "options": [
        {
          "label": "A",
          "text": "Traversal (遍历)",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Polymorphism (多态)",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Pagination (分页)",
          "isCorrect": false
        },
        {
          "label": "D",
          "text": "Benchmark (基准测试)",
          "isCorrect": false
        }
      ],
      "explanation": "遍历 (Traversal) 指按照某种规则或路径，对数据结构中的每个节点不重复地访问且仅访问一次的过程。"
    },
    "isVerified": false
  },
  {
    "id": "nb_04",
    "word": "concurrency",
    "phonetic": "/kənˈkɝː.ən.si/",
    "pos": "n.",
    "specTag": "CS ARCH · MULTI-CORE",
    "level": "Level 2",
    "categoryName": "操作系统与并发",
    "techDefinition": "并发",
    "techDetail": "（系统在逻辑上具有同时处理多个任务的能力）",
    "typicalContext": "Go Goroutines · 线程池调度 · 非阻塞异步 I/O",
    "source": "文档阅读",
    "status": "need_review",
    "statusLabel": "待复习",
    "statusColor": "warning",
    "reviewTimes": 1,
    "codeSnippet": {
      "fileName": "EXAMPLE.worker_pool.go",
      "lines": [
        {
          "lineNum": "01",
          "isComment": true,
          "code": "// Spawn concurrent worker pool"
        },
        {
          "lineNum": "02",
          "isComment": false,
          "code": "for w := 1; w <= numWorkers; w++ {"
        },
        {
          "lineNum": "03",
          "isComment": false,
          "code": "  go worker(w, jobs, results) // ",
          "highlightGreen": "concurrent execution",
          "suffix": ""
        },
        {
          "lineNum": "04",
          "isComment": false,
          "code": "}"
        }
      ]
    },
    "generalDefinition": "同时发生、并发同存（多件事情在同一时期并存）",
    "designMetaphor": "如同一个咖啡师同时为多位顾客交替做咖啡，单核或多核系统在宏观时间段内同时推进多个处理任务。",
    "objectiveQuiz": {
      "scenario": "在电商秒杀大促期间，数万名用户在同一瞬间涌入系统发起抢购，系统需要在重叠时间段内协同调度并响应这些海量请求，该核心系统能力是？",
      "options": [
        {
          "label": "A",
          "text": "Pagination (分页处理)",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Concurrency (并发处理)",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Serialization (序列化)",
          "isCorrect": false
        },
        {
          "label": "D",
          "text": "Instantiation (实例化)",
          "isCorrect": false
        }
      ],
      "explanation": "并发 (Concurrency) 指计算机系统在宏观上有能力在重叠的时间周期内同时处理并推进多个任务。"
    },
    "isVerified": false
  },
  {
    "id": "nb_05",
    "word": "asynchronous",
    "phonetic": "/eɪˈsɪŋ.krə.nəs/",
    "pos": "adj.",
    "specTag": "EVENT LOOP · I/O",
    "level": "Level 2",
    "categoryName": "计算机网络",
    "techDefinition": "异步的",
    "techDetail": "（操作调用立即返回，结果通过回调或 Promise 处理）",
    "typicalContext": "async/await · 事件循环 Event Loop · 消息总线",
    "source": "Level 2 计算机网络",
    "status": "mastered",
    "statusLabel": "已掌握 ✓",
    "statusColor": "success",
    "reviewTimes": 4,
    "codeSnippet": {
      "fileName": "EXAMPLE.async_fetch.ts",
      "lines": [
        {
          "lineNum": "01",
          "isComment": true,
          "code": "// Non-blocking asynchronous network request"
        },
        {
          "lineNum": "02",
          "isComment": false,
          "code": "async function fetchMetrics(url: string) {"
        },
        {
          "lineNum": "03",
          "isComment": false,
          "code": "  const resp = ",
          "highlight": "await",
          "suffix": " fetch(url);"
        },
        {
          "lineNum": "04",
          "isComment": false,
          "code": "  return ",
          "highlightGreen": "await",
          "suffix": " resp.json();"
        },
        {
          "lineNum": "05",
          "isComment": false,
          "code": "}"
        }
      ]
    },
    "generalDefinition": "不同步的、非同期的（各方不按照同一节奏行动）",
    "designMetaphor": "如同去餐馆点餐拿到取餐震动铃后回座等待，调用发起后无需原地阻塞，铃响（回调通知）后再去取餐。",
    "objectiveQuiz": {
      "scenario": "用户在网页端点击「导出百万级销售报表」按钮后，页面没有卡住白屏等待，而是立即弹出「报表生成中，完成后将通过邮件通知您」，这种非阻塞的设计模式属于？",
      "options": [
        {
          "label": "A",
          "text": "Synchronous (同步模式)",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Deadlock (死锁模式)",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Asynchronous (异步模式)",
          "isCorrect": true
        },
        {
          "label": "D",
          "text": "Overflow (溢出模式)",
          "isCorrect": false
        }
      ],
      "explanation": "异步 (Asynchronous) 使得耗时操作无需阻塞主调用流程，请求提交后立即释放线程，待任务完成再通过通知机制回传结果。"
    },
    "isVerified": false
  },
  {
    "id": "nb_06",
    "word": "synchronize",
    "phonetic": "/ˈsɪŋ.krə.naɪz/",
    "pos": "v.",
    "specTag": "RFC 793 · TCP",
    "level": "Level 2",
    "categoryName": "计算机网络",
    "techDefinition": "同步",
    "techDetail": "（协调两端状态一致，初始序号配对）",
    "typicalContext": "TCP 三次握手 SYN 序号同步 · 双向状态对齐",
    "source": "文档阅读",
    "status": "mastered",
    "statusLabel": "已掌握 ✓",
    "statusColor": "success",
    "reviewTimes": 3,
    "codeSnippet": {
      "fileName": "EXAMPLE.tcp_conn.c",
      "lines": [
        {
          "lineNum": "01",
          "isComment": true,
          "code": "/* RFC 793: Sequence Number Synchronization */"
        },
        {
          "lineNum": "02",
          "isComment": false,
          "code": "tcph->syn = 1;"
        },
        {
          "lineNum": "03",
          "isComment": false,
          "code": "tcph->seq = htonl(",
          "highlight": "initial_seq_num",
          "suffix": ");"
        },
        {
          "lineNum": "04",
          "isComment": false,
          "code": "send_packet(tcph);"
        }
      ]
    },
    "generalDefinition": "使...同步、使步调一致（如手表对表、动作协同）",
    "designMetaphor": "如同特种部队在行动前互相校对秒表时间，通信双方通过协商统一初始序列号与时序步调。",
    "objectiveQuiz": {
      "scenario": "在 TCP 三次握手建立连接的初始阶段，客户端向服务端发送 SYN 报文，其最核心的目的在于与对端协商并达成一致的是什么？",
      "options": [
        {
          "label": "A",
          "text": "用户登录密码",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Synchronize (同步初始数据包序列号)",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "数据库连接池大小",
          "isCorrect": false
        },
        {
          "label": "D",
          "text": "页面排版字体样式",
          "isCorrect": false
        }
      ],
      "explanation": "TCP 握手中的 SYN 即 Synchronize（同步），核心作用是在两端之间同步初始数据包序列号 (ISN)，以保证后续有序传输。"
    },
    "isVerified": false
  },
  {
    "id": "nb_07",
    "word": "latency",
    "phonetic": "/ˈleɪ.tən.si/",
    "pos": "n.",
    "specTag": "NET PERF · METRIC",
    "level": "Level 2",
    "categoryName": "计算机网络",
    "techDefinition": "时延 / 延迟",
    "techDetail": "（数据包从发送端传输到目的地所需的时间）",
    "typicalContext": "RTT 往返时延 · 99分位延迟 (p99) · 边缘计算加速",
    "source": "Level 2 计算机网络",
    "status": "mastered",
    "statusLabel": "已掌握 ✓",
    "statusColor": "success",
    "reviewTimes": 2,
    "codeSnippet": {
      "fileName": "EXAMPLE.telemetry.go",
      "lines": [
        {
          "lineNum": "01",
          "isComment": true,
          "code": "// Monitor request round-trip latency"
        },
        {
          "lineNum": "02",
          "isComment": false,
          "code": "start := time.Now()"
        },
        {
          "lineNum": "03",
          "isComment": false,
          "code": "resp, err := client.Do(req)"
        },
        {
          "lineNum": "04",
          "isComment": false,
          "code": "latency := time.Since(start)"
        },
        {
          "lineNum": "05",
          "isComment": false,
          "code": "metrics.Record(",
          "highlight": "latency",
          "suffix": ")"
        }
      ]
    },
    "generalDefinition": "潜伏、潜在性、反应滞后时间",
    "designMetaphor": "如同向山谷大喊一声到听到回音之间的等待时间，指数据包从发出到对端接收所需的物理与协议传输耗时。",
    "objectiveQuiz": {
      "scenario": "跨国跨洋网络游戏中，国内玩家连接海外服务器时常感到人物移动动作有明显半秒卡顿与拖沓，这一衡量网络响应等待时长的核心指标是？",
      "options": [
        {
          "label": "A",
          "text": "Latency (网络时延)",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Polymorphism (多态性)",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Instantiate (实例化)",
          "isCorrect": false
        },
        {
          "label": "D",
          "text": "Middleware (中间件)",
          "isCorrect": false
        }
      ],
      "explanation": "时延 (Latency) 是衡量系统或网络响应速度的关键指标，代表一个数据请求从发出到对端接收并响应的耗费时长。"
    },
    "isVerified": false
  },
  {
    "id": "nb_08",
    "word": "instantiate",
    "phonetic": "/ɪnˈstæn.ʃi.eɪt/",
    "pos": "v.",
    "specTag": "OOP · DESIGN PATTERN",
    "level": "Level 1",
    "categoryName": "编程基础 & 高频报错",
    "techDefinition": "实例化",
    "techDetail": "（根据类模板在堆内存中分配空间并创建具体对象）",
    "typicalContext": "工厂模式 · 构造函数 new · 依赖注入",
    "source": "Level 1 编程基础",
    "status": "mastered",
    "statusLabel": "已掌握 ✓",
    "statusColor": "success",
    "reviewTimes": 5,
    "codeSnippet": {
      "fileName": "EXAMPLE.factory.java",
      "lines": [
        {
          "lineNum": "01",
          "isComment": true,
          "code": "// Java: Instantiate service instance via factory"
        },
        {
          "lineNum": "02",
          "isComment": false,
          "code": "public Connection create() {"
        },
        {
          "lineNum": "03",
          "isComment": false,
          "code": "  return new ",
          "highlight": "DatabaseConnection",
          "suffix": "(config);"
        },
        {
          "lineNum": "04",
          "isComment": false,
          "code": "}"
        }
      ]
    },
    "generalDefinition": "举例说明、具象化呈现（把抽象概念变成具体实例）",
    "designMetaphor": "如同拿着一份建筑蓝图在工地上盖出一栋真实的混凝土房子，在内存中将类模板分配为具象对象。",
    "objectiveQuiz": {
      "scenario": "在面向对象软件设计中，工程师定义了一个抽象的「用户 (User)」类蓝图，随后在内存中真正为张三创建了一个具备独立属性的实体对象，该过程称为？",
      "options": [
        {
          "label": "A",
          "text": "Deprecate (废弃)",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Instantiate (实例化)",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Traverse (遍历)",
          "isCorrect": false
        },
        {
          "label": "D",
          "text": "Serialize (序列化)",
          "isCorrect": false
        }
      ],
      "explanation": "实例化 (Instantiate) 是依据类定义或模板规范，在内存中真正分配资源并生成具体可用对象的过程。"
    },
    "isVerified": false
  },
  {
    "id": "nb_09",
    "word": "backpressure",
    "phonetic": "/ˈbækˌpreʃ.ɚ/",
    "pos": "n.",
    "specTag": "STREAM · FLOW CONTROL",
    "level": "Level 2",
    "categoryName": "计算机网络",
    "techDefinition": "背压 / 反压",
    "techDetail": "（当下游消费速率低于上游生产速率时，向上游发出的流量节流信号）",
    "typicalContext": "Reactive Streams · TCP 接收窗口 · 消息队列削峰",
    "source": "Level 2 计算机网络",
    "status": "need_review",
    "statusLabel": "待复习",
    "statusColor": "warning",
    "reviewTimes": 1,
    "codeSnippet": {
      "fileName": "EXAMPLE.flow_control.go",
      "lines": [
        {
          "lineNum": "01",
          "isComment": true,
          "code": "// Apply backpressure when buffer exceeds limit"
        },
        {
          "lineNum": "02",
          "isComment": false,
          "code": "select {"
        },
        {
          "lineNum": "03",
          "isComment": false,
          "code": "case queue <- task: // buffer ok"
        },
        {
          "lineNum": "04",
          "isComment": false,
          "code": "default:"
        },
        {
          "lineNum": "05",
          "isComment": false,
          "code": "  emitBackpressureSignal(); // drop or pause"
        },
        {
          "lineNum": "06",
          "isComment": false,
          "code": "}"
        }
      ]
    },
    "generalDefinition": "反向压力、背压（管道液体回流受阻产生的逆向压强）",
    "designMetaphor": "如同下水道排水不及导致雨水反涌向进水口，下游消费者处理过慢时主动反向限制上游生产速率。",
    "objectiveQuiz": {
      "scenario": "在实时流式数据处理系统中，上游每秒产生 10 万条日志，而下游写入数据库每秒只能承受 1 万条，为了防止消费端内存直接爆满宕机，系统主动向下游向上游传递阻力并节流，这被称为？",
      "options": [
        {
          "label": "A",
          "text": "Backpressure (背压机制)",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Deadlock (死锁机制)",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Checksum (校验机制)",
          "isCorrect": false
        },
        {
          "label": "D",
          "text": "Pagination (分页机制)",
          "isCorrect": false
        }
      ],
      "explanation": "背压 (Backpressure) 是响应式流处理中的流量控制机制，当下游承受超负荷时主动逆向抑制上游发送节奏以保护系统。"
    },
    "isVerified": false
  },
  {
    "id": "nb_10",
    "word": "reentrancy",
    "phonetic": "/ˌriːˈen.trən.si/",
    "pos": "n.",
    "specTag": "THREAD · MUTEX",
    "level": "Level 2",
    "categoryName": "操作系统与并发",
    "techDefinition": "可重入性",
    "techDetail": "（函数在执行过程中被中断并再次被调用，仍能正确完成）",
    "typicalContext": "递归锁 ReentrantLock · 信号中断处理 · 智能合约重入攻击",
    "source": "Level 2 操作系统",
    "status": "need_review",
    "statusLabel": "待复习",
    "statusColor": "warning",
    "reviewTimes": 1,
    "codeSnippet": {
      "fileName": "EXAMPLE.reentrant_lock.java",
      "lines": [
        {
          "lineNum": "01",
          "isComment": true,
          "code": "// ReentrantLock allows same thread to acquire repeatedly"
        },
        {
          "lineNum": "02",
          "isComment": false,
          "code": "ReentrantLock lock = new ReentrantLock();"
        },
        {
          "lineNum": "03",
          "isComment": false,
          "code": "lock.lock();"
        },
        {
          "lineNum": "04",
          "isComment": false,
          "code": "try { recursiveMethod(); } finally { lock.unlock(); }"
        }
      ]
    },
    "generalDefinition": "可重新进入性（物理上可随时再次进入同一个房间）",
    "designMetaphor": "如同正在弹琴时被电话打断，接完电话后能丝毫不差地继续弹奏，函数被中断后再次进入仍安全正确。",
    "objectiveQuiz": {
      "scenario": "在并发编程与智能合约开发中，一个子程序正在执行途中被线程中断抢占，随后再次被调用执行仍能保证状态完全隔离与正确，这种核心安全属性是？",
      "options": [
        {
          "label": "A",
          "text": "Latency (延迟)",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Reentrancy (可重入性)",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Cache (缓存)",
          "isCorrect": false
        },
        {
          "label": "D",
          "text": "Benchmark (基准标高)",
          "isCorrect": false
        }
      ],
      "explanation": "可重入性 (Reentrancy) 指函数在并发或递归中断再次调用时，不依赖任何全局不安全共享状态，依然能够正确执行。"
    },
    "isVerified": false
  },
  {
    "id": "nb_11",
    "word": "polymorphism",
    "phonetic": "/ˌpɑː.liˈmɔːr.fɪ.zəm/",
    "pos": "n.",
    "specTag": "OOP · RUNTIME",
    "level": "Level 1",
    "categoryName": "编程基础 & 高频报错",
    "techDefinition": "多态",
    "techDetail": "（同一操作作用于不同的对象，可以有不同的解释和执行形式）",
    "typicalContext": "虚函数表 vtable · 接口重写 Override · 动态绑定",
    "source": "Level 1 编程基础",
    "status": "mastered",
    "statusLabel": "已掌握 ✓",
    "statusColor": "success",
    "reviewTimes": 4,
    "codeSnippet": {
      "fileName": "EXAMPLE.polymorphic_handler.cpp",
      "lines": [
        {
          "lineNum": "01",
          "isComment": true,
          "code": "// Runtime dynamic dispatch via virtual table"
        },
        {
          "lineNum": "02",
          "isComment": false,
          "code": "class BaseHandler { public: virtual void handle() = 0; };"
        },
        {
          "lineNum": "03",
          "isComment": false,
          "code": "void execute(BaseHandler* h) { h->handle(); }"
        }
      ]
    },
    "generalDefinition": "多形性、多态性（生物学上同一种生物具有多种不同形态）",
    "designMetaphor": "如同按下一辆车上的喇叭键，不同车型的喇叭发出不同声音，同一抽象接口由不同子类实现不同具体行为。",
    "objectiveQuiz": {
      "scenario": "在电商支付系统中，收银台统一暴露了一个 pay() 接口，但根据用户选择微信、支付宝或银联卡，底层会各自执行完全不同的结算逻辑，这体现了面向对象的？",
      "options": [
        {
          "label": "A",
          "text": "Polymorphism (多态性)",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Deadlock (死锁性)",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Overflow (溢出性)",
          "isCorrect": false
        },
        {
          "label": "D",
          "text": "Deprecation (弃用性)",
          "isCorrect": false
        }
      ],
      "explanation": "多态 (Polymorphism) 允许通过同一公共接口调用不同子类的特定行为，使得系统具备高度的可扩展性与解耦能力。"
    },
    "isVerified": false
  },
  {
    "id": "nb_12",
    "word": "serialize",
    "phonetic": "/ˈsɪr.i.ə.laɪz/",
    "pos": "v.",
    "specTag": "DATA · MARSHAL",
    "level": "Level 2",
    "categoryName": "计算机网络",
    "techDefinition": "序列化",
    "techDetail": "（将内存中的数据结构或对象转换成二进制或字符串以便传输存储）",
    "typicalContext": "Protobuf · JSON.stringify · RPC 跨语言调用",
    "source": "Level 2 计算机网络",
    "status": "mastered",
    "statusLabel": "已掌握 ✓",
    "statusColor": "success",
    "reviewTimes": 3,
    "codeSnippet": {
      "fileName": "EXAMPLE.json_serialize.py",
      "lines": [
        {
          "lineNum": "01",
          "isComment": true,
          "code": "# Serialize in-memory struct into payload bytes"
        },
        {
          "lineNum": "02",
          "isComment": false,
          "code": "import json"
        },
        {
          "lineNum": "03",
          "isComment": false,
          "code": "payload = json.dumps({'cmd': 'PING', 'ts': 168000000})"
        }
      ]
    },
    "generalDefinition": "连载、按顺序排成一列（如小说连载、电影拍成系列）",
    "designMetaphor": "如同把一辆积木小车拆解按顺序装进长条快递盒邮寄，把内存复杂对象拍平成一串字节流以便传输保存。",
    "objectiveQuiz": {
      "scenario": "客户端程序需要把内存中包含多层嵌套关系的用户个人资料对象，转换为一串可以在网络光纤上传输的 JSON 字符串或二进制流，该过程被称为？",
      "options": [
        {
          "label": "A",
          "text": "Instantiate (实例化)",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "Serialize (序列化)",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Traverse (遍历)",
          "isCorrect": false
        },
        {
          "label": "D",
          "text": "Deadlock (死锁)",
          "isCorrect": false
        }
      ],
      "explanation": "序列化 (Serialize) 是将内存中的立体对象数据结构转换成扁平线性的字节流或文本格式，以便存储或网络传输。"
    },
    "isVerified": false
  },
  {
    "id": "nb_13",
    "word": "deserialize",
    "phonetic": "/diːˈsɪr.i.ə.laɪz/",
    "pos": "v.",
    "specTag": "DATA · UNMARSHAL",
    "level": "Level 2",
    "categoryName": "计算机网络",
    "techDefinition": "反序列化",
    "techDetail": "（从二进制流或字符串中重建内存对象）",
    "typicalContext": "反序列化安全漏洞 · 接口参数解析 · 缓存数据还原",
    "source": "Level 2 计算机网络",
    "status": "mastered",
    "statusLabel": "已掌握 ✓",
    "statusColor": "success",
    "reviewTimes": 3,
    "codeSnippet": {
      "fileName": "EXAMPLE.serde_unmarshal.rs",
      "lines": [
        {
          "lineNum": "01",
          "isComment": true,
          "code": "// Parse incoming packet into strongly typed struct"
        },
        {
          "lineNum": "02",
          "isComment": false,
          "code": "let packet: Packet = serde_json::from_str(&raw_str)?;"
        }
      ]
    },
    "generalDefinition": "解开序列、还原连载（把打散排布的对象还原为实体）",
    "designMetaphor": "如同收到快递盒后按照顺序重新把积木拼装成立体小车，把网络字节流还原为内存中立体的对象结构。",
    "objectiveQuiz": {
      "scenario": "服务端从网络 Socket 接收到一段纯二进制字节流，随后根据数据协议将其解析并还原为 Java 或 Go 内存中的立体订单对象，这个逆向恢复过程是？",
      "options": [
        {
          "label": "A",
          "text": "Deserialize (反序列化)",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Sanitize (消毒清洗)",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Deprecate (废弃)",
          "isCorrect": false
        },
        {
          "label": "D",
          "text": "Pagination (分页)",
          "isCorrect": false
        }
      ],
      "explanation": "反序列化 (Deserialize) 是序列化的逆过程，负责把接收到的线性字节流重建为内存中具有特定类型与结构的活对象。"
    },
    "isVerified": false
  },
  {
    "id": "nb_14",
    "word": "checksum",
    "phonetic": "/ˈtʃek.sʌm/",
    "pos": "n.",
    "specTag": "NET · INTEGRITY",
    "level": "Level 2",
    "categoryName": "计算机网络",
    "techDefinition": "校验和",
    "techDetail": "（用于检测数据在传输或存储过程中是否发生错误的数值）",
    "typicalContext": "TCP/UDP 首部校验 · MD5/SHA256 文件完整性 · 循环冗余 CRC",
    "source": "文档阅读",
    "status": "need_review",
    "statusLabel": "待复习",
    "statusColor": "warning",
    "reviewTimes": 1,
    "codeSnippet": {
      "fileName": "EXAMPLE.udp_checksum.c",
      "lines": [
        {
          "lineNum": "01",
          "isComment": true,
          "code": "/* 16-bit one's complement sum of UDP header + data */"
        },
        {
          "lineNum": "02",
          "isComment": false,
          "code": "unsigned short sum = calculate_checksum(buf, len);"
        },
        {
          "lineNum": "03",
          "isComment": false,
          "code": "if (sum != udph->check) { drop_packet(); }"
        }
      ]
    },
    "generalDefinition": "核对和、校验值（对账单中各项数字相加用于比对总账）",
    "designMetaphor": "如同快递包裹箱上的防拆封易碎封条，接收端重新计算比对封条以确认数据传输中未损坏或遭篡改。",
    "objectiveQuiz": {
      "scenario": "用户从官网下载了一个 5GB 的系统镜像文件，为了防止网络下载过程中丢包损坏或被中间人恶意篡改，用户通常会比对官网提供的 MD5 或 SHA256 值，这属于？",
      "options": [
        {
          "label": "A",
          "text": "Checksum (校验和验证)",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Latency (延迟测试)",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Middleware (中间件拦截)",
          "isCorrect": false
        },
        {
          "label": "D",
          "text": "Instantiation (实例化)",
          "isCorrect": false
        }
      ],
      "explanation": "校验和 (Checksum) 用于检测数据在传输或存储期间是否发生意外损坏或恶意篡改，确保数据完整性 (Integrity)。"
    },
    "isVerified": false
  },
  {
    "id": "nb_15",
    "word": "throughput",
    "phonetic": "/ˈθruː.pʊt/",
    "pos": "n.",
    "specTag": "SYS · BENCHMARK",
    "level": "Level 2",
    "categoryName": "操作系统与并发",
    "techDefinition": "吞吐量",
    "techDetail": "（单位时间内系统成功处理的请求数或传输的数据量）",
    "typicalContext": "QPS/TPS 压测指标 · 网卡带宽利用率 · 数据库读写吞吐",
    "source": "Level 2 操作系统",
    "status": "mastered",
    "statusLabel": "已掌握 ✓",
    "statusColor": "success",
    "reviewTimes": 2,
    "codeSnippet": {
      "fileName": "EXAMPLE.benchmark.go",
      "lines": [
        {
          "lineNum": "01",
          "isComment": true,
          "code": "// Benchmark system throughput under stress"
        },
        {
          "lineNum": "02",
          "isComment": false,
          "code": "func BenchmarkThroughput(b *testing.B) {"
        },
        {
          "lineNum": "03",
          "isComment": false,
          "code": "  b.SetBytes(1024 * 1024) // 1MB per op"
        },
        {
          "lineNum": "04",
          "isComment": false,
          "code": "}"
        }
      ]
    },
    "generalDefinition": "生产量、吞吐量（工厂管道在单位时间内实际输出的产品量）",
    "designMetaphor": "如同高速公路收费站每小时能通过的车辆总数，衡量系统单位时间内实际完成处理的业务请求总量。",
    "objectiveQuiz": {
      "scenario": "技术总监在评估新的消息队列集群时指出：「该集群在持续压测下每秒钟能够稳定处理并投递 50 万条业务消息」，这里的指标衡量的是系统的？",
      "options": [
        {
          "label": "A",
          "text": "Throughput (吞吐量)",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Deadlock (死锁率)",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Deprecation (废弃度)",
          "isCorrect": false
        },
        {
          "label": "D",
          "text": "Traversal (遍历深度)",
          "isCorrect": false
        }
      ],
      "explanation": "吞吐量 (Throughput) 反映系统在特定时间窗口内的生产能力与综合数据处理带宽上限。"
    },
    "isVerified": false
  },
  {
    "id": "nb_16",
    "word": "pagination",
    "phonetic": "/ˌpædʒ.əˈneɪ.ʃən/",
    "pos": "n.",
    "specTag": "DB · QUERY",
    "level": "Level 2",
    "categoryName": "数据结构与核心算法",
    "techDefinition": "分页",
    "techDetail": "（将大规模连续数据划分为离散页面按需加载的技术）",
    "typicalContext": "LIMIT & OFFSET · 游标分页 Cursor Pagination · 虚拟列表",
    "source": "Level 2 核心算法",
    "status": "mastered",
    "statusLabel": "已掌握 ✓",
    "statusColor": "success",
    "reviewTimes": 3,
    "codeSnippet": {
      "fileName": "EXAMPLE.pagination.sql",
      "lines": [
        {
          "lineNum": "01",
          "isComment": true,
          "code": "-- Efficient keyset pagination avoiding deep offset"
        },
        {
          "lineNum": "02",
          "isComment": false,
          "code": "SELECT id, title FROM articles"
        },
        {
          "lineNum": "03",
          "isComment": false,
          "code": "WHERE id > :last_seen_id ORDER BY id ASC LIMIT 20;"
        }
      ]
    },
    "generalDefinition": "标记页码、图书编页排版",
    "designMetaphor": "如同翻阅一本 1000 页的厚字典每次只看一页，数据库查询海量记录时按每页限制条数分批返回展示。",
    "objectiveQuiz": {
      "scenario": "电商后台订单库中有 1000 万条历史交易记录，前端列表在展示时每次只拉取第 1 页的 20 条，用户点击下一页再加载后续 20 条，这种设计被称为？",
      "options": [
        {
          "label": "A",
          "text": "Pagination (分页机制)",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Overflow (溢出机制)",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Checksum (校验机制)",
          "isCorrect": false
        },
        {
          "label": "D",
          "text": "Reentrancy (重入机制)",
          "isCorrect": false
        }
      ],
      "explanation": "分页 (Pagination) 将海量数据结果集切分成便于浏览与传输的有限页块，防止一次性读取击垮数据库与前端内存。"
    },
    "isVerified": false
  },
  {
    "id": "nb_17",
    "word": "middleware",
    "phonetic": "/ˈmɪd.əl.wer/",
    "pos": "n.",
    "specTag": "HTTP · PIPELINE",
    "level": "Level 2",
    "categoryName": "计算机网络",
    "techDefinition": "中间件",
    "techDetail": "（串联在请求与最终处理函数之间的管道拦截处理程序）",
    "typicalContext": "Express app.use · 鉴权拦截器 Auth · 日志追踪 Tracing",
    "source": "Level 2 计算机网络",
    "status": "mastered",
    "statusLabel": "已掌握 ✓",
    "statusColor": "success",
    "reviewTimes": 3,
    "codeSnippet": {
      "fileName": "EXAMPLE.auth_middleware.ts",
      "lines": [
        {
          "lineNum": "01",
          "isComment": true,
          "code": "// Pipeline middleware for token validation"
        },
        {
          "lineNum": "02",
          "isComment": false,
          "code": "export function authMiddleware(req, res, next) {"
        },
        {
          "lineNum": "03",
          "isComment": false,
          "code": "  if (!req.headers.token) return res.status(401);"
        },
        {
          "lineNum": "04",
          "isComment": false,
          "code": "  next();"
        },
        {
          "lineNum": "05",
          "isComment": false,
          "code": "}"
        }
      ]
    },
    "generalDefinition": "中间件（在两个主要机构或系统之间起桥梁撮合作用的实体）",
    "designMetaphor": "如同机场安检通道中登机前的身份核验与行李扫描，在请求到达最终业务控制器前层层执行的拦截插件。",
    "objectiveQuiz": {
      "scenario": "在 Web 框架设计中，开发人员希望在所有 HTTP 请求到达业务控制器之前，统一拦截并自动完成 JWT 登录鉴权、全局请求日志记录与防刷限流，这类通用拦截组件称为？",
      "options": [
        {
          "label": "A",
          "text": "Middleware (中间件)",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Deadlock (死锁)",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Benchmark (基准测试)",
          "isCorrect": false
        },
        {
          "label": "D",
          "text": "Overflow (溢出)",
          "isCorrect": false
        }
      ],
      "explanation": "中间件 (Middleware) 处于网络请求与核心业务逻辑之间，以管道拦截器模式提供鉴权、路由、监控等横切公共能力。"
    },
    "isVerified": false
  },
  {
    "id": "nb_18",
    "word": "deprecated",
    "phonetic": "/ˈdep.rə.keɪ.t̬ɪd/",
    "pos": "adj.",
    "specTag": "API · COMPAT",
    "level": "Level 1",
    "categoryName": "编程基础 & 高频报错",
    "techDefinition": "已废弃的 / 已弃用的",
    "techDetail": "（软件功能仍然可用但不建议使用，并将在后续版本移除）",
    "typicalContext": "@deprecated 标注 · 编译警告 · 破坏性升级迁移",
    "source": "Level 1 编程基础",
    "status": "mastered",
    "statusLabel": "已掌握 ✓",
    "statusColor": "success",
    "reviewTimes": 4,
    "codeSnippet": {
      "fileName": "EXAMPLE.deprecation.ts",
      "lines": [
        {
          "lineNum": "01",
          "isComment": true,
          "code": "/** @deprecated Use client.queryV2() instead */"
        },
        {
          "lineNum": "02",
          "isComment": false,
          "code": "function legacyQuery(sql: string) {"
        },
        {
          "lineNum": "03",
          "isComment": false,
          "code": "  console.warn('legacyQuery is deprecated');"
        },
        {
          "lineNum": "04",
          "isComment": false,
          "code": "}"
        }
      ]
    },
    "generalDefinition": "反对、不赞成、不建议使用（已过时且被官方宣布弃用）",
    "designMetaphor": "如同老款手机充电口在说明书上被标记为停产淘汰，官方不再推荐使用并将在未来大版本中彻底移除。",
    "objectiveQuiz": {
      "scenario": "升级开源框架版本后，终端控制台弹出醒目黄色警告，提示某个老旧方法已经不推荐在新项目中使用，并将在 3.0 大版本中彻底移除，该状态术语是？",
      "options": [
        {
          "label": "A",
          "text": "Deprecated (已废弃/弃用)",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Instantiated (已实例化)",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Synchronized (已同步)",
          "isCorrect": false
        },
        {
          "label": "D",
          "text": "Concurrent (并发的)",
          "isCorrect": false
        }
      ],
      "explanation": "Deprecated 代表软件或规范中已被官方标记为过时的特性，当前保留仅为了向后兼容，强烈建议迁移替代方案。"
    },
    "isVerified": false
  },
  {
    "id": "nb_19",
    "word": "immutable",
    "phonetic": "/ɪˈmjuː.t̬ə.bəl/",
    "pos": "adj.",
    "specTag": "STATE · MEMORY",
    "level": "Level 2",
    "categoryName": "操作系统与并发",
    "techDefinition": "不可变的",
    "techDetail": "（创建后其状态和内部值不能被修改的数据结构）",
    "typicalContext": "函数式编程 · 并发线程安全无锁读取 · React 状态不可变性",
    "source": "Level 2 操作系统",
    "status": "mastered",
    "statusLabel": "已掌握 ✓",
    "statusColor": "success",
    "reviewTimes": 3,
    "codeSnippet": {
      "fileName": "EXAMPLE.immutable_state.rs",
      "lines": [
        {
          "lineNum": "01",
          "isComment": true,
          "code": "// Variables are immutable by default in Rust"
        },
        {
          "lineNum": "02",
          "isComment": false,
          "code": "let config_data = Arc::new(Config::load());"
        },
        {
          "lineNum": "03",
          "isComment": false,
          "code": "// Thread safe to share across threads without lock"
        }
      ]
    },
    "generalDefinition": "永恒不变的、不可更改的（如自然法则不可变更）",
    "designMetaphor": "如同刻在石碑上的法律铭文一旦刻定就不可擦除，数据对象创建后任何修改都只会生成一份全新副本。",
    "objectiveQuiz": {
      "scenario": "在函数式编程与高并发架构中，为了从根本上杜绝多线程读写引发的数据竞争，开发团队要求配置对象在创建后不允许被任何线程篡改，这种核心特性是？",
      "options": [
        {
          "label": "A",
          "text": "Immutable (不可变性)",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Deadlock (死锁性)",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Latency (延迟性)",
          "isCorrect": false
        },
        {
          "label": "D",
          "text": "Overflow (溢出性)",
          "isCorrect": false
        }
      ],
      "explanation": "不可变 (Immutable) 确保数据实体状态只读且天然线程安全，修改操作通过创建新副本完成，彻底消除了数据争用风险。"
    },
    "isVerified": false
  },
  {
    "id": "nb_20",
    "word": "pipeline",
    "phonetic": "/ˈpaɪp.laɪn/",
    "pos": "n.",
    "specTag": "SYS · STREAM",
    "level": "Level 2",
    "categoryName": "操作系统与并发",
    "techDefinition": "流水线 / 管道",
    "techDetail": "（将前一个阶段的输出作为下一个阶段输入的连续处理链）",
    "typicalContext": "Unix 管道符 | · CI/CD 自动化构建流 · CPU 指令流水线",
    "source": "Level 2 操作系统",
    "status": "mastered",
    "statusLabel": "已掌握 ✓",
    "statusColor": "success",
    "reviewTimes": 4,
    "codeSnippet": {
      "fileName": "EXAMPLE.pipe.sh",
      "lines": [
        {
          "lineNum": "01",
          "isComment": true,
          "code": "# Chain stdout of cat into grep filter pipeline"
        },
        {
          "lineNum": "02",
          "isComment": false,
          "code": "cat access.log | grep '500 Internal' | awk '{print $1}'"
        }
      ]
    },
    "generalDefinition": "输油/自来水管道、流水线（液体在长管道中逐段输送）",
    "designMetaphor": "如同汽车装配厂的流水线装配工位，前一道工序的输出作为下一道工序的输入，多阶段并发重叠执行。",
    "objectiveQuiz": {
      "scenario": "在现代 DevOps 自动化运维中，代码一旦合并到主分支，就会按顺序自动触发代码编译、单元测试、安全扫描、镜像打包与容器发布，这一自动化处理链条被称为？",
      "options": [
        {
          "label": "A",
          "text": "Pipeline (CI/CD 自动化流水线)",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Deadlock (死锁)",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Cache (缓存)",
          "isCorrect": false
        },
        {
          "label": "D",
          "text": "Pagination (分页)",
          "isCorrect": false
        }
      ],
      "explanation": "流水线 (Pipeline) 将复杂处理链路解构为线性串联的工序，实现自动化、高吞吐的多阶段持续交付与数据流转。"
    },
    "isVerified": false
  },
  {
    "id": "nb_21",
    "word": "benchmark",
    "phonetic": "/ˈbentʃ.mɑːrk/",
    "pos": "n. & v.",
    "specTag": "PERF · TESTING",
    "level": "Level 1",
    "categoryName": "编程基础 & 高频报错",
    "techDefinition": "基准测试",
    "techDetail": "（用标准负载评估程序运行时间、内存分配等性能指标的测试）",
    "typicalContext": "Go benchmark · 微基准测试 microbench · 算法复杂度评估",
    "source": "Level 1 编程基础",
    "status": "mastered",
    "statusLabel": "已掌握 ✓",
    "statusColor": "success",
    "reviewTimes": 2,
    "codeSnippet": {
      "fileName": "EXAMPLE.bench_test.go",
      "lines": [
        {
          "lineNum": "01",
          "isComment": true,
          "code": "// Run benchmark: go test -bench=."
        },
        {
          "lineNum": "02",
          "isComment": false,
          "code": "func BenchmarkHash(b *testing.B) {"
        },
        {
          "lineNum": "03",
          "isComment": false,
          "code": "  for i := 0; i < b.N; i++ { computeSha256(data) }"
        },
        {
          "lineNum": "04",
          "isComment": false,
          "code": "}"
        }
      ]
    },
    "generalDefinition": "水准点、基准标高（测量学中凿在岩石上的水平基准标志）",
    "designMetaphor": "如同新车出厂前在专用测试跑道上测百公里加速，用标准化负载程序客观度量系统极限制性能指标。",
    "objectiveQuiz": {
      "scenario": "技术团队在升级数据库引擎前，编写了专门的压力脚本模拟 10 万并发读写，以定量测量新旧引擎在相同标准条件下的 TPS 与 CPU 消耗对比，这项工作属于？",
      "options": [
        {
          "label": "A",
          "text": "Benchmark (基准性能评测)",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Sanitization (数据消毒)",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Deprecation (弃用通知)",
          "isCorrect": false
        },
        {
          "label": "D",
          "text": "Traversal (图遍历)",
          "isCorrect": false
        }
      ],
      "explanation": "基准测试 (Benchmark) 是在可控、可复现的标准负载环境下，对计算机软硬件性能进行的定量对比与度量测试。"
    },
    "isVerified": false
  },
  {
    "id": "nb_22",
    "word": "handshake",
    "phonetic": "/ˈhænd.ʃeɪk/",
    "pos": "n.",
    "specTag": "TCP · ESTABLISH",
    "level": "Level 2",
    "categoryName": "计算机网络",
    "techDefinition": "握手",
    "techDetail": "（两台通信设备在正式交换数据前协商连接参数的信令交互过程）",
    "typicalContext": "TCP 三次握手 · TLS 证书秘钥协商握手 · WebSocket 升级握手",
    "source": "文档阅读",
    "status": "need_review",
    "statusLabel": "待复习",
    "statusColor": "warning",
    "reviewTimes": 1,
    "codeSnippet": {
      "fileName": "EXAMPLE.tls_handshake.go",
      "lines": [
        {
          "lineNum": "01",
          "isComment": true,
          "code": "// Perform TLS crypto & cert negotiation handshake"
        },
        {
          "lineNum": "02",
          "isComment": false,
          "code": "conn := tls.Client(rawConn, config)"
        },
        {
          "lineNum": "03",
          "isComment": false,
          "code": "err := conn.Handshake()"
        }
      ]
    },
    "generalDefinition": "握手（社交礼仪中表示友好与达成初步共识的动作）",
    "designMetaphor": "如同商务会面时双方握手寒暄确认对方身份与合作意向，TCP 或 SSL 在正式传输数据前建立会话的协商确认。",
    "objectiveQuiz": {
      "scenario": "浏览器首次通过 HTTPS 访问银行官网时，双方需要先交换证书校验对方公钥身份，并协同协商出一套对称加密密钥，这个前置协商流程称为？",
      "options": [
        {
          "label": "A",
          "text": "Handshake (SSL/TLS 安全握手)",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Overflow (溢出故障)",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Deadlock (死锁异常)",
          "isCorrect": false
        },
        {
          "label": "D",
          "text": "Pagination (分页检索)",
          "isCorrect": false
        }
      ],
      "explanation": "握手 (Handshake) 指两端在建立数据传输通道初期，进行双向身份识别、安全密钥协商和参数确认的交互过程。"
    },
    "isVerified": false
  },
  {
    "id": "nb_23",
    "word": "overflow",
    "phonetic": "/ˌoʊ.vɚˈfloʊ/",
    "pos": "n. & v.",
    "specTag": "MEMORY · SAFETY",
    "level": "Level 1",
    "categoryName": "编程基础 & 高频报错",
    "techDefinition": "溢出",
    "techDetail": "（数据超出变量类型所能存储的最大容量限制而发生截断或回绕）",
    "typicalContext": "堆栈溢出 StackOverflow · 整数溢出 Integer Overflow · 缓冲区溢出",
    "source": "Level 1 编程基础",
    "status": "need_review",
    "statusLabel": "待复习",
    "statusColor": "warning",
    "reviewTimes": 1,
    "codeSnippet": {
      "fileName": "EXAMPLE.int_overflow.c",
      "lines": [
        {
          "lineNum": "01",
          "isComment": true,
          "code": "// Undefined behavior: Signed integer overflow"
        },
        {
          "lineNum": "02",
          "isComment": false,
          "code": "int max_val = 2147483647;"
        },
        {
          "lineNum": "03",
          "isComment": false,
          "code": "int wrapped = max_val + 1; // negative result"
        }
      ]
    },
    "generalDefinition": "溢出、泛滥（水杯注水过多溢流到桌面外）",
    "designMetaphor": "如同小茶杯装不下大水壶倒入的开水导致溢出，数值计算或数据输入超出分配的内存缓冲区存储上限。",
    "objectiveQuiz": {
      "scenario": "在没有跳出出口的深层死递归调用中，程序不断把局部变量和返回地址压入执行栈，最终耗尽系统分配的栈空间导致程序崩溃，这类典型崩溃错误是？",
      "options": [
        {
          "label": "A",
          "text": "Stack Overflow (栈溢出)",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Throughput (吞吐量)",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Handshake (握手)",
          "isCorrect": false
        },
        {
          "label": "D",
          "text": "Polymorphism (多态)",
          "isCorrect": false
        }
      ],
      "explanation": "溢出 (Overflow) 发生于数据量或调用深度超过系统预分配的存储边界时，如整数溢出 (Integer Overflow) 或栈溢出 (Stack Overflow)。"
    },
    "isVerified": false
  },
  {
    "id": "nb_24",
    "word": "cache",
    "phonetic": "/kæʃ/",
    "pos": "n. & v.",
    "specTag": "STORAGE · MEMORY",
    "level": "Level 2",
    "categoryName": "计算机网络",
    "techDefinition": "缓存 / 高速缓存",
    "techDetail": "（将高频访问的数据暂存在快速存储介质中以减少慢速查询开销）",
    "typicalContext": "Redis LRU 淘汰 · 浏览器 Cache-Control · CPU L1/L2 缓存",
    "source": "Level 2 计算机网络",
    "status": "mastered",
    "statusLabel": "已掌握 ✓",
    "statusColor": "success",
    "reviewTimes": 4,
    "codeSnippet": {
      "fileName": "EXAMPLE.redis_cache.ts",
      "lines": [
        {
          "lineNum": "01",
          "isComment": true,
          "code": "// Cache-Aside pattern implementation"
        },
        {
          "lineNum": "02",
          "isComment": false,
          "code": "let data = await redis.get(cacheKey);"
        },
        {
          "lineNum": "03",
          "isComment": false,
          "code": "if (!data) { data = await db.query(); await redis.set(cacheKey, data, 'EX', 3600); }"
        }
      ]
    },
    "generalDefinition": "秘密藏匿处、贮藏物（探险家在雪地沿途掩埋的应急干粮暗格）",
    "designMetaphor": "如同程序员把常用的钥匙放在玄关鞋柜上而不是锁在卧室保险柜，把热点数据就近存放以极速换取响应。",
    "objectiveQuiz": {
      "scenario": "为避免每一次商品详情页访问都重复执行耗时 200 毫秒的昂贵 MySQL 复杂连表查询，架构师引入 Redis 将热门商品数据暂存在内存中供毫秒级读取，这种设计技术是？",
      "options": [
        {
          "label": "A",
          "text": "Cache (缓存技术)",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Deadlock (死锁)",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Overflow (溢出)",
          "isCorrect": false
        },
        {
          "label": "D",
          "text": "Deprecation (弃用)",
          "isCorrect": false
        }
      ],
      "explanation": "缓存 (Cache) 利用高速存储介质暂存高频被访问的数据副本，减少对低速后端存储的重复开销，显著降低延迟并提升吞吐。"
    },
    "isVerified": false
  }
,
  {
    "id": "nb_25",
    "word": "resilience",
    "phonetic": "/rɪˈzɪl.jəns/",
    "pos": "n.",
    "specTag": "SRE · RESILIENCE",
    "level": "Level 2",
    "categoryName": "云原生与微服务通信",
    "techDefinition": "【计】系统韧性 / 容灾弹性",
    "techDetail": "系统在经历网络抖动、节点故障或超载压力后，能自动隔离风险并自愈恢复正常服务的能力",
    "typicalContext": "💡 典型工程语境：Chaos Engineering · 自动容灾切换 · 熔断降级 · 弹性伸缩",
    "source": "边缘代理架构与高可用实践",
    "status": "need_review",
    "statusLabel": "待复习",
    "statusColor": "warning",
    "reviewTimes": 1,
    "codeSnippet": {
      "fileName": "EXAMPLE.resilience_breaker.go",
      "lines": [
        {
          "lineNum": "01",
          "isComment": true,
          "code": "// Go: Circuit Breaker for System Resilience"
        },
        {
          "lineNum": "02",
          "isComment": false,
          "code": "cb := circuit.NewBreaker(circuit.Settings{"
        },
        {
          "lineNum": "03",
          "isComment": false,
          "code": "  MaxRequests: 3, Timeout: 5 * time.Second,"
        },
        {
          "lineNum": "04",
          "isComment": false,
          "code": "  ReadyToTrip: ",
          "highlight": "circuit.RateFailure(0.6)",
          "suffix": ","
        },
        {
          "lineNum": "05",
          "isComment": false,
          "code": "})"
        }
      ]
    },
    "generalDefinition": "恢复力，韧性，弹性（如橡皮筋拉伸后复原的能力）",
    "designMetaphor": "如同带有自动隔水密闭舱的现代远洋轮船，即使单个隔舱破损进水也能迅速切断隔离，整船依然能够安全平稳航行。",
    "objectiveQuiz": {
      "scenario": "在微服务分布式高可用演进中，团队经常通过在生产镜像环境注入人工故障（如模拟网络分区或随机杀死容器）来验证极端灾难下的系统自愈恢复能力。这种工程能力通常被称为什么？",
      "options": [
        {
          "label": "A",
          "text": "Deadlock Prevention (死锁预防)",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "System Resilience (系统弹性与韧性)",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "Stateless Routing (无状态路由)",
          "isCorrect": false
        },
        {
          "label": "D",
          "text": "Token Bucket (令牌桶限流)",
          "isCorrect": false
        }
      ],
      "explanation": "系统韧性 (Resilience) 是分布式系统面对不可预知硬件故障与洪峰流量时的容错、自愈和持续服务能力，混沌工程 (Chaos Engineering) 是检验韧性的核心手段。"
    },
    "isVerified": false
  },
  {
    "id": "nb_26",
    "word": "exhaustion",
    "phonetic": "/ɪɡˈzɑː.stʃən/",
    "pos": "n.",
    "specTag": "SYS · RESOURCE",
    "level": "Level 2",
    "categoryName": "操作系统与并发内核",
    "techDefinition": "【计】资源耗尽 / 内存溢出枯竭",
    "techDetail": "计算节点在面对并发突增或内存泄漏时，系统物理内存、TCP 文件描述符句柄或连接池被完全占满耗尽",
    "typicalContext": "💡 典型工程语境：OOM (Out Of Memory) · 内存泄漏 · FD 句柄耗尽 · 线程池枯竭",
    "source": "边缘代理架构与高可用实践",
    "status": "need_review",
    "statusLabel": "待复习",
    "statusColor": "warning",
    "reviewTimes": 1,
    "codeSnippet": {
      "fileName": "EXAMPLE.resource_guard.rs",
      "lines": [
        {
          "lineNum": "01",
          "isComment": true,
          "code": "// Rust: Prevent Heap Memory Exhaustion"
        },
        {
          "lineNum": "02",
          "isComment": false,
          "code": "if current_allocated > MAX_HEAP_THRESHOLD {"
        },
        {
          "lineNum": "03",
          "isComment": false,
          "code": "  log::warn!(\"Approaching memory exhaustion!\");"
        },
        {
          "lineNum": "04",
          "isComment": false,
          "code": "  return Err(",
          "highlight": "Error::ResourceExhausted",
          "suffix": ");"
        },
        {
          "lineNum": "05",
          "isComment": false,
          "code": "}"
        }
      ]
    },
    "generalDefinition": "精疲力竭，用尽，耗竭",
    "designMetaphor": "如同水库蓄水池被无节制抽水直到见底，导致下游所有水力发电机组因彻底断水而陷入瘫痪停摆。",
    "objectiveQuiz": {
      "scenario": "在高并发网络服务器运维排障中，如果操作系统内核频繁抛出 'too many open files' 报错，导致新的客户端 TCP 握手连接直接被丢弃拒绝，这属于哪种系统资源的耗尽？",
      "options": [
        {
          "label": "A",
          "text": "CPU Context Switching (CPU 上下文切换)",
          "isCorrect": false
        },
        {
          "label": "B",
          "text": "File Descriptor Exhaustion (文件句柄资源耗尽)",
          "isCorrect": true
        },
        {
          "label": "C",
          "text": "DNS Cache Expiration (DNS 缓存过期)",
          "isCorrect": false
        },
        {
          "label": "D",
          "text": "TLS Cipher Incompatibility (TLS 加密套件不兼容)",
          "isCorrect": false
        }
      ],
      "explanation": "在 Linux 系统中，每个套接字连接均对应一个文件描述符 (File Descriptor)。句柄耗尽 (FD Exhaustion) 会导致进程无法创建新连接，必须调大 ulimit 并及时关闭连接池闲置 socket。"
    },
    "isVerified": false
  },
  {
    "id": "nb_27",
    "word": "infrastructure",
    "phonetic": "/ˈɪn.frəˌstrʌk.tʃɚ/",
    "pos": "n.",
    "specTag": "CLOUD · INFRA",
    "level": "Level 2",
    "categoryName": "云原生与微服务通信",
    "techDefinition": "【计】底层算力基础设施 / 云底座",
    "techDetail": "支撑上层软件系统运行的物理服务器、机房网络、存储阵列、虚拟化容器集群等软硬件基础底座",
    "typicalContext": "💡 典型工程语境：Infrastructure as Code (IaC) · 云原生基建 · 异地多活基础设施",
    "source": "边缘代理架构与高可用实践",
    "status": "need_review",
    "statusLabel": "待复习",
    "statusColor": "warning",
    "reviewTimes": 1,
    "codeSnippet": {
      "fileName": "EXAMPLE.infra_iac.tf",
      "lines": [
        {
          "lineNum": "01",
          "isComment": true,
          "code": "// Terraform: Declarative Cloud Infrastructure"
        },
        {
          "lineNum": "02",
          "isComment": false,
          "code": "resource \"aws_eks_cluster\" \"edge_mesh\" {"
        },
        {
          "lineNum": "03",
          "isComment": false,
          "code": "  name     = \"prod-edge-proxy\","
        },
        {
          "lineNum": "04",
          "isComment": false,
          "code": "  role_arn = ",
          "highlight": "aws_iam_role.cluster_role.arn",
          "suffix": ","
        },
        {
          "lineNum": "05",
          "isComment": false,
          "code": "}"
        }
      ]
    },
    "generalDefinition": "基础设施，公共服务设施（如公路铁路水利电网）",
    "designMetaphor": "如同城市的自来水管网与高压电网，默默埋藏在地底却每分每秒为所有现代建筑提供生存动能。",
    "objectiveQuiz": {
      "scenario": "现代大型互联网团队普遍提倡使用 Terraform 或 Kubernetes YAML 声明式配置来代替人工在云厂商控制台上点选创建服务器和网络，这种运维实践被称为什么？",
      "options": [
        {
          "label": "A",
          "text": "Infrastructure as Code (基础设施即代码 · IaC)",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "Single Point of Failure (单点故障架构)",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "Manual Provisioning (人工手动拨测)",
          "isCorrect": false
        },
        {
          "label": "D",
          "text": "Static Code Analysis (静态代码扫描)",
          "isCorrect": false
        }
      ],
      "explanation": "基础设施即代码 (IaC) 通过版本控制代码来定义和管理计算、存储与网络资源，确保了基础设施的可重复部署与变更审计。"
    },
    "isVerified": false
  },
  {
    "id": "nb_28",
    "word": "availability",
    "phonetic": "/əˌveɪ.ləˈbɪl.ə.t̬i/",
    "pos": "n.",
    "specTag": "SRE · SLA",
    "level": "Level 2",
    "categoryName": "分布式架构与高可用",
    "techDefinition": "【计】系统高可用性 (High Availability)",
    "techDetail": "系统在面对硬件损坏、网络抖动和升级变更时，依然能够持续对外响应正常请求的时间比例（如 99.99% 四个九）",
    "typicalContext": "💡 典型工程语境：High Availability (HA) · SLA 99.99% 服务等级协议 · 容灾可用性",
    "source": "边缘代理架构与高可用实践",
    "status": "need_review",
    "statusLabel": "待复习",
    "statusColor": "warning",
    "reviewTimes": 1,
    "codeSnippet": {
      "fileName": "EXAMPLE.health_check.go",
      "lines": [
        {
          "lineNum": "01",
          "isComment": true,
          "code": "// Go: Cluster High Availability Health Probe"
        },
        {
          "lineNum": "02",
          "isComment": false,
          "code": "func ProbeNodeHealth(ctx context.Context) bool {"
        },
        {
          "lineNum": "03",
          "isComment": false,
          "code": "  status := cluster.",
          "highlight": "QueryActiveHeartbeat",
          "suffix": "(ctx)"
        },
        {
          "lineNum": "04",
          "isComment": false,
          "code": "  return status.IsAvailable && status.LatencyMs < 50"
        },
        {
          "lineNum": "05",
          "isComment": false,
          "code": "}"
        }
      ]
    },
    "generalDefinition": "可获得性，可用性，有空",
    "designMetaphor": "如同 24 小时全天候营业的三甲医院急诊室，哪怕遭遇停电也有独立柴油发电机瞬间接管，永远保持接诊状态。",
    "objectiveQuiz": {
      "scenario": "在云服务厂商提供的 SLA（服务等级协议）保障中，通常承诺系统具备 '四个九 (99.99%)' 的运行指标，这指的是一年中全站意外停机故障时间不能超过大约多少？",
      "options": [
        {
          "label": "A",
          "text": "约 52 分钟",
          "isCorrect": true
        },
        {
          "label": "B",
          "text": "约 8.7 小时",
          "isCorrect": false
        },
        {
          "label": "C",
          "text": "约 3 天",
          "isCorrect": false
        },
        {
          "label": "D",
          "text": "约 1 秒钟",
          "isCorrect": false
        }
      ],
      "explanation": "一年总时间为 365 * 24 * 60 = 525,600 分钟。四个九即 99.99%，不可用时间占比 0.01%，计算得 525,600 * 0.0001 ≈ 52.56 分钟。"
    },
    "isVerified": false
  }
];

// 默认用户学习档案与偏好
const defaultUserProfile = {
  nickname: "VibeCoder",
  nickName: "VibeCoder",
  avatarUrl: "",
  targetDomain: "后端研发 / 云原生架构师",
  developerRole: "后端研发 / 云原生架构师",
  tag: "全栈工程师",
  dailyGoal: 20,
  reviewAlarm: "每天 21:00",
  streakDays: 0, // 连续天数若无则为 0
  totalReadArticles: 12,
  syncStatus: "已同步云端"
};

// 默认今日学习进度
const defaultTodayProgress = {
  learnedCount: 5,
  dailyGoal: 20,
  lastStudyDate: new Date().toDateString()
};

let memoryStore = null;

/**
 * 获取完整 Store 数据对象
 */
function getStore() {
  let store = null;
  try {
    if (typeof wx !== 'undefined' && wx.getStorageSync) {
      store = wx.getStorageSync(STORAGE_KEY);
    } else {
      store = memoryStore;
    }
  } catch (e) {
    console.warn('Failed to read storage, fallback to memory', e);
    store = memoryStore;
  }

  if (!store || !store.words || store.words.length === 0) {
    let migratedUser = { ...defaultUserProfile };
    let migratedToday = { ...defaultTodayProgress };
    let userCustomWords = [];
    try {
      if (typeof wx !== 'undefined' && wx.getStorageSync) {
        const oldStore = wx.getStorageSync('tech_vocab_store_v2');
        if (oldStore) {
          if (oldStore.user) migratedUser = { ...migratedUser, ...oldStore.user };
          if (oldStore.today) migratedToday = { ...migratedToday, ...oldStore.today };
          if (Array.isArray(oldStore.words)) {
            userCustomWords = oldStore.words.filter(w => w.id && w.id.startsWith('nb_') && parseInt(w.id.slice(3), 10) > 24);
          }
        }
      }
    } catch (e) {
      console.warn('Migration from v2 failed:', e);
    }

    store = {
      words: [...userCustomWords, ...JSON.parse(JSON.stringify(initialWordLibrary))],
      user: migratedUser,
      today: migratedToday
    };
    saveStore(store);
  } else {
    if (!store.user) {
      store.user = { ...defaultUserProfile };
    }
    // 补齐缺失字段并确保无连续天数时为 0
    if (store.user.streakDays === undefined || store.user.streakDays === null) {
      store.user.streakDays = 0;
    }
    if (!store.user.nickname) {
      store.user.nickname = store.user.nickName || "VibeCoder";
    }
    if (!store.user.targetDomain) {
      store.user.targetDomain = store.user.developerRole || "后端研发 / 云原生架构师";
    }
    if (!store.user.syncStatus) {
      store.user.syncStatus = "已同步云端";
    }
    if (!store.user.totalReadArticles) {
      store.user.totalReadArticles = 12;
    }
    // 确保升级时补齐 generalDefinition, designMetaphor, objectiveQuiz
    let hasUpdated = false;
    store.words = store.words.map(w => {
      const init = initialWordLibrary.find(item => item.id === w.id || item.word.toLowerCase() === w.word.toLowerCase());
      if (init) {
        if (!w.generalDefinition || !w.designMetaphor || !w.objectiveQuiz) {
          hasUpdated = true;
          return {
            ...init,
            ...w,
            generalDefinition: w.generalDefinition || init.generalDefinition,
            designMetaphor: w.designMetaphor || init.designMetaphor,
            objectiveQuiz: w.objectiveQuiz || init.objectiveQuiz,
            isVerified: w.isVerified !== undefined ? w.isVerified : false
          };
        }
      }
      return w;
    });
    if (hasUpdated) {
      saveStore(store);
    }
  }

  // 跨天重置今日背词计数
  const todayDate = new Date().toDateString();
  if (store.today && store.today.lastStudyDate !== todayDate) {
    store.today.lastStudyDate = todayDate;
    store.today.learnedCount = 0;
    saveStore(store);
  }

  return store;
}

/**
 * 持久化 Store 对象
 */
function saveStore(store) {
  memoryStore = store;
  try {
    if (typeof wx !== 'undefined' && wx.setStorageSync) {
      wx.setStorageSync(STORAGE_KEY, store);
    }
  } catch (e) {
    console.warn('Failed to write storage', e);
  }
}

/**
 * ==================== 生词本 (Notebook) 数据接口 ====================
 */
function getNotebookData() {
  const store = getStore();
  const words = store.words || [];

  const needReviewList = words.filter(w => w.status === 'need_review');
  const masteredList = words.filter(w => w.status === 'mastered');

  return {
    stats: {
      totalWords: words.length,
      needReviewCount: needReviewList.length,
      masteredCount: masteredList.length,
      reviewBreakdown: `包含 ${needReviewList.length} 个待回炉巩固生词`
    },
    filterTabs: [
      { key: "all", label: "全部", count: words.length },
      { key: "need_review", label: "待复习", count: needReviewList.length },
      { key: "mastered", label: "已掌握", count: masteredList.length }
    ],
    words: words
  };
}

/**
 * 添加单词至生词本 (如从阅读页收藏)
 */
function addWordToNotebook(wordItem) {
  const store = getStore();
  const wordKey = (wordItem.word || '').toLowerCase();

  const existingIndex = store.words.findIndex(w => w.word.toLowerCase() === wordKey);
  if (existingIndex >= 0) {
    // 已存在，重置为待复习
    store.words[existingIndex].status = 'need_review';
    store.words[existingIndex].statusLabel = '待复习';
    store.words[existingIndex].statusColor = 'warning';
  } else {
    // 构造新词条目插入最前面
    const newWord = {
      id: "nb_" + Date.now().toString().slice(-4),
      word: wordItem.word,
      phonetic: wordItem.phonetic || "/.../",
      pos: wordItem.pos || "n.",
      specTag: wordItem.specTag || "TECH · DOC",
      level: wordItem.level || "Level 2",
      categoryName: wordItem.categoryName || "文档阅读",
      generalDefinition: wordItem.generalDefinition || "常用生活含义",
      techDefinition: wordItem.techDefinition || `【计】${wordItem.word}`,
      techDetail: wordItem.techDetail || "计算机高频术语",
      designMetaphor: wordItem.designMetaphor || "💡 工程师从现实生活中借用的技术隐喻",
      typicalContext: wordItem.typicalContext || "💡 真实技术文档语境",
      source: "文档阅读",
      status: "need_review",
      statusLabel: "待复习",
      statusColor: "warning",
      reviewTimes: 1,
      isVerified: false
    };
    store.words.unshift(newWord);
  }

  saveStore(store);
  return getNotebookData();
}

/**
 * 标记单词为已掌握 (主观自测)
 */
function markWordMastered(wordIdOrName) {
  const store = getStore();
  const key = String(wordIdOrName).toLowerCase();

  const word = store.words.find(w => w.id.toLowerCase() === key || w.word.toLowerCase() === key);
  if (word) {
    word.status = 'mastered';
    word.statusLabel = word.isVerified ? '真验已过 ✓' : '已掌握 ✓';
    word.statusColor = 'success';
    saveStore(store);
  }
  return getNotebookData();
}

/**
 * 标记单词为需复习 / 遗忘回炉
 */
function markWordNeedReview(wordIdOrName) {
  const store = getStore();
  const key = String(wordIdOrName).toLowerCase();

  const word = store.words.find(w => w.id.toLowerCase() === key || w.word.toLowerCase() === key);
  if (word) {
    word.status = 'need_review';
    word.isVerified = false;
    word.reviewTimes = (word.reviewTimes || 0) + 1;
    word.statusLabel = `遗忘 ${word.reviewTimes} 次`;
    word.statusColor = 'danger';
    saveStore(store);
  }
  return getNotebookData();
}

/**
 * 记录客观真测答题结果 (客观测验强闭环)
 * 做对: status: 'mastered', isVerified: true, statusLabel: '真验已过 ✓', statusColor: 'success'
 * 做错: status: 'need_review', isVerified: false, statusLabel: '客测回炉', statusColor: 'danger'
 */
function recordQuizAnswer(wordIdOrName, isCorrect) {
  const store = getStore();
  const key = String(wordIdOrName).toLowerCase();

  const word = store.words.find(w => w.id.toLowerCase() === key || w.word.toLowerCase() === key);
  if (word) {
    if (isCorrect) {
      word.status = 'mastered';
      word.isVerified = true;
      word.statusLabel = '真验已过 ✓';
      word.statusColor = 'success';
    } else {
      word.status = 'need_review';
      word.isVerified = false;
      word.reviewTimes = (word.reviewTimes || 0) + 1;
      word.statusLabel = '客测回炉';
      word.statusColor = 'danger';
    }
    saveStore(store);
    return word;
  }
  return null;
}

/**
 * 移出生词本
 */
function removeWordFromNotebook(wordId) {
  const store = getStore();
  store.words = store.words.filter(w => w.id !== wordId);
  saveStore(store);
  return getNotebookData();
}

/**
 * 检查某词是否已在生词本中
 */
function isWordCollected(wordName) {
  const store = getStore();
  const key = String(wordName || '').toLowerCase();
  return store.words.some(w => w.word.toLowerCase() === key);
}

/**
 * ==================== 首页 (Home) 数据接口 ====================
 */
function getHomeData() {
  const store = getStore();
  const words = store.words || [];
  const needReviewList = words.filter(w => w.status === 'need_review');
  const masteredList = words.filter(w => w.status === 'mastered');
  const user = store.user || defaultUserProfile;
  const today = store.today || defaultTodayProgress;

  const current = today.learnedCount || 0;
  const goal = user.dailyGoal || 20;
  const remain = Math.max(0, goal - current);
  const percent = Math.min(100, Math.round((current / goal) * 100));
  const streakDays = typeof user.streakDays === 'number' ? user.streakDays : 0;

  // 动态统计各模块在词库中的真实词数与掌握数
  const netWords = words.filter(w => (w.categoryName || '').includes('网络'));
  const netMastered = netWords.filter(w => w.status === 'mastered');
  const osWords = words.filter(w => (w.categoryName || '').includes('并发') || (w.categoryName || '').includes('操作系统'));
  const osMastered = osWords.filter(w => w.status === 'mastered');
  const algoWords = words.filter(w => (w.categoryName || '').includes('算法') || (w.categoryName || '').includes('结构'));
  const algoMastered = algoWords.filter(w => w.status === 'mastered');
  const basicWords = words.filter(w => (w.categoryName || '').includes('基础') || (w.categoryName || '').includes('报错'));
  const basicMastered = basicWords.filter(w => w.status === 'mastered');

  const moduleList = [
    {
      id: "mod_net_01",
      level: "Level 2",
      name: "网络与分布式协议",
      title: "网络与分布式协议",
      desc: "RFC 7231 · TCP/IP · 状态码 · 握手协商",
      learned: netMastered.length,
      total: netWords.length,
      percent: netWords.length > 0 ? Math.round((netMastered.length / netWords.length) * 100) : 0,
      status: "active",
      actionText: "学习中",
      statusText: "学习中"
    },
    {
      id: "mod_os_02",
      level: "Level 2",
      name: "操作系统与并发编程",
      title: "操作系统与并发编程",
      desc: "POSIX 线程 · 锁机制 · 内存屏障 · 竞态条件",
      learned: osMastered.length,
      total: osWords.length,
      percent: osWords.length > 0 ? Math.round((osMastered.length / osWords.length) * 100) : 0,
      status: "pending",
      actionText: "切换 ›",
      statusText: "未开始"
    },
    {
      id: "mod_algo_03",
      level: "Level 2",
      name: "数据结构与核心算法",
      title: "数据结构与核心算法",
      desc: "树/图遍历 · 动态规划 · 复杂度渐进分析",
      learned: algoMastered.length,
      total: algoWords.length,
      percent: algoWords.length > 0 ? Math.round((algoMastered.length / algoWords.length) * 100) : 0,
      status: "pending",
      actionText: "切换 ›",
      statusText: "未开始"
    },
    {
      id: "mod_basic_04",
      level: "Level 1",
      name: "编程基础 & 高频报错",
      title: "编程基础 & 高频报错",
      desc: "OOP 设计模式 · 语法关键字 · 堆栈异常排查",
      learned: basicMastered.length,
      total: basicWords.length,
      percent: basicWords.length > 0 ? Math.round((basicMastered.length / basicWords.length) * 100) : 0,
      status: "pending",
      actionText: "切换 ›",
      statusText: "未开始"
    }
  ];

  return {
    todayProgress: {
      current,
      goal,
      remain,
      percent,
      streakDays: streakDays
    },
    reviewAlert: {
      count: needReviewList.length,
      label: needReviewList.length > 0 
        ? `生词本有 ${needReviewList.length} 个技术生词待回炉巩固`
        : `太棒了！生词本已无待回炉生词 ✓`
    },
    moduleList: moduleList,
    modules: moduleList,
    readerTeaser: {
      title: "技术长文精读 · 5 大领域精选",
      desc: "RFC 原生文献 · 分类文章列表 · 全量单词查义与双语对照",
      btnText: "进入精读 ›"
    }
  };
}

/**
 * 记录今日背词打卡增量
 */
function recordTodayStudy(increment = 1) {
  const store = getStore();
  if (!store.today) store.today = { ...defaultTodayProgress };
  store.today.learnedCount = (store.today.learnedCount || 0) + increment;
  saveStore(store);
  return getHomeData();
}

/**
 * ==================== 个人中心 (Profile) 数据接口 ====================
 */
function getProfileData() {
  const store = getStore();
  const words = store.words || [];
  const needReviewList = words.filter(w => w.status === 'need_review');
  const masteredList = words.filter(w => w.status === 'mastered');
  const user = store.user || defaultUserProfile;
  const streakDays = typeof user.streakDays === 'number' ? user.streakDays : 0;

  // 动态统计各模块在词库中的真实词数与掌握数
  const netWords = words.filter(w => (w.categoryName || '').includes('网络'));
  const netMastered = netWords.filter(w => w.status === 'mastered');
  const osWords = words.filter(w => (w.categoryName || '').includes('并发') || (w.categoryName || '').includes('操作系统'));
  const osMastered = osWords.filter(w => w.status === 'mastered');
  const algoWords = words.filter(w => (w.categoryName || '').includes('算法') || (w.categoryName || '').includes('结构'));
  const algoMastered = algoWords.filter(w => w.status === 'mastered');
  const basicWords = words.filter(w => (w.categoryName || '').includes('基础') || (w.categoryName || '').includes('报错'));
  const basicMastered = basicWords.filter(w => w.status === 'mastered');

  const moduleProgress = [
    {
      id: "mod_l2_net",
      level: "Level 2",
      name: "计算机网络与通信协议",
      mastered: netMastered.length,
      total: netWords.length,
      percent: netWords.length > 0 ? Math.round((netMastered.length / netWords.length) * 100) : 0,
      statusTag: `${netMastered.length} / ${netWords.length} (${netWords.length > 0 ? Math.round((netMastered.length / netWords.length) * 100) : 0}%)`,
      statusType: "active"
    },
    {
      id: "mod_l2_os",
      level: "Level 2",
      name: "操作系统与并发编程",
      mastered: osMastered.length,
      total: osWords.length,
      percent: osWords.length > 0 ? Math.round((osMastered.length / osWords.length) * 100) : 0,
      statusTag: `${osMastered.length} / ${osWords.length} (${osWords.length > 0 ? Math.round((osMastered.length / osWords.length) * 100) : 0}%)`,
      statusType: "pending"
    },
    {
      id: "mod_l2_algo",
      level: "Level 2",
      name: "数据结构与核心算法",
      mastered: algoMastered.length,
      total: algoWords.length,
      percent: algoWords.length > 0 ? Math.round((algoMastered.length / algoWords.length) * 100) : 0,
      statusTag: `${algoMastered.length} / ${algoWords.length} (${algoWords.length > 0 ? Math.round((algoMastered.length / algoWords.length) * 100) : 0}%)`,
      statusType: "pending"
    },
    {
      id: "mod_l1_basic",
      level: "Level 1",
      name: "编程基础 & 高频报错",
      mastered: basicMastered.length,
      total: basicWords.length,
      percent: basicWords.length > 0 ? Math.round((basicMastered.length / basicWords.length) * 100) : 0,
      statusTag: `${basicMastered.length} / ${basicWords.length} (${basicWords.length > 0 ? Math.round((basicMastered.length / basicWords.length) * 100) : 0}%)`,
      statusType: "pending"
    }
  ];

  return {
    user: {
      nickname: user.nickname || user.nickName || "VibeCoder",
      nickName: user.nickName || user.nickname || "VibeCoder",
      developerRole: user.developerRole || "后端研发 / 云原生架构师",
      targetDomain: user.targetDomain || user.developerRole || "后端研发 / 云原生架构师",
      tag: user.tag || "全栈工程师",
      syncStatus: user.syncStatus || "已同步云端"
    },
    userInfo: {
      nickName: user.nickName || user.nickname || "VibeCoder",
      developerRole: user.developerRole || "后端研发 / 云原生架构师",
      tag: user.tag || "全栈工程师"
    },
    stats: {
      masteredWords: masteredList.length, // 必须与生词本完全 100% 动态对齐！
      streakDays: streakDays, // 如果没有就写 0！
      collectedWords: words.length, // 生词本总收录词数，100% 对齐！
      readArticles: user.totalReadArticles || 12
    },
    learningStats: [
      { id: "stat_mastered", value: masteredList.length, label: "已掌握词汇", subText: `词库 ${words.length} 词` },
      { id: "stat_articles", value: user.totalReadArticles || 12, label: "精读技术文档", subText: "累计 4.2 万字" },
      { id: "stat_notes", value: words.length, label: "生词本收录", subText: "Local-First" }
    ],
    moduleProgress: moduleProgress,
    learningModules: moduleProgress,
    settings: [
      { id: "daily_goal", title: "每日学习目标", value: `${user.dailyGoal || 20} 词 / 天 ›` },
      { id: "review_alarm", title: "每日回炉复习提醒", value: user.reviewAlarm || "每天 21:00 ›" },
      { id: "custom_import", title: "自定义词单导入", tag: "Beta", value: "›" },
      { id: "about", title: "关于 TechVocab 码词", value: "v1.0.0 MVP ›" }
    ]
  };
}

/**
 * 更新用户每日目标设置
 */
function updateDailyGoal(goalNumber) {
  const store = getStore();
  if (!store.user) store.user = { ...defaultUserProfile };
  store.user.dailyGoal = goalNumber;
  saveStore(store);
  return getProfileData();
}

/**
 * ==================== 单词卡 (Flashcard) 数据接口 ====================
 */
function getFlashcardQueue(options = {}) {
  const store = getStore();
  let queue = [...store.words];

  if (options.word || options.wordId) {
    const target = (options.word || options.wordId).toLowerCase();
    const index = queue.findIndex(w => w.word.toLowerCase() === target || w.id.toLowerCase() === target);
    if (index >= 0) {
      const [matched] = queue.splice(index, 1);
      queue.unshift(matched);
    } else {
      try {
        const readerDict = require('./reader_dict.js');
        const term = readerDict.lookupWord(target);
        if (term && term.word) {
          const dynamicCard = {
            id: `dyn_${target}`,
            word: term.word,
            phonetic: term.phonetic || `/${target}/`,
            pos: term.pos || "n.",
            specTag: term.specTag || (term.isTechTerm ? "TECH · SPEC" : "GENERAL"),
            level: "Level 2",
            categoryName: term.categoryName || (term.isTechTerm ? "计算机网络" : "通用词汇"),
            techDefinition: term.techDefinition,
            techDetail: term.techDetail || "",
            generalDefinition: term.generalDefinition || "",
            designMetaphor: term.designMetaphor || "",
            typicalContext: term.typicalContext || `💡 典型工程语境：${term.word}`,
            source: "文档查词",
            status: "need_review",
            statusLabel: "待学习",
            statusColor: "warning",
            reviewTimes: 0,
            isVerified: false,
            codeSnippet: {
              fileName: `EXAMPLE.${target.replace(/[^a-zA-Z0-9]/g, '_')}.ts`,
              lines: [
                { lineNum: "01", isComment: true, code: `// Engineering Context: ${term.typicalContext || target}` },
                { lineNum: "02", isComment: false, code: `// Definition: ${term.techDefinition}` },
                { lineNum: "03", isComment: false, code: `const termSpec = "${term.specTag || 'STANDARD'}";` }
              ]
            },
            objectiveQuiz: {
              scenario: `在计算机工程实践中，关于术语【${term.word}】（${term.techDefinition}），以下哪项表述最符合其设计原理？`,
              options: [
                { label: "A", text: `${term.techDefinition}。${term.techDetail || '保证系统或协议状态一致'}`, isCorrect: true },
                { label: "B", text: "该机制主要用于日常非技术闲聊，在系统底层和代码中并无对应设计", isCorrect: false },
                { label: "C", text: "在系统并发中强制终止数据传输并杀死进程", isCorrect: false },
                { label: "D", text: "仅在单机单核 CPU 环境下有效，不支持现代分布式集群", isCorrect: false }
              ],
              explanation: `${term.word}: ${term.techDefinition}。${term.techDetail || ''}`
            }
          };
          queue.unshift(dynamicCard);
        }
      } catch (e) {
        console.warn('Failed to synthesize card for target', target, e);
      }
    }
  } else if (options.mode === 'review') {
    // 复习模式：优先排布所有 need_review 的生词
    const needReviewList = queue.filter(w => w.status === 'need_review');
    const otherList = queue.filter(w => w.status !== 'need_review');
    queue = [...needReviewList, ...otherList];
  } else if (options.moduleId) {
    // 模块过滤
    const filtered = queue.filter(w => {
      if (options.moduleId.includes('net')) return w.categoryName.includes('网络');
      if (options.moduleId.includes('os')) return w.categoryName.includes('并发') || w.categoryName.includes('操作系统');
      if (options.moduleId.includes('algo')) return w.categoryName.includes('算法');
      if (options.moduleId.includes('basic')) return w.level.includes('Level 1');
      return true;
    });
    if (filtered.length > 0) queue = filtered;
  }

  return queue;
}

/**
 * ==================== 单词总览 (Word Overview) 数据接口 ====================
 */
function getModuleOverviewData(moduleId = 'mod_net_01') {
  const store = getStore();
  const words = store.words || [];

  const moduleConfigs = {
    'mod_net_01': {
      id: 'mod_net_01',
      aliasIds: ['mod_l2_net'],
      level: 'Level 2 · 进阶',
      name: '网络与分布式协议',
      domainTag: 'TCP/IP · RFC 7231',
      desc: '覆盖 HTTP 语义规范、三次握手、时延流控与套接字抽象',
      filterFn: w => (w.categoryName || '').includes('网络'),
      secNames: ['SECTION 01 · 协议语义与数据流', 'SECTION 02 · 传输层与通信控制']
    },
    'mod_os_02': {
      id: 'mod_os_02',
      aliasIds: ['mod_l2_os'],
      level: 'Level 2 · 进阶',
      name: '操作系统与并发编程',
      domainTag: 'POSIX · 线程锁 · 屏障',
      desc: 'POSIX 线程 · 锁机制 · 内存屏障 · 竞态条件',
      filterFn: w => (w.categoryName || '').includes('并发') || (w.categoryName || '').includes('操作系统'),
      secNames: ['SECTION 01 · 并发控制与死锁排查', 'SECTION 02 · 吞吐量与性能调度']
    },
    'mod_algo_03': {
      id: 'mod_algo_03',
      aliasIds: ['mod_l2_algo'],
      level: 'Level 2 · 进阶',
      name: '数据结构与核心算法',
      domainTag: '树图 · 动态规划 · 复杂度',
      desc: '树/图遍历 · 动态规划 · 复杂度渐进分析',
      filterFn: w => (w.categoryName || '').includes('算法') || (w.categoryName || '').includes('结构'),
      secNames: ['SECTION 01 · 结构遍历与分治算法']
    },
    'mod_basic_04': {
      id: 'mod_basic_04',
      aliasIds: ['mod_l1_basic'],
      level: 'Level 1 · 筑基',
      name: '编程基础 & 高频报错',
      domainTag: 'OOP · 语法关键字 · 堆栈',
      desc: 'OOP 设计模式 · 语法关键字 · 堆栈异常排查',
      filterFn: w => (w.categoryName || '').includes('基础') || (w.categoryName || '').includes('报错'),
      secNames: ['SECTION 01 · 面向对象与设计模式', 'SECTION 02 · 内存溢出与废弃预警']
    }
  };

  let config = Object.values(moduleConfigs).find(c => c.id === moduleId || (c.aliasIds && c.aliasIds.includes(moduleId)));
  if (!config) {
    config = moduleConfigs['mod_net_01'];
  }

  const moduleWords = words.filter(config.filterFn);
  const masteredWords = moduleWords.filter(w => w.status === 'mastered');
  const needReviewWords = moduleWords.filter(w => w.status !== 'mastered');
  const percent = moduleWords.length > 0 ? Math.round((masteredWords.length / moduleWords.length) * 100) : 0;

  // 章节拆分
  const sections = [];
  const chunkSize = 6;
  for (let i = 0; i < moduleWords.length; i += chunkSize) {
    const chunk = moduleWords.slice(i, i + chunkSize);
    const secIdx = Math.floor(i / chunkSize);
    const secTitle = config.secNames[secIdx] || `SECTION 0${secIdx + 1} · 核心单元进阶`;
    sections.push({
      id: `sec_${secIdx + 1}`,
      title: secTitle,
      words: chunk
    });
  }

  return {
    module: {
      id: config.id,
      level: config.level,
      name: config.name,
      domainTag: config.domainTag,
      desc: config.desc,
      total: moduleWords.length,
      mastered: masteredWords.length,
      remain: needReviewWords.length,
      percent: percent
    },
    filterTabs: [
      { key: 'all', label: '全部', count: moduleWords.length },
      { key: 'need_review', label: '待学习', count: needReviewWords.length },
      { key: 'mastered', label: '已掌握', count: masteredWords.length }
    ],
    sections: sections,
    allWords: moduleWords
  };
}

/**
 * ====================================================================
 * 文章分类与文献知识库数据中心 (Inlined Article & Categories Store)
 * 解决微信小程序子模块静态打包时 ./article_store.js 偶发找不到的问题
 * ====================================================================
 */
// miniprogram/data/article_store.js
/**
 * 文章分类与文献知识库数据中心 (Article & Categories Store)
 * 严格对齐 docs/mockups/article-categories.svg 与 docs/mockups/article-list.svg
 */

const STORAGE_ARTICLE_KEY = 'tech_vocab_articles_v1';

// 5 大技术领域精选分类
const initialCategories = [
  {
    id: "cat_net",
    name: "网络与分布式协议",
    enName: "Networking & Protocols",
    specTag: "TCP · HTTP/3 · QUIC",
    iconType: "net",
    iconBg: "#EFF6FF",
    iconStroke: "#DBEAFE",
    iconColor: "#2563EB",
    desc: "覆盖 RFC 793/7231/9000 规范、三次握手、流控与 QUIC 多路复用"
  },
  {
    id: "cat_os",
    name: "操作系统与并发内核",
    enName: "OS & Concurrency",
    specTag: "POSIX · 死锁 · 锁",
    iconType: "cpu",
    iconBg: "#FFFBEB",
    iconStroke: "#FDE68A",
    iconColor: "#D97706",
    desc: "POSIX 线程互斥锁、死锁四要素检测、调度算法与内存屏障"
  },
  {
    id: "cat_dist",
    name: "分布式架构与高可用",
    enName: "Distributed Systems",
    specTag: "Raft · 幂等 · 容灾",
    iconType: "cluster",
    iconBg: "#FAF5FF",
    iconStroke: "#E9D5FF",
    iconColor: "#9333EA",
    desc: "Raft 分布式共识、接口幂等设计、消息去重与高并发数据一致性"
  },
  {
    id: "cat_storage",
    name: "存储引擎与算法结构",
    enName: "Storage & Algorithms",
    specTag: "LSM · B+Tree · 树",
    iconType: "db",
    iconBg: "#ECFDF5",
    iconStroke: "#A7F3D0",
    iconColor: "#059669",
    desc: "LSM-Tree 追加写模型、B+Tree 索引范围查询与零拷贝持久化"
  },
  {
    id: "cat_cloud",
    name: "云原生与微服务通信",
    enName: "Cloud Native & Microservices",
    specTag: "gRPC · K8s · 网关",
    iconType: "cloud",
    iconBg: "#F8FAFC",
    iconStroke: "#E2E8F0",
    iconColor: "#475569",
    desc: "服务网格 Sidecar、gRPC 双向流式通信与 Envoy 流量治理"
  }
];

// 精选文献知识库
const initialArticles = [
  // ==================== 网络与分布式协议 (cat_net) ====================
  {
    id: "art_net_01",
    categoryId: "cat_net",
    categoryName: "网络与分布式协议",
    title: "Understanding TCP Handshake",
    sourceName: "MDN · 官方文档",
    specTag: "RFC 793",
    readTime: "3 分钟精读",
    wordCount: "185 词",
    readPercent: 68,
    status: "reading", // 'reading' | 'mastered' | 'unread'
    statusLabel: "读至 68% ↻",
    statusType: "warning",
    summary: "三次握手状态机深度解析，剖析 SYN/ACK 序列号同步设计与服务端幂等防重连处理机制。",
    keyTerms: ["synchronize", "idempotent", "handshake"],
    lastReadTime: "3 分钟前",
    paragraphs: [
      {
        id: "p1",
        lines: [
          "In modern computer networking, reliable",
          "communication begins with establishing",
          "a stable session between two endpoints."
        ],
        zhText: "在现代计算机网络通信中，可靠的数据传输始于在两个通信端点之间建立稳定的会话连接。"
      },
      {
        id: "p2",
        lines: [
          "The client first transmits a SYN packet to synchronize the sequence numbers.",
          "To prevent duplicate connections, the handshake requires idempotent packet handling on the server side."
        ],
        zhText: "客户端首先发送一个 SYN 数据包以同步初始序列号。为了防止重复连接引发的混乱，三次握手协议要求服务端具备幂等的数据包处理能力。"
      },
      {
        id: "p3",
        lines: [
          "Upon receiving the request, the server allocates a transmission control block (TCB)",
          "and acknowledges with a SYN-ACK packet, reserving network buffers for subsequent payload delivery."
        ],
        zhText: "收到握手请求后，服务器会分配传输控制块（TCB），并响应 SYN-ACK 数据包，为后续的数据负载传输预留网络缓冲区。"
      }
    ]
  },
  {
    id: "art_net_02",
    categoryId: "cat_net",
    categoryName: "网络与分布式协议",
    title: "HTTP/3 and QUIC Protocol Deep Dive",
    sourceName: "Cloudflare · 官方博客",
    specTag: "RFC 9000",
    readTime: "5 分钟精读",
    wordCount: "320 词",
    readPercent: 100,
    status: "mastered",
    statusLabel: "已精读 100% ✓",
    statusType: "success",
    summary: "从基于 UDP 的传输层重构出发，探讨多路复用与彻底消除 TCP 队头阻塞 (Head-of-Line Blocking) 的核心原理。",
    keyTerms: ["multiplexing", "latency", "throughput"],
    lastReadTime: "昨天",
    paragraphs: [
      {
        id: "p1",
        lines: [
          "HTTP/3 represents a monumental shift in web transport protocols by abandoning TCP in favor of QUIC.",
          "Built directly on top of UDP, QUIC inherently solves the classic head-of-line blocking dilemma."
        ],
        zhText: "HTTP/3 标志着 Web 传输协议的重大演进，它舍弃了传统的 TCP 协议，全面转向基于 UDP 构建的 QUIC 协议，从根本上解决了经典的队头阻塞难题。"
      },
      {
        id: "p2",
        lines: [
          "In traditional TCP streams, any single lost packet stalls the entire pipeline until retransmission finishes.",
          "QUIC treats individual streams independently, achieving genuine multiplexing with zero collateral latency."
        ],
        zhText: "在传统的 TCP 字节流中，任何单个数据包丢失都会迫使整个流水线停滞，直到丢包重传完成。QUIC 将各个数据流独立对待，实现了真正零连带时延的流式多路复用。"
      },
      {
        id: "p3",
        lines: [
          "Furthermore, QUIC embeds TLS 1.3 cryptographic handshakes directly into the initial connection packet,",
          "effectively reducing handshake round-trip latency to zero RTT in subsequent session resumptions."
        ],
        zhText: "此外，QUIC 将 TLS 1.3 加密握手直接集成到初始连接数据包中，在后续恢复会话时能够实现令人惊叹的 0-RTT 极速连接。"
      }
    ]
  },
  {
    id: "art_net_03",
    categoryId: "cat_net",
    categoryName: "网络与分布式协议",
    title: "WebSocket vs gRPC Streaming",
    sourceName: "Uber Eng · 架构实践",
    specTag: "全双工流式",
    readTime: "4 分钟精读",
    wordCount: "260 词",
    readPercent: 0,
    status: "unread",
    statusLabel: "未阅读",
    statusType: "default",
    summary: "对比双向全双工长连接与 HTTP/2 Protobuf 二进制帧协议，剖析背压控制 (Backpressure) 与长会话维持开销。",
    keyTerms: ["full-duplex", "backpressure", "pipeline"],
    paragraphs: [
      {
        id: "p1",
        lines: [
          "Modern real-time systems frequently face architectural trade-offs between WebSocket and gRPC streaming.",
          "While WebSocket delivers lightweight bidirectional communication over a single TCP socket, gRPC leverages HTTP/2 framing."
        ],
        zhText: "现代实时系统经常面临在 WebSocket 与 gRPC 流式通信之间的架构权衡。WebSocket 在单个 TCP 套接字上提供轻量级的全双工双向通信，而 gRPC 则充分利用了 HTTP/2 的分帧与多路复用优势。"
      },
      {
        id: "p2",
        lines: [
          "When processing high-frequency telemetry data, gRPC provides native backpressure signaling,",
          "preventing fast producers from overwhelming constrained consumer buffers downstream."
        ],
        zhText: "在处理高频遥测或监控数据时，gRPC 提供了原生的背压机制，能够有效防止上游的高速生产端撑爆下游受限的消费缓冲区。"
      }
    ]
  },
  {
    id: "art_net_04",
    categoryId: "cat_net",
    categoryName: "网络与分布式协议",
    title: "DNS Resolution & Anycast Routing",
    sourceName: "AWS Docs · 架构白皮书",
    specTag: "RFC 1035",
    readTime: "4 分钟精读",
    wordCount: "210 词",
    readPercent: 0,
    status: "unread",
    statusLabel: "未阅读",
    statusType: "default",
    summary: "深入递归查询链路与权威根解析，剖析 Anycast 边缘路由在抵御高并发流量与 DDoS 攻击时的拓扑容灾机制。",
    keyTerms: ["checksum", "reentrancy", "overflow"],
    paragraphs: [
      {
        id: "p1",
        lines: [
          "Domain Name System resolution is the fundamental bedrock enabling human-friendly network addressing.",
          "Recursive resolvers traverse hierarchical nameservers to fetch canonical IP records with strict TTL validation."
        ],
        zhText: "域名系统（DNS）解析是整个现代互联网的基石。递归解析器沿着分层域名服务器逐级查询，并在严格验证生存时间（TTL）的前提下获取权威 IP 记录。"
      },
      {
        id: "p2",
        lines: [
          "By binding identical IP prefixes across globally distributed edge nodes via BGP Anycast,",
          "top-tier cloud providers absorb volumetric DDoS surges locally while ensuring lowest packet round-trip time."
        ],
        zhText: "顶级云服务商通过 BGP Anycast 技术将相同的 IP 前缀广播至全球分布的边缘节点，不仅能在本地就近吸收海量 DDoS 攻击洪峰，还能确保全球用户享受极低的往返时延。"
      }
    ]
  },

  // ==================== 操作系统与并发内核 (cat_os) ====================
  {
    id: "art_os_01",
    categoryId: "cat_os",
    categoryName: "操作系统与并发内核",
    title: "POSIX Threads & Mutex Deadlock Analysis",
    sourceName: "Linux Kernel Docs",
    specTag: "POSIX · 死锁",
    readTime: "4 分钟精读",
    wordCount: "240 词",
    readPercent: 75,
    status: "reading",
    statusLabel: "读至 75% ↻",
    statusType: "warning",
    summary: "剖析互斥锁锁序倒置引发死锁的四大必要条件，演示 Lock Ordering 与尝试锁 (pthread_mutex_trylock) 防护设计。",
    keyTerms: ["deadlock", "concurrency", "synchronize"],
    lastReadTime: "2 小时前",
    paragraphs: [
      {
        id: "p1",
        lines: [
          "In multithreaded systems programming, deadlock represents an intractable state where threads block mutually indefinitely.",
          "Coffman formalizes this failure mode through four conditions: mutual exclusion, hold and wait, no preemption, and circular wait."
        ],
        zhText: "在多线程系统编程中，死锁是一种棘手的故障状态，相互等待的线程将被无限期挂起。科夫曼将其形式化为四大必要条件：互斥条件、占有并等待、非抢占和循环等待。"
      },
      {
        id: "p2",
        lines: [
          "Enforcing a strict global lock hierarchy breaks circular wait paths across competing thread execution routes."
        ],
        zhText: "强制实施严格的全局锁获取顺序，能够彻底打破竞争线程在执行路径中的循环等待链条，杜绝死锁发生。"
      }
    ]
  },
  {
    id: "art_os_02",
    categoryId: "cat_os",
    categoryName: "操作系统与并发内核",
    title: "Understanding Context Switching in Linux",
    sourceName: "Red Hat · 开发者专栏",
    specTag: "Kernel · CPU",
    readTime: "5 分钟精读",
    wordCount: "290 词",
    readPercent: 100,
    status: "mastered",
    statusLabel: "已精读 100% ✓",
    statusType: "success",
    summary: "详解内核上下文切换中的寄存器保存、TLB 刷新与用户态/内核态切换消耗对吞吐量的实际影响。",
    keyTerms: ["concurrency", "throughput", "latency"],
    paragraphs: [
      {
        id: "p1",
        lines: [
          "Context switching is the kernel mechanism that enables multitasking by saving and restoring CPU states.",
          "While essential for fair scheduling, excessive switching causes TLB cache flushes and degrades throughput."
        ],
        zhText: "上下文切换是操作系统内核实现多任务并发的核心机制，通过保存和恢复 CPU 执行状态实现。虽然调度至关重要，但过度的切换会导致 TLB 缓存失效并显著降低系统吞吐量。"
      }
    ]
  },

  // ==================== 分布式架构与高可用 (cat_dist) ====================
  {
    id: "art_dist_01",
    categoryId: "cat_dist",
    categoryName: "分布式架构与高可用",
    title: "Designing Idempotent APIs in Distributed Systems",
    sourceName: "Stripe Eng · 架构博客",
    specTag: "分布式 · 幂等",
    readTime: "5 分钟精读",
    wordCount: "310 词",
    readPercent: 50,
    status: "reading",
    statusLabel: "读至 50% ↻",
    statusType: "warning",
    summary: "以支付重试与高并发防重复扣款为例，详解唯一 Idempotency-Key、分布式锁与两阶段持久化落地规范。",
    keyTerms: ["idempotent", "reentrancy", "checksum"],
    lastReadTime: "3 天前",
    paragraphs: [
      {
        id: "p1",
        lines: [
          "Network unreliability guarantees that distributed clients will eventually retry in-flight mutation requests.",
          "Without strict idempotency safeguards, network packet retries risk duplicate credit card charges or inventory depletion."
        ],
        zhText: "不可靠的网络环境决定了分布式客户端迟早会重试未决的状态变更请求。若没有严格的幂等防护，网络重试将引发重复扣款或库存超卖等严重故障。"
      },
      {
        id: "p2",
        lines: [
          "By pairing client-generated unique idempotency keys with atomic database transactions, handlers achieve safe replays."
        ],
        zhText: "通过将客户端生成的唯一幂等键与原子级数据库事务结合，服务端能够实现安全无副作用的请求重放与状态保护。"
      }
    ]
  },

  // ==================== 存储引擎与算法结构 (cat_storage) ====================
  {
    id: "art_storage_01",
    categoryId: "cat_storage",
    categoryName: "存储引擎与算法结构",
    title: "LSM-Tree vs B+Tree Storage Engines",
    sourceName: "O'Reilly · 数据库系统内幕",
    specTag: "存储引擎 · 索引",
    readTime: "4 分钟精读",
    wordCount: "280 词",
    readPercent: 100,
    status: "mastered",
    statusLabel: "已精读 100% ✓",
    statusType: "success",
    summary: "从顺序写 (Sequential Write) 与随机 I/O 出发，对比 RocksDB (LSM) 与 InnoDB (B+Tree) 的读写放大与吞吐权衡。",
    keyTerms: ["traversal", "throughput", "buffer"],
    paragraphs: [
      {
        id: "p1",
        lines: [
          "LSM-Tree architectures optimize for write-intensive workloads by converting random disk updates into sequential append-only logs.",
          "In contrast, traditional B+Trees preserve optimal point-read latency at the expense of higher write amplification."
        ],
        zhText: "日志结构合并树（LSM-Tree）通过将离散的随机磁盘写转换为追加式的顺序日志，大幅提升了写密集型系统的性能。而传统的 B+ 树则以较高的写放大为代价换取极优的单点读时延。"
      }
    ]
  },

  // ==================== 云原生与微服务通信 (cat_cloud) ====================
  {
    id: "art_cloud_01",
    categoryId: "cat_cloud",
    categoryName: "云原生与微服务通信",
    title: "Service Mesh & Envoy Sidecar Architecture",
    sourceName: "CNCF · 官方白皮书",
    specTag: "Envoy · Mesh",
    readTime: "4 分钟精读",
    wordCount: "250 词",
    readPercent: 0,
    status: "unread",
    statusLabel: "未阅读",
    statusType: "default",
    summary: "剖析微服务治理中 Sidecar 模式的透明流量劫持、动态服务发现 (xDS) 与熔断限流控制。",
    keyTerms: ["middleware", "pipeline", "backpressure"],
    paragraphs: [
      {
        id: "p1",
        lines: [
          "Service meshes decouple cross-cutting networking concerns like mTLS encryption and rate limiting from business logic.",
          "Envoy proxies intercept ingress and egress traffic alongside containerized pods, providing centralized observability."
        ],
        zhText: "服务网格（Service Mesh）将跨服务的 mTLS 认证加密、速率限制和熔断降级等通用网络治理能力与上层业务逻辑彻底解耦。Envoy 代理作为 Sidecar 与应用容器并肩运行，为整个微服务集群提供中心化的统一可观测性。"
      }
    ]
  }
,
  {
    "id": "art_cloud_10",
    "categoryId": "cat_cloud",
    "categoryName": "云原生与微服务通信",
    "title": "Edge Proxy Architecture & Rate Limiting",
    "sourceName": "Cloudflare · 架构与高可用实践",
    "specTag": "EDGE · REVERSE PROXY",
    "readTime": "2 分钟精读",
    "wordCount": "108 词",
    "readPercent": 0,
    "status": "unread",
    "statusLabel": "未精读",
    "statusType": "info",
    "summary": "深度剖析分布式边缘反向代理 Anycast 路由机制，详解令牌桶限流与熔断自愈弹性设计。",
    "keyTerms": [
      "proxy",
      "rate limiting",
      "circuit breaker",
      "resilience",
      "exhaustion"
    ],
    "paragraphs": [
      {
        "id": "p1",
        "lines": [
          "Edge proxies form the frontline defense of",
          "modern cloud infrastructure, handling millions",
          "of incoming requests per second across",
          "distributed Anycast nodes."
        ],
        "zhText": "边缘代理构成了现代云基础设施的第一道防线，通过分布式 Anycast 节点每秒处理数百万级并发请求。"
      },
      {
        "id": "p2",
        "lines": [
          "When traffic spikes suddenly, reverse proxies",
          "must efficiently route packets while isolating",
          "upstream origin servers from cascading failures."
        ],
        "zhText": "当流量瞬时突发激增时，反向代理必须高效路由数据包，同时对上游源站服务器实施故障隔离，防止连锁雪崩。"
      },
      {
        "id": "p3",
        "lines": [
          "To safeguard system availability against sudden",
          "traffic surges, engineers deploy distributed rate",
          "limiting mechanisms. By enforcing token bucket and",
          "sliding window counters across edge clusters, the",
          "proxy intercepts abusive request floods and prevents",
          "memory exhaustion."
        ],
        "zhText": "为了保护系统可用性免遭突发流量洪峰冲击，工程师部署了分布式速率限制机制。通过在边缘集群间协同执行令牌桶与滑动窗口计数器，代理层能够精准拦截恶意请求洪流，有效避免服务器内存枯竭。"
      },
      {
        "id": "p4",
        "lines": [
          "In high-throughput distributed systems, graceful",
          "degradation and circuit breaker patterns prevent",
          "catastrophic service collapse. When upstream latency",
          "degrades beyond acceptable thresholds, the edge proxy",
          "automatically sheds low-priority load, maintaining",
          "system resilience under extreme pressure."
        ],
        "zhText": "在高吞吐分布式系统中，优雅降级与断路器（熔断）模式能够有效防止灾难性的全站服务瘫痪。当上游时延恶化超过可接受阈值时，边缘代理会自动卸载剥离低优先级流量负荷，从而在极端重压下保持系统的坚韧弹性。"
      }
    ]
  }
];

// 默认上次阅读文章
const defaultLastRead = {
  id: "art_net_01",
  categoryId: "cat_net",
  categoryName: "网络与分布式协议",
  title: "Understanding TCP Handshake",
  wordCount: "185 词",
  specTag: "RFC 793 规范",
  readPercent: 68,
  statusLabel: "读至 68%",
  lastReadTime: "3 分钟前阅读"
};

let memoryArticlesStore = null;

function getArticleStore() {
  if (memoryArticlesStore) {
    return memoryArticlesStore;
  }
  try {
    if (typeof wx !== 'undefined' && wx.getStorageSync) {
      const stored = wx.getStorageSync(STORAGE_ARTICLE_KEY);
      if (stored && stored.categories && stored.articles) {
        memoryArticlesStore = stored;
        return memoryArticlesStore;
      }
    }
  } catch (e) {
    console.warn('Failed to read article store from storage', e);
  }

  memoryArticlesStore = {
    categories: [...initialCategories],
    articles: [...initialArticles],
    lastReadArticle: { ...defaultLastRead }
  };
  saveArticleStore(memoryArticlesStore);
  return memoryArticlesStore;
}

function saveArticleStore(store) {
  memoryArticlesStore = store;
  try {
    if (typeof wx !== 'undefined' && wx.setStorageSync) {
      wx.setStorageSync(STORAGE_ARTICLE_KEY, store);
    }
  } catch (e) {
    console.warn('Failed to write article store', e);
  }
}

/**
 * 获取文章分类首页数据
 */
function getCategoriesPageData() {
  const store = getArticleStore();
  const categories = store.categories || [];
  const articles = store.articles || [];

  const categoryCards = categories.map(cat => {
    const catArticles = articles.filter(a => a.categoryId === cat.id);
    const totalCount = catArticles.length;
    const masteredCount = catArticles.filter(a => a.status === 'mastered').length;
    const readingCount = catArticles.filter(a => a.status === 'reading').length;
    const percent = totalCount > 0 ? Math.round((masteredCount / totalCount) * 100) : 0;

    return {
      id: cat.id,
      name: cat.name,
      enName: cat.enName,
      specTag: cat.specTag,
      iconType: cat.iconType,
      iconBg: cat.iconBg,
      iconStroke: cat.iconStroke,
      iconColor: cat.iconColor,
      desc: cat.desc,
      totalCount: totalCount,
      masteredCount: masteredCount,
      readingCount: readingCount,
      percent: percent,
      ratioText: `${masteredCount}/${totalCount}`,
      summaryText: `共 ${totalCount} 篇精选 · 已读 ${masteredCount} 篇 (${percent}%)`
    };
  });

  return {
    lastRead: store.lastReadArticle || defaultLastRead,
    totalArticlesCount: articles.length,
    categoriesCount: categories.length,
    categories: categoryCards
  };
}

/**
 * 获取某一分类下的文章列表数据
 * @param {string} categoryId 分类 ID
 * @param {string} filterKey 状态过滤 'all' | 'reading' | 'mastered' | 'unread'
 */
function getCategoryArticlesData(categoryId, filterKey = 'all') {
  const store = getArticleStore();
  const category = (store.categories || []).find(c => c.id === categoryId) || store.categories[0];
  const allCatArticles = (store.articles || []).filter(a => a.categoryId === category.id);

  const readingList = allCatArticles.filter(a => a.status === 'reading');
  const masteredList = allCatArticles.filter(a => a.status === 'mastered');
  const unreadList = allCatArticles.filter(a => a.status === 'unread');

  let filtered = allCatArticles;
  if (filterKey === 'reading') {
    filtered = readingList;
  } else if (filterKey === 'mastered') {
    filtered = masteredList;
  } else if (filterKey === 'unread') {
    filtered = unreadList;
  }

  const masteredCount = masteredList.length;
  const totalCount = allCatArticles.length;
  const percent = totalCount > 0 ? Math.round((masteredCount / totalCount) * 100) : 0;

  // 统计覆盖的核心技术词汇数量
  const termSet = new Set();
  allCatArticles.forEach(a => {
    (a.keyTerms || []).forEach(t => termSet.add(t));
  });

  return {
    category: {
      id: category.id,
      name: category.name,
      enName: category.enName,
      specTag: category.specTag,
      totalCount: totalCount,
      masteredCount: masteredCount,
      readingCount: readingList.length,
      unreadCount: unreadList.length,
      termCount: termSet.size || 11,
      percent: percent,
      summaryText: `精选文献 ${totalCount} 篇 · 涵盖 ${termSet.size || 11} 个技术词 · 已读 ${masteredCount} 篇`
    },
    filterTabs: [
      { key: 'all', label: '全部', count: totalCount },
      { key: 'reading', label: '阅读中', count: readingList.length },
      { key: 'mastered', label: '已读完', count: masteredList.length },
      { key: 'unread', label: '待阅读', count: unreadList.length }
    ],
    activeFilter: filterKey,
    articles: filtered
  };
}

/**
 * 根据文章 ID 获取具体文章内容
 */
function getArticleById(articleId) {
  const store = getArticleStore();
  const art = (store.articles || []).find(a => a.id === articleId);
  if (art) return art;
  return store.articles[0] || initialArticles[0];
}

/**
 * 更新文章阅读进度，并同步设置为最新上次阅读
 */
function updateArticleReadingProgress(articleId, progressPercent) {
  const store = getArticleStore();
  const art = (store.articles || []).find(a => a.id === articleId);
  if (art) {
    const percent = Math.min(100, Math.max(0, Math.round(progressPercent)));
    art.readPercent = percent;
    if (percent >= 100) {
      art.status = 'mastered';
      art.statusLabel = '已精读 100% ✓';
      art.statusType = 'success';
    } else if (percent > 0) {
      art.status = 'reading';
      art.statusLabel = `读至 ${percent}% ↻`;
      art.statusType = 'warning';
    }

    art.lastReadTime = '刚刚';

    store.lastReadArticle = {
      id: art.id,
      categoryId: art.categoryId,
      categoryName: art.categoryName,
      title: art.title,
      wordCount: art.wordCount,
      specTag: art.specTag,
      readPercent: percent,
      statusLabel: percent >= 100 ? '已精读 100%' : `读至 ${percent}%`,
      lastReadTime: '刚刚阅读'
    };

    saveArticleStore(store);
    return art;
  }
  return null;
}

module.exports = {
  getStore,
  getNotebookData,
  addWordToNotebook,
  markWordMastered,
  markWordNeedReview,
  recordQuizAnswer,
  removeWordFromNotebook,
  isWordCollected,
  getHomeData,
  recordTodayStudy,
  getProfileData,
  updateDailyGoal,
  getFlashcardQueue,
  getModuleOverviewData,
  initialWordLibrary,
  getArticleStore,
  getCategoriesPageData,
  getCategoryArticlesData,
  getArticleById,
  updateArticleReadingProgress,
  initialCategories,
  initialArticles
};
