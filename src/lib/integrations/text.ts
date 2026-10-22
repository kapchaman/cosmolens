export function decodeHtmlEntities(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, code: string) =>
      String.fromCharCode(Number(code)),
    );
}

export function htmlToPlainText(value?: string) {
  if (!value) {
    return "";
  }

  return decodeHtmlEntities(value)
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(
      /<br\s*\/?>|<\/?(?:p|div|li|ul|ol|h[1-6]|section|article|nav|header|footer|table|tr|td)\b[^>]*>/gi,
      " ",
    )
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function truncateText(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength).trimEnd()}...`;
}

/** Reject recognizable site chrome instead of presenting it as an article excerpt. */
export function cleanNewsSummary(value: string) {
  if (
    /explore this section|\bAPOD\b.*\b(?:index|calendar|submissions)\b|\bsubmissions\s+index\s+search\b/i.test(
      value,
    )
  )
    return "";
  return value.replace(/^\s*\d+\s*min(?:ute)?s?\s+read\s*/i, "").trim();
}
