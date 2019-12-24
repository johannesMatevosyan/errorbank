import { AngularEditorConfig } from '@kolkov/angular-editor';
export class EditorSettings {
  options: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '600',
    minHeight: '600',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here... ',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      {class: 'Roboto', name: 'Roboto'},
      {class: 'arial', name: 'Arial'},
      {class: 'times-new-roman', name: 'Times New Roman'},
    ],
    customClasses: [],
    uploadUrl: 'v1/image',
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize'],
      ['insertImage', 'insertVideo']
    ]
  };

  getEditorSettings() {
    return this.options;
  }
};
