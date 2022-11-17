'use strict';

import {
  queue,
} from '../CommandQueue.js';

class ReadModel {

  constructor() {
    this.initialize();
  }

  columnModeChange(columnMode) {
    this.columnMode = columnMode;
    this.saveColumnMode();
    queue.publish('read.column-mode.update', this.columnMode);
  }

  columnModeToogle() {
    this.columnModeChange(!this.columnMode);
  }

  initialize() {
    this.subscribe();
  }

  panesChange(panes) {
    this.panes = panes;
    queue.publish('panes.update', this.panes);
  }

  restore() {
    this.restoreColumnMode();
    this.restoreSidebar();
  }

  restoreColumnMode() {
    let defaultColumnMode = false;
    let columnMode = localStorage.getItem('columnMode');
    if (!columnMode) {
      columnMode = defaultColumnMode;
    } else {
      try {
        columnMode = JSON.parse(columnMode);
      } catch (error) {
        columnMode = defaultColumnMode;
      }
      if (typeof columnMode !== 'boolean') {
        columnMode = defaultColumnMode;
      }
    }
    this.columnModeChange(columnMode);
  }

  restoreSidebar() {
    let defaultSidebar = this.panes > 1 ? 'navigator' : 'none';
    let sidebar = localStorage.getItem('sidebar');
    if (!sidebar) {
      sidebar = defaultSidebar;
    } else {
      try {
        sidebar = JSON.parse(sidebar);
      } catch (error) {
        sidebar = defaultSidebar;
      }
    }
    if (this.panes > 1) {
      sidebar = sidebar === 'none' ? 'navigator' : sidebar;
    } else if (sidebar !== 'none') {
      sidebar = 'none';
    }
    this.sidebarChange(sidebar);
  }

  saveColumnMode() {
    localStorage.setItem('columnMode',
      JSON.stringify(this.columnMode));
  }

  saveSidebar() {
    localStorage.setItem('sidebar', JSON.stringify(this.sidebar));
  }

  sidebarChange(sidebar) {
    this.sidebar = sidebar;
    this.saveSidebar();
    queue.publish('sidebar.update', this.sidebar);
  }

  subscribe() {
    queue.subscribe('panes.change', (panes) => {
      this.panesChange(panes);
    });

    queue.subscribe('read.column-mode.toggle', () => {
      this.columnModeToogle();
    });
    queue.subscribe('read.restore',
      () => { this.restore(); }
    );

    queue.subscribe('sidebar.change', (sidebar) => {
      this.sidebarChange(sidebar);
    });
  }

}

export { ReadModel };
