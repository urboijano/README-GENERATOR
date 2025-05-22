/**
 * Simple markdown to HTML renderer
 */
export function renderMarkdown(markdown: string): string {
  if (!markdown) return '';
  
  // Convert headings
  let html = markdown
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // Convert paragraphs - matching text blocks separated by one or more blank lines
  html = html.replace(/^(?!<h[1-6]|<ul|<ol|<li|<blockquote|<pre)(.+)$/gim, '<p>$1</p>');
  
  // Convert bold and italic
  html = html
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Convert inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Convert code blocks - matching indented code blocks
  html = html.replace(/```([\s\S]*?)```/g, (match, p1) => {
    return `<pre><code>${p1.trim()}</code></pre>`;
  });
  
  // Convert links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  
  // Convert unordered lists
  let inList = false;
  const lines = html.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].match(/^- (.*)$/)) {
      if (!inList) {
        lines[i] = '<ul>\n  <li>' + lines[i].replace(/^- (.*)$/, '$1') + '</li>';
        inList = true;
      } else {
        lines[i] = '  <li>' + lines[i].replace(/^- (.*)$/, '$1') + '</li>';
      }
    } else if (inList) {
      lines[i - 1] += '\n</ul>';
      inList = false;
    }
  }
  if (inList) {
    lines[lines.length - 1] += '\n</ul>';
  }
  html = lines.join('\n');
  
  // Convert images
  html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1">');
  
  // Fix self-closing tags for images
  html = html.replace(/<img([^>]*)>/g, '<img$1 />');
  
  // Clean up any empty paragraphs
  html = html.replace(/<p>\s*<\/p>/g, '');
  
  // Clean up blockquotes
  html = html.replace(/&gt; (.*)/g, '<blockquote>$1</blockquote>');
  
  return html;
}
