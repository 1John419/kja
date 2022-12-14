'use strict';

import {
  queue,
} from '../CommandQueue.js';
import {
  templateActionMenu,
  templateElement,
  templateBtnIcon,
  templatePage,
  templateScroll,
  templateToolbarLower,
  templateToolbarUpper,
} from '../template.js';
import {
  removeAllChildren,
} from '../util.js';

const actionSet = [
  { icon: 'up', ariaLabel: 'Up' },
  { icon: 'down', ariaLabel: 'Down' },
  { icon: 'rename', ariaLabel: 'Rename' },
  { icon: 'delete', ariaLabel: 'Delete' },
  { icon: 'cancel', ariaLabel: 'Cancel' },
];

const lowerToolSet = [
  { type: 'btn', icon: 'back', ariaLabel: 'Back' },
  { type: 'btn', icon: 'bookmark-folder-add', ariaLabel: 'Bookmark Folder Add' },
  { type: 'btn', icon: 'import', ariaLabel: 'Import' },
  { type: 'btn', icon: 'export', ariaLabel: 'Export' },
  { type: 'btn', icon: 'bookmark-list', ariaLabel: 'Bookmark List' },
];

const upperToolSet = [
  { type: 'banner', cssModifier: 'bookmark-folder', text: 'Bookmark Folder' },
];

class BookmarkFolderView {

  constructor() {
    this.initialize();
  }

  actionMenuClick(event) {
    event.preventDefault();
    let btn = event.target.closest('button');
    if (btn) {
      if (btn === this.btnCancel) {
        this.actionMenu.classList.add('action-menu--hide');
      } else {
        let entry = this.activeEntry.querySelector('.btn-entry');
        let folderName = entry.textContent;
        if (btn === this.btnDelete) {
          this.delete(folderName);
        } else if (btn === this.btnDown) {
          this.down(folderName);
        } else if (btn === this.btnRename) {
          this.rename(folderName);
        } else if (btn === this.btnUp) {
          this.up(folderName);
        }
        this.actionMenu.classList.add('action-menu--hide');
      }
    }
  }

  addListeners() {
    this.actionMenu.addEventListener('click', (event) => {
      this.actionMenuClick(event);
    });
    this.list.addEventListener('click', (event) => {
      this.listClick(event);
    });
    this.toolbarLower.addEventListener('click', (event) => {
      this.toolbarLowerClick(event);
    });
  }

  buildEntry(folderName) {
    let entry = document.createElement('div');
    entry.classList.add('entry', 'entry--folder');
    let btnEntry = document.createElement('button');
    btnEntry.classList.add('btn-entry', 'btn-entry--folder');
    btnEntry.textContent = folderName;
    let btnMenu = templateBtnIcon('h-menu', 'h-menu', 'Menu');
    entry.appendChild(btnEntry);
    entry.appendChild(btnMenu);
    return entry;
  }

  buildPage() {
    this.page = templatePage('bookmark-folder');

    this.toolbarUpper = templateToolbarUpper(upperToolSet);
    this.page.appendChild(this.toolbarUpper);

    this.scroll = templateScroll('bookmark-folder');

    this.list = templateElement('div', 'list', 'bookmark-folder', null, null);
    this.scroll.appendChild(this.list);

    this.actionMenu = templateActionMenu('bookmark-folder', actionSet);
    this.scroll.appendChild(this.actionMenu);
    this.page.appendChild(this.scroll);

    this.toolbarLower = templateToolbarLower(lowerToolSet);
    this.page.appendChild(this.toolbarLower);

    let container = document.querySelector('.container');
    container.appendChild(this.page);
  }

  delete(folderName) {
    queue.publish('bookmark-folder.delete', folderName);
  }

  down(folderName) {
    queue.publish('bookmark-folder.down', folderName);
  }

  folderListUpdate(folderList) {
    this.folderList = folderList;
    this.updateFolders();
  }

  getElements() {
    this.btnUp = this.actionMenu.querySelector('.btn-icon--up');
    this.btnDown = this.actionMenu.querySelector('.btn-icon--down');
    this.btnRename = this.actionMenu.querySelector('.btn-icon--rename');
    this.btnDelete = this.actionMenu.querySelector('.btn-icon--delete');
    this.btnCancel = this.actionMenu.querySelector('.btn-icon--cancel');

    this.btnBack = this.toolbarLower.querySelector('.btn-icon--back');
    this.btnBookmarkList = this.toolbarLower.querySelector(
      '.btn-icon--bookmark-list');
    this.btnBookmarkFolderAdd = this.toolbarLower.querySelector(
      '.btn-icon--bookmark-folder-add');
    this.btnImport = this.toolbarLower.querySelector('.btn-icon--import');
    this.btnExport = this.toolbarLower.querySelector('.btn-icon--export');
  }

  hide() {
    this.actionMenu.classList.add('action-menu--hide');
    this.page.classList.add('page--hide');
  }

  initialize() {
    this.buildPage();
    this.getElements();
    this.addListeners();
    this.subscribe();
  }

  listClick(event) {
    event.preventDefault();
    let btn = event.target.closest('button');
    if (btn) {
      if (btn.classList.contains('btn-entry')) {
        let folderName = btn.textContent;
        queue.publish('bookmark-folder.select', folderName);
      } else if (btn.classList.contains('btn-icon--h-menu')) {
        let entry = btn.previousSibling;
        this.menuClick(entry);
      }
    }
  }

  menuClick(target) {
    this.showActionMenu(target);
  }

  rename(folderName) {
    queue.publish('bookmark-folder-rename', folderName);
  }

  show() {
    this.page.classList.remove('page--hide');
  }

  showActionMenu(target) {
    this.activeEntry = target.closest('div');
    let top = target.offsetTop;
    this.actionMenu.style.top = `${top}px`;
    this.actionMenu.classList.remove('action-menu--hide');
  }

  subscribe() {
    queue.subscribe('bookmark-folder.hide', () => {
      this.hide();
    });
    queue.subscribe('bookmark-folder.show', () => {
      this.show();
    });

    queue.subscribe('bookmark.folder-list.update', (folderList) => {
      this.folderListUpdate(folderList);
    });
  }

  toolbarLowerClick(event) {
    event.preventDefault();
    let btn = event.target.closest('button');
    if (btn) {
      if (btn === this.btnBack) {
        queue.publish('bookmark.back', null);
      } else if (btn === this.btnBookmarkList) {
        queue.publish('bookmark-list', null);
      } else if (btn === this.btnBookmarkFolderAdd) {
        queue.publish('bookmark-folder-add', null);
      } else if (btn === this.btnExport) {
        queue.publish('bookmark-export', null);
      } else if (btn === this.btnImport) {
        queue.publish('bookmark-import', null);
      }
    }
  }

  up(folderName) {
    queue.publish('bookmark-folder.up', folderName);
  }

  updateFolders() {
    let scrollSave = this.scroll.scrollTop;
    removeAllChildren(this.list);
    let fragment = document.createDocumentFragment();
    for (let folderName of this.folderList) {
      let entry = this.buildEntry(folderName);
      fragment.appendChild(entry);
    }
    this.list.appendChild(fragment);
    this.scroll.scrollTop = scrollSave;
  }

}

export { BookmarkFolderView };
