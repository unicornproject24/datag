import { Textarea } from '../ui/textarea';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2, 
  Heading3,
  Quote,
  Minus
} from 'lucide-react';
import { Button } from '../ui/button';

interface AdvancedEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export function AdvancedEditor({ content, onChange, placeholder = 'Write your content here...', className = '' }: AdvancedEditorProps) {
  const insertText = (text: string) => {
    const textarea = document.querySelector('textarea[data-editor="advanced"]') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = content.substring(0, start) + text + content.substring(end);
      onChange(newContent);
      
      // Focus and set cursor position
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + text.length, start + text.length);
      }, 0);
    }
  };

  const wrapSelection = (before: string, after: string = before) => {
    const textarea = document.querySelector('textarea[data-editor="advanced"]') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = content.substring(start, end);
      const newContent = content.substring(0, start) + before + selectedText + after + content.substring(end);
      onChange(newContent);
      
      // Focus and maintain selection
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
      }, 0);
    }
  };

  const formatLine = (format: string) => {
    const textarea = document.querySelector('textarea[data-editor="advanced"]') as HTMLTextAreaElement;
    if (textarea) {
      const lines = content.split('\n');
      const cursorLine = content.substring(0, textarea.selectionStart).split('\n').length - 1;
      
      if (format === 'heading1') {
        lines[cursorLine] = `# ${lines[cursorLine].replace(/^#\s*/, '')}`;
      } else if (format === 'heading2') {
        lines[cursorLine] = `## ${lines[cursorLine].replace(/^##\s*/, '')}`;
      } else if (format === 'heading3') {
        lines[cursorLine] = `### ${lines[cursorLine].replace(/^###\s*/, '')}`;
      } else if (format === 'blockquote') {
        lines[cursorLine] = `> ${lines[cursorLine].replace(/^>\s*/, '')}`;
      } else if (format === 'hr') {
        lines.splice(cursorLine + 1, 0, '---');
      }
      
      onChange(lines.join('\n'));
    }
  };

  return (
    <div className={`border rounded-xl border-border bg-white ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-3 border-b border-border bg-muted/50 rounded-t-xl">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => formatLine('heading1')}
          className="h-8 px-2"
          title="Heading 1"
          type="button"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => formatLine('heading2')}
          className="h-8 px-2"
          title="Heading 2"
          type="button"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => formatLine('heading3')}
          className="h-8 px-2"
          title="Heading 3"
          type="button"
        >
          <Heading3 className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-6 bg-border mx-1"></div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => wrapSelection('**', '**')}
          className="h-8 px-2"
          title="Bold"
          type="button"
        >
          <Bold className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => wrapSelection('*', '*')}
          className="h-8 px-2"
          title="Italic"
          type="button"
        >
          <Italic className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-6 bg-border mx-1"></div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => wrapSelection('- ', '')}
          className="h-8 px-2"
          title="Bullet List"
          type="button"
        >
          <List className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => wrapSelection('1. ', '')}
          className="h-8 px-2"
          title="Numbered List"
          type="button"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-6 bg-border mx-1"></div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => formatLine('blockquote')}
          className="h-8 px-2"
          title="Blockquote"
          type="button"
        >
          <Quote className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => formatLine('hr')}
          className="h-8 px-2"
          title="Horizontal Rule"
          type="button"
        >
          <Minus className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Editor Content */}
      <div className="p-4">
        <Textarea
          data-editor="advanced"
          value={content}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-h-[300px] resize-y font-mono text-sm leading-relaxed"
        />
        <div className="mt-2 text-xs text-muted-foreground">
          Use Markdown syntax for formatting. Toolbar buttons will help you format text.
        </div>
      </div>
    </div>
  );
}