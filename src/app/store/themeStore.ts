import { makeAutoObservable } from "mobx";

class ThemeStore {
  themeMode: 'light' | 'dark' = 'light';

  constructor() {
    makeAutoObservable(this);
  }

  setThemeMode(mode: 'light' | 'dark') {
    this.themeMode = mode;
  }

  toggleTheme() {
    this.themeMode = this.themeMode === 'light' ? 'dark' : 'light';
  }
}

const themeStore = new ThemeStore();
export default themeStore;
