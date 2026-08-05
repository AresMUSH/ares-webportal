import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { action, computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import { tracked } from '@glimmer/tracking';

class MarkdownEditorInfo {
  cursorStart = 0;
  cursorEnd = 0;
  selection = '';
  beforeCursor = '';
  afterCursor = '';

  constructor(editor, text = "") {
    this.cursorStart = editor.selectionStart;
    this.cursorEnd = editor.selectionEnd;
    this.selection = text.substring(this.cursorStart, this.cursorEnd) || '';
    this.beforeCursor = text.substring(0,this.cursorStart);
    this.afterCursor = text.substring(this.cursorEnd, text.length);
  }
};


export default Component.extend({

  previewText: null,
  rows: 3,
  gameApi: service(),
  cookies: service(),
  text: '',
  editor: null,
  linkText: '',
  linkUrl: '',
  toolbarVisible: true,
  
  height: computed('rows', function() {
    return (this.rows < 10) ? "250px" : "500px";
  }),  
    
  didInsertElement() {
    this.set('editor', $('#editor-area')[0]);
    this.set('toolbarVisible', this.cookies.markdownToolbarVisible() === "true");
  },
  
  moveCursor(cursorPos) {
    this.editor.focus();
    setTimeout(() => this.editor.selectionEnd = cursorPos, 25);
  },    
  
  addFormatCodeBracket(beforeCode, afterCode) {
    
    let edInfo = new MarkdownEditorInfo(this.editor, this.text);
    var cursorPos;

    this.set('text', `${edInfo.beforeCursor}${beforeCode}${edInfo.selection}${afterCode}${edInfo.afterCursor}`);
    
    if (edInfo.selection.length > 0) {
      cursorPos = edInfo.cursorEnd + beforeCode.length + afterCode.length;
    }
    else {
      cursorPos = edInfo.cursorStart + beforeCode.length;
    }    
    this.moveCursor(cursorPos);
  },
  
  addStandaloneBlock(edInfo, block, replaceSelection = false, cursorOffset = 0) {
    let separator = (this.text || "").length > 0 ? "\n\n" : "";
    let selection = replaceSelection ? "" : edInfo.selection;
    this.set('text', `${edInfo.beforeCursor}${selection}${separator}${block}${separator}${edInfo.afterCursor}`);
    this.moveCursor(edInfo.cursorStart + cursorOffset + separator.length);
  },
  
  @action
  preview() {
    if (this.get('previewText.length') > 0) {
      this.set('previewText', null);
      return;
    }
    let api = this.gameApi;
      
    api.requestOne('markdownPreview', { text: this.text || "" })
    .then( (response) => {
      if (response.error) {
        return;
      }
      this.set('previewText', response.text);
    });
  },
  
  @action
  onChange(value) {  
    this.set('text', value);
  },
  
  @action
  keyDown(event) {
    if (event.keyCode == 13) {
      if (event.ctrlKey || event.metaKey) {
        
        // Needed because onEnter is optional - we don't want to trigger it if it's not set.
        if (this.onEnter) {
          this.onEnter();
        }      
        
        event.preventDefault();
      }
    }
  },
  
  @action
  toggleToolbar() {
    let newValue = !this.toolbarVisible;
    this.set('toolbarVisible', newValue);
    this.cookies.setMarkdownToolbarVisible(newValue);
  },
  
  @action
  onBold() {
    this.addFormatCodeBracket("**", "**");
  },
  
  @action
  onItalic() {
    this.addFormatCodeBracket("_", "_");
  },
  
  @action
  onHeading() {
    let edInfo = new MarkdownEditorInfo(this.editor, this.text);
    this.addStandaloneBlock(edInfo, `## ${edInfo.selection}`, true, 3);
  },
  
  @action
  onOrderedList() {
    let edInfo = new MarkdownEditorInfo(this.editor, this.text);
    let list = edInfo.selection.trim().split("\n").map((line, index) => `${index + 1}. ${line}`).join("\n");
    this.addStandaloneBlock(edInfo, list, true, 3);
  },
  
  @action
  onBulletList() {
    let edInfo = new MarkdownEditorInfo(this.editor, this.text);
    let list = edInfo.selection.trim().split("\n").map((line) => `* ${line}`).join("\n");
    this.addStandaloneBlock(edInfo, list, true, 2);
  },
  
  @action
  onTable() {
    let edInfo = new MarkdownEditorInfo(this.editor, this.text); 
    let table = "|Heading|Heading|\n|----|----|\n|Data|Data|"   
    this.addStandaloneBlock(edInfo, table);
  },
  
  @action
  onLine() {
    let edInfo = new MarkdownEditorInfo(this.editor, this.text);
    this.addStandaloneBlock(edInfo, "----");
  },
  
  @action
  onCode() {
    this.addFormatCodeBracket("`", "`");
  },
  
  @action
  onCodeBlock() {
    let edInfo = new MarkdownEditorInfo(this.editor, this.text)
    let blockSeparator = "```";
    let code = `${blockSeparator}\n${edInfo.selection}\n${blockSeparator}`;
    this.addStandaloneBlock(edInfo, code, true, 4);
  },
  
  @action
  onLink() {
    let edInfo = new MarkdownEditorInfo(this.editor, this.text)
    var linkText = "Link Text";
    var linkUrl = "https://example.com";
    if (edInfo.selection) {
      if (edInfo.selection.startsWith("http") || edInfo.selection.startsWith("/")) {
        linkUrl = edInfo.selection;
      } else {
        linkText = edInfo.selection;
      }
    } 
    this.set('text', `${edInfo.beforeCursor}[${linkText}](${linkUrl})${edInfo.afterCursor} `);
    this.moveCursor(edInfo.cursorStart);
  },
  
  @action
  onImage() {
    let edInfo = new MarkdownEditorInfo(this.editor, this.text)
    let image = "[[image /game/uploads/theme_images/jumbotron.png height=100px width=100px url=http://example.com center]]";
    this.addStandaloneBlock(edInfo, image);
  },
  
  @action
  onTabs() {
    let edInfo = new MarkdownEditorInfo(this.editor, this.text);  
    let tabs = "[[tabview]]" +
      "\n[[tab Title1]]" +
      "\nSome text." +
      "\n[[/tab]]" +
      "\n[[tab Title2]]" +
      "\nSome other text." +
      "\n[[/tab]]" +
      "\n[[/tabview]]";
    this.addStandaloneBlock(edInfo, tabs);
  }
  
});
