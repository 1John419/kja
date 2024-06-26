'use strict';

import { queue } from '../CommandQueue.js';
import { util } from '../util.js';
import { tomeIdx} from '../data/tomeIdx.js';
import { tomeLists} from '../data/tomeLists.js';
import { tomeDb } from '../Model/DbModel.js';

class ReadModel {

  constructor() {
    this.initialize();
  }

  chapterIdxUpdate(chapterIdx) {
    this.chapterIdx = chapterIdx;
    this.updateReadVerseObjs();
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
    const defaultColumnMode = false;
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
    const defaultSidebar = this.panes > 1 ? 'navigator' : 'none';
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
    queue.subscribe('chapterIdx.update', (chapterIdx) => {
      this.chapterIdxUpdate(chapterIdx);
    });

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

  async updateReadVerseObjs() {
    const chapter = tomeLists.chapters[this.chapterIdx];
    const keys = util.range(chapter[tomeIdx.chapter.firstVerseIdx],
      chapter[tomeIdx.chapter.lastVerseIdx] + 1);
    this.verseObjs = await tomeDb.verses.bulkGet(keys);
    queue.publish('read.verse-objs.update', this.verseObjs);
  }
}

export { ReadModel };
