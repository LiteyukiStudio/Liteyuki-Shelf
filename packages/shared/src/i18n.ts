export const resources = {
  "zh-CN": {
    translation: {
      appName: "Liteyuki Shelf",
      tagline: "把阅读、成稿与审核拆成各自清晰的工作区。",
      roles: {
        reader: "读者",
        author: "作者",
        admin: "管理员"
      },
      localeNames: {
        "zh-CN": "简体中文",
        en: "English"
      },
      sections: {
        overview: "工作区概览",
        catalog: "目录",
        detail: "图书详情",
        import: "导入 EPUB",
        authorDesk: "作者工作区",
        adminQueue: "审核队列"
      },
      actions: {
        refresh: "刷新数据",
        upload: "上传 EPUB",
        changeLocale: "切换语言"
      },
      common: {
        loading: "正在加载当前工作区...",
        items: "本",
        unknownError: "发生了未知错误",
        epubCount: "可下载 EPUB",
        untitled: "未命名图书",
        unknownAuthor: "未知作者",
        notAvailable: "暂无"
      },
      summary: {
        books: "图书总数",
        published: "已发布",
        drafts: "草稿",
        pending: "待审核",
        readers: "活跃读者",
        wordsInView: "当前字数",
        imported: "已导入 EPUB"
      },
      detail: {
        empty: "当前工作区里还没有可查看的图书。",
        noDescription: "这本书还没有补充简介。",
        author: "作者",
        status: "状态",
        language: "语言",
        chapters: "章节",
        words: "字数",
        updated: "更新于",
        identifier: "标识",
        epub: "EPUB",
        epubReady: "已就绪",
        epubMissing: "未提供"
      },
      workspace: {
        label: "当前工作区",
        recent: "最近可见图书",
        emptyRecent: "这个角色当前还没有可见图书。",
        readerTitle: "读者视图只保留已发布内容",
        readerBody: "读者页面只展示已经公开的作品，重点是浏览目录、查看详情与确认 EPUB 是否可读。",
        authorTitle: "作者视图聚焦草稿与待审核内容",
        authorBody: "作者页面优先展示还在创作或等待反馈的图书，便于持续补全元数据、章节规模和导入内容。",
        adminTitle: "管理员视图围绕审核队列组织",
        adminBody: "管理员页面保留全量目录，但强调审核状态、发布决策与目录健康度，不混入读者导向的说明。"
      },
      catalog: {
        reader: "仅显示已发布图书。",
        author: "仅显示草稿和待审核图书。",
        admin: "显示全部图书以便统一审核。",
        emptyReader: "还没有对读者开放的图书。",
        emptyAuthor: "当前没有需要作者处理的图书。",
        emptyAdmin: "目录还是空的，暂时没有内容可审核。"
      },
      uploadPanel: {
        idle: "选择一个 EPUB 文件",
        working: "正在上传 EPUB...",
        success: "已导入 {{title}}",
        failure: "上传失败",
        helper: "导入只负责读取元数据并进入审核流，不在这里展示额外提示词。"
      },
      authorEditor: {
        title: "标题",
        author: "作者",
        language: "语言",
        description: "简介",
        tags: "标签，使用逗号分隔",
        chapters: "章节数",
        wordCount: "字数",
        create: "创建草稿",
        update: "更新草稿",
        created: "草稿已创建",
        updated: "草稿已更新",
        helper: "这里只编辑作者需要维护的书籍信息。",
        saveFailed: "保存失败（{{status}}）"
      },
      adminReview: {
        empty: "当前没有可审核的图书。",
        helper: "只保留审核决策，不混入作者编辑动作。",
        markReview: "标记为待审核",
        publish: "发布图书",
        sendDraft: "退回草稿"
      },
      status: {
        draft: "草稿",
        published: "已发布",
        review: "待审核"
      },
      errors: {
        requestFailed: "请求失败（{{status}}）",
        uploadFailed: "上传失败（{{status}}）",
        bookNotFound: "没有找到这本图书。",
        missingFile: "没有检测到上传文件。",
        invalidEpub: "这个文件不是有效的 EPUB。",
        serviceUnavailable: "服务暂时不可用，请稍后再试。"
      }
    }
  },
  en: {
    translation: {
      appName: "Liteyuki Shelf",
      tagline: "Separate reading, drafting, and review into clear workspaces.",
      roles: {
        reader: "Reader",
        author: "Author",
        admin: "Admin"
      },
      localeNames: {
        "zh-CN": "Simplified Chinese",
        en: "English"
      },
      sections: {
        overview: "Workspace overview",
        catalog: "Catalog",
        detail: "Book detail",
        import: "Import EPUB",
        authorDesk: "Author workspace",
        adminQueue: "Review queue"
      },
      actions: {
        refresh: "Refresh data",
        upload: "Upload EPUB",
        changeLocale: "Switch language"
      },
      common: {
        loading: "Loading this workspace...",
        items: "books",
        unknownError: "Something went wrong",
        epubCount: "EPUB ready",
        untitled: "Untitled book",
        unknownAuthor: "Unknown author",
        notAvailable: "Not available"
      },
      summary: {
        books: "Books",
        published: "Published",
        drafts: "Drafts",
        pending: "In review",
        readers: "Active readers",
        wordsInView: "Words in view",
        imported: "Imported EPUBs"
      },
      detail: {
        empty: "There is no book available in this workspace yet.",
        noDescription: "No description has been added for this book yet.",
        author: "Author",
        status: "Status",
        language: "Language",
        chapters: "Chapters",
        words: "Words",
        updated: "Updated",
        identifier: "Identifier",
        epub: "EPUB",
        epubReady: "Ready",
        epubMissing: "Missing"
      },
      workspace: {
        label: "Current workspace",
        recent: "Recently visible books",
        emptyRecent: "No books are visible for this role yet.",
        readerTitle: "Reader mode keeps only published books in view",
        readerBody: "The reader page shows only public titles, with emphasis on browsing the catalog, checking details, and confirming EPUB availability.",
        authorTitle: "Author mode focuses on drafts and review items",
        authorBody: "The author page prioritizes books still being written or waiting for review so metadata, chapter scale, and imports stay easy to manage.",
        adminTitle: "Admin mode is organized around the review queue",
        adminBody: "The admin page keeps the full catalog visible, but centers review state, publishing decisions, and catalog health instead of reader-facing guidance."
      },
      catalog: {
        reader: "Showing published books only.",
        author: "Showing draft and review books only.",
        admin: "Showing the full catalog for review work.",
        emptyReader: "No books are published for readers yet.",
        emptyAuthor: "There are no books that need author work right now.",
        emptyAdmin: "The catalog is empty, so there is nothing to review yet."
      },
      uploadPanel: {
        idle: "Choose an EPUB file",
        working: "Uploading EPUB...",
        success: "Imported {{title}}",
        failure: "Upload failed",
        helper: "Import reads metadata and places the file into review without adding extra prompt-like copy."
      },
      authorEditor: {
        title: "Title",
        author: "Author",
        language: "Language",
        description: "Description",
        tags: "Tags separated by commas",
        chapters: "Chapters",
        wordCount: "Word count",
        create: "Create draft",
        update: "Update draft",
        created: "Draft created",
        updated: "Draft updated",
        helper: "Only author-owned metadata editing stays here.",
        saveFailed: "Save failed ({{status}})"
      },
      adminReview: {
        empty: "No book is selected for review.",
        helper: "Keep this panel for review decisions only.",
        markReview: "Mark for review",
        publish: "Publish book",
        sendDraft: "Return to draft"
      },
      status: {
        draft: "Draft",
        published: "Published",
        review: "In review"
      },
      errors: {
        requestFailed: "Request failed ({{status}})",
        uploadFailed: "Upload failed ({{status}})",
        bookNotFound: "The book could not be found.",
        missingFile: "No file was uploaded.",
        invalidEpub: "This file is not a valid EPUB.",
        serviceUnavailable: "The service is temporarily unavailable."
      }
    }
  }
} as const;

export type AppLocale = keyof typeof resources;

export const appLocales = Object.keys(resources) as AppLocale[];

const localeAliases: Record<string, AppLocale> = {
  zh: "zh-CN",
  "zh-cn": "zh-CN",
  "zh-hans": "zh-CN",
  en: "en",
  "en-us": "en",
  "en-gb": "en"
};

export function resolveAppLocale(input?: string | null): AppLocale | null {
  if (!input) {
    return null;
  }

  const normalized = input.trim().toLowerCase();
  if (!normalized) {
    return null;
  }

  return localeAliases[normalized] ?? localeAliases[normalized.split("-")[0]] ?? null;
}

export function resolvePreferredLocale(
  preferred: readonly string[] | string | null | undefined,
  fallback: AppLocale = "en"
): AppLocale {
  const candidates = Array.isArray(preferred) ? preferred : preferred ? [preferred] : [];

  for (const candidate of candidates) {
    const resolved = resolveAppLocale(candidate);
    if (resolved) {
      return resolved;
    }
  }

  return fallback;
}
