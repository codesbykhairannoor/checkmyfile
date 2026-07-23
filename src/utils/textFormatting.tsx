import React from 'react';

const STOP_WORDS = new Set([
  'and', 'or', 'in', 'to', 'for', 'with', 'at', 'on', 'by', 'of', 'from',
  'di', 'ke', 'dan', 'atau', 'dalam', 'untuk', 'dari', 'dengan', 'pada',
  'y', 'et', 'en', 'und', 'zu', 'mit', 'para', 'por', 'de', 'a', 'la', 'el', 'le', 'les', 'des', 'un', 'une', 'o'
]);

const CRITICAL_NOUNS = new Set([
  'pdf', 'word', 'excel', 'powerpoint', 'ppt', 'jpg', 'jpeg', 'png', 'txt', 'csv', 'html',
  'document', 'dokumen', 'documents', 'file', 'files', 'berkas', 'halaman', 'pages', 'image', 'images'
]);

export function smartHighlight(title: string, highlightClass: string = 'gradient-text') {
  const words = title.split(/\s+/);
  
  if (words.length <= 3) {
    return <span className={highlightClass}>{title}</span>;
  }

  let highlightCount = 2;
  
  // Extend if we land on a stop word (e.g., "Split and" -> "Split and Extract")
  while (highlightCount < words.length && STOP_WORDS.has(words[highlightCount - 1].toLowerCase())) {
    highlightCount++;
  }

  // Extend if the next word is a critical noun we shouldn't cut off (e.g., "Extract" + "PDF" -> "Extract PDF")
  const nextWordClean = highlightCount < words.length ? words[highlightCount].toLowerCase().replace(/[^a-z0-9]/g, '') : '';
  if (highlightCount < words.length && CRITICAL_NOUNS.has(nextWordClean)) {
    highlightCount++;
  }

  // One more check: if extending brought us to another stop word, extend again (e.g., "Word to" -> "Word to PDF")
  while (highlightCount < words.length && STOP_WORDS.has(words[highlightCount - 1].toLowerCase())) {
    highlightCount++;
    const nextClean = highlightCount < words.length ? words[highlightCount].toLowerCase().replace(/[^a-z0-9]/g, '') : '';
    if (CRITICAL_NOUNS.has(nextClean)) highlightCount++;
  }

  // Safety ceiling: don't highlight the entire long title
  if (highlightCount >= words.length && words.length > 3) {
    highlightCount = words.length - 1;
  }

  const highlighted = words.slice(0, highlightCount).join(' ');
  const restWords = words.slice(highlightCount);

  return (
    <>
      <span className={highlightClass}>{highlighted}</span>
      {restWords.length > 0 && ' '}
      {restWords.map((word, idx) => {
        const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/g, '');
        const isCritical = CRITICAL_NOUNS.has(cleanWord);
        const isLast = idx === restWords.length - 1;
        return (
          <React.Fragment key={idx}>
            {isCritical ? <span className={highlightClass}>{word}</span> : word}
            {!isLast && ' '}
          </React.Fragment>
        );
      })}
    </>
  );
}
