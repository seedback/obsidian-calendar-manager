import { ItemView, WorkspaceLeaf } from 'obsidian';
import { createApp, App as VueApp } from 'vue';
import App from './App.vue';

export const CALENDAR_VIEW_TYPE: string = 'calendar-view';

export class CalendarView extends ItemView {
  vueapp: VueApp;
  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
  }
  getViewType(): string {
      return CALENDAR_VIEW_TYPE;
  }
  getDisplayText(): string {
      return "Vue Stater";
  }
  getIcon(): string {
      return "dice";
  }
  async onOpen() {
    const container = this.containerEl.children[1];
    container.empty();
    container.createEl("div", {
        cls: "my-plugin-view"
    });
    this.vueapp = createApp(App);
    this.vueapp.mount('.my-plugin-view');
  }
  async onClose() {
      this.vueapp.unmount();
  }
}