import { makeAutoObservable } from 'mobx';

class ThemeStore {
  themeMode: 'light' | 'dark' = 'light';

  constructor() {
    makeAutoObservable(this);
  }

  setThemeMode(mode: 'light' | 'dark') {
    this.themeMode = mode;
    localStorage?.setItem('themeMode', mode);
  }

  toggleTheme() {
    const newMode = this.themeMode === 'light' ? 'dark' : 'light';
    this.setThemeMode(newMode);
  }

  initTheme() {
    const savedMode = localStorage?.getItem('themeMode');
    if (savedMode === 'light' || savedMode === 'dark') {
      this.themeMode = savedMode;
    } else {
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.themeMode = prefersDarkMode ? 'dark' : 'light';
    }
  }
}

const themeStore = new ThemeStore();
export default themeStore;
