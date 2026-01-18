import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';
import TurndownService from 'turndown';

const USER_AGENT = 'Mozilla/5.0 (compatible; ReadabilityAPI/1.0)';


export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // 只允许 GET
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use GET.',
    });
  }

  // 获取 URL 参数
  const targetUrl = req.query.url as string;

  if (!targetUrl) {
    return res.status(400).json({
      success: false,
      error: 'Missing required parameter: url',
    });
  }

  // 验证 URL 格式
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(targetUrl);
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      throw new Error('Invalid protocol');
    }
  } catch {
    return res.status(400).json({
      success: false,
      error: 'Invalid URL format. Must be a valid http/https URL.',
    });
  }

  try {
    // 获取 HTML
    const response = await fetch(targetUrl, {
      headers: {
        Accept: 'text/html,application/xhtml+xml',
        'User-Agent': USER_AGENT,
      },
    });

    if (!response.ok) {
      return res.status(502).json({
        success: false,
        error: `Failed to fetch URL: HTTP ${response.status}`,
      });
    }

    const html = await response.text();
    if (!html.trim()) {
      return res.status(502).json({
        success: false,
        error: 'Empty HTML response from target URL',
      });
    }

    // 解析 HTML
    const dom = new JSDOM(html, { url: targetUrl });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    if (!article?.content?.trim()) {
      return res.status(422).json({
        success: false,
        error: 'Could not extract article content from the page',
      });
    }

    // 转换为 Markdown
    const turndown = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
    });
    const markdown = turndown.turndown(article.content);

    if (!markdown.trim()) {
      return res.status(422).json({
        success: false,
        error: 'Failed to convert article to markdown',
      });
    }

    // 设置缓存头（缓存 1 小时）
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');

    return res.status(200).json({
      success: true,
      data: {
        title: article.title || '',
        byline: article.byline,
        excerpt: article.excerpt,
        siteName: article.siteName,
        markdown,
        length: article.length,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({
      success: false,
      error: `Internal error: ${message}`,
    });
  }
}
