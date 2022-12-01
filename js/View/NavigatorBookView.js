'use strict';

import {
  queue,
} from '../CommandQueue.js';
import {
  templateElement,
  templatePage,
  templateScroll,
  templateToolbarLower,
  templateToolbarUpper,
} from '../template.js';
import {
  tomeBooks,
} from '../data/tomeDb.js';
import {
  bookLongName,
  bookShortName,
} from '../data/tomeIdx.js';

const lowerToolSet = [
  { type: 'btn', icon: 'back', ariaLabel: 'Back' },
  { type: 'btn', icon: 'navigator-chapter', ariaLabel: 'Chapter' },
];

const upperToolSet = [
  { type: 'banner', cssModifier: 'navigator-book', text: 'Book' },
];

class NavigatorBookView {

  constructor() {
    this.initialize();
  }

  addListeners() {
    this.list.addEventListener('click', (event) => {
      this.listClick(event);
    });
    this.toolbarLower.addEventListener('click', (event) => {
      this.toolbarLowerClick(event);
    });
  }

  bookIdxUpdate(bookIdx) {
    let activeBtn = this.list.querySelector('.btn-book--active');
    if (activeBtn) {
      activeBtn.classList.remove('btn-book--active');
    }
    let selector = `.btn-book[data-book-idx="${bookIdx}"]`;
    activeBtn = this.list.querySelector(selector);
    activeBtn.classList.add('btn-book--active');
  }

  buildApocryphaList() {
    let booksApocrypha = document.createElement('div');
    booksApocrypha.classList.add('content', 'content--apocrypha-book');
    for (let idx of [...Array(tomeBooks.length).keys()]) {
      let btn = this.buildBtnBook(idx);
      booksApocrypha.appendChild(btn);
    }
    return booksApocrypha;
  }

  buildBooklist() {
    let booksApocrypha = this.buildApocryphaList();
    this.list.appendChild(booksApocrypha);
  }

  buildBtnBook(bookIdx) {
    let btn = document.createElement('button');
    btn.classList.add('btn-book');
    btn.dataset.bookIdx = bookIdx;
    btn.textContent = tomeBooks[bookIdx][bookLongName];
    btn.setAttribute('aria-label', tomeBooks[bookIdx][bookLongName]);
    return btn;
  }

  buildPage() {
    this.page = templatePage('navigator-book');

    this.toolbarUpper = templateToolbarUpper(upperToolSet);
    this.page.appendChild(this.toolbarUpper);

    this.scroll = templateScroll('navigator-book');
    this.list = templateElement('div', 'list', 'navigator-book', null, null);
    this.scroll.appendChild(this.list);
    this.page.appendChild(this.scroll);

    this.toolbarLower = templateToolbarLower(lowerToolSet);
    this.page.appendChild(this.toolbarLower);

    let container = document.querySelector('.container');
    container.appendChild(this.page);
  }

  contentClick(btn) {
    let bookIdx = parseInt(btn.dataset.bookIdx);
    queue.publish('navigator-book.select', bookIdx);
  }

  getElements() {
    this.btnBack = this.toolbarLower.querySelector('.btn-icon--back');
    this.btnChapter = this.toolbarLower.querySelector('.btn-icon--navigator-chapter');
  }

  hide() {
    this.page.classList.add('page--hide');
  }

  initialize() {
    this.buildPage();
    this.getElements();
    this.addListeners();
    this.subscribe();

    this.buildBooklist();
  }

  listClick(event) {
    event.preventDefault();
    let btn = event.target.closest('button');
    if (btn) {
      if (btn.classList.contains('btn-book')) {
        this.contentClick(btn);
      }
    }
  }

  show() {
    this.page.classList.remove('page--hide');
  }

  subscribe() {
    queue.subscribe('bookIdx.update', (bookIdx) => {
      this.bookIdxUpdate(bookIdx);
    });

    queue.subscribe('navigator-book.hide', () => {
      this.hide();
    });
    queue.subscribe('navigator-book.show', () => {
      this.show();
    });
  }

  toolbarLowerClick(event) {
    event.preventDefault();
    let btn = event.target.closest('button');
    if (btn) {
      if (btn === this.btnBack) {
        queue.publish('navigator.back', null);
      } else if (btn === this.btnChapter) {
        queue.publish('navigator-chapter', null);
      }
    }
  }

}

export { NavigatorBookView };
