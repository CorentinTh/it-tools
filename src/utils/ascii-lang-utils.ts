function escapeXml(unsafe: string) {
  return unsafe.replace(/[<>&'"]/g, (c: string | undefined) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
    return '';
  });
}

const dontEscape = '';
const escapeBackslash = '\\\\';
const escapeSingleQuote = '\'';
const escapeDoubleQuote = '"';
const defaultEscape = escapeBackslash + escapeSingleQuote + escapeDoubleQuote;
export const languages = [
  { id: 'raw', name: 'Raw Text', prefix: '', suffix: '', begin: '', end: '', escape: dontEscape },
  { id: 'bash', name: 'Bash', prefix: 'echo "', suffix: '"', begin: '', end: '', escape: escapeBackslash + escapeDoubleQuote },
  { id: 'pwsh', name: 'PowerShell', prefix: 'Write-Output \'', suffix: '\'', begin: '', end: '', escape: escapeBackslash + escapeSingleQuote },
  { id: 'c', name: 'C', prefix: 'printf("', suffix: '\\n");', begin: '#include <stdio.h>\n', end: '', escape: defaultEscape },
  { id: 'cpp', name: 'C++', prefix: 'std::cout << "', suffix: '\\n";', begin: '#include <iostream>\n', end: '', escape: defaultEscape },
  { id: 'csharp', name: 'C#', prefix: 'Console.WriteLine(@"', suffix: '");', begin: 'using System;\n', end: '', escape: escapeDoubleQuote },
  { id: 'vbnet', name: 'VB.Net', prefix: 'Console.WriteLine("', suffix: '")', begin: '', end: '', escape: (l: string) => l.replace('"', '""') },
  { id: 'node', name: 'Node.js', prefix: 'console.log("', suffix: '");', begin: '', end: '', escape: defaultEscape },
  { id: 'python', name: 'Python', prefix: 'print("', suffix: '")', begin: '', end: '', escape: escapeBackslash + escapeDoubleQuote },
  { id: 'html', name: 'HTML', prefix: '', suffix: '', begin: '<pre>\n', end: '\n</pre>', escape: (l: string) => escapeXml(l) },
  { id: 'rust', name: 'Rust', prefix: 'println!("', suffix: '");', begin: '', end: '', escape: defaultEscape },
  { id: 'go', name: 'Go', prefix: 'fmt.Println("', suffix: '")', begin: 'import "fmt"\n', end: '', escape: defaultEscape },
  { id: 'ruby', name: 'Ruby', prefix: 'puts "', suffix: '"', begin: '', end: '', escape: defaultEscape },
  { id: 'php', name: 'PHP', prefix: 'echo "', suffix: '\\n";', begin: '<?php\n', end: '\n?>', escape: defaultEscape },
  { id: 'swift', name: 'Swift', prefix: 'print("', suffix: '")', begin: '', end: '', escape: defaultEscape },
  { id: 'kotlin', name: 'Kotlin', prefix: 'println("', suffix: '")', begin: '', end: '', escape: defaultEscape },
  { id: 'sql', name: 'SQL', prefix: 'SELECT \'', suffix: '\\n\'', begin: '', end: '', escape: (l: string) => l.replace('\'', '\'\'') },
  { id: 'java', name: 'Java', prefix: 'System.out.println("', suffix: '");', begin: '', end: '', escape: defaultEscape },
];
export function translateToLanguage(asciiArt: string, languageId: string) {
  const langConfig = languages.find(l => l.id === languageId);
  if (!langConfig) {
    return asciiArt;
  }

  const escape = typeof langConfig.escape === 'function'
    ? langConfig.escape
    : function (line: string) {
      return langConfig.escape
        ? line.replace(new RegExp(`([${langConfig.escape}])`, 'g'), '\\$1')
        : line;
    };
  return langConfig.begin + asciiArt.split('\n').map((line) => {
    return langConfig.prefix + escape(line) + langConfig.suffix;
  }).join('\n') + langConfig.end;
}
