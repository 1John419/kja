'use strict';

import { queue } from '../CommandQueue.js';
import { template } from '../template.js';
import { tomeIdx } from '../data/tomeIdx.js';
import { tomeLists } from '../data/tomeLists.js';

const greekFirstIdx = 39;
const indices = [...Array(66).keys()];

const lowerToolSet = [
  { type: 'btn', icon: 'back', ariaLabel: null },
  { type: 'btn', icon: 'navigator-chapter', ariaLabel: null },
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
    const selector = `.btn-book[data-book-idx="${bookIdx}"]`;
    activeBtn = this.list.querySelector(selector);
    activeBtn.classList.add('btn-book--active');
  }

  buildApocList() {
    const books = document.createElement('div');
    books.classList.add('content', 'content--books');
    for (const idx of [...Array(tomeLists.books.length).keys()]) {
      const btn = this.buildBtnBook(idx);
      books.appendChild(btn);
    }
    return books;
  }

  buildBookList() {
    const books = this.buildApocList();
    this.list.appendChild(books);
  }

  buildBtnBook(bookIdx) {
    const btn = document.createElement('div');
    btn.classList.add('btn-book');
    btn.dataset.bookIdx = bookIdx;
    btn.textContent = tomeLists.books[bookIdx][tomeIdx.book.longName];
    return btn;
  }

  buildPage() {
    this.page = template.page('navigator-book');

    this.toolbarUpper = template.toolbarUpper(upperToolSet);
    this.page.appendChild(this.toolbarUpper);

    this.scroll = template.scroll('navigator-book');
    this.list = template.element('div', 'list', 'navigator-book', null, null);
    this.scroll.appendChild(this.list);
    this.page.appendChild(this.scroll);

    this.toolbarLower = template.toolbarLower(lowerToolSet);
    this.page.appendChild(this.toolbarLower);

    const container = document.querySelector('.container');
    container.appendChild(this.page);
  }

  contentClick(btn) {
    const bookIdx = parseInt(btn.dataset.bookIdx);
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

    this.buildBookList();
  }

  listClick(event) {
    event.preventDefault();
    const btn = event.target.closest('div.btn-book');
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
    const btn = event.target.closest('div.btn-icon');
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
