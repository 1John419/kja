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

const lowerToolSet = [
  { type: 'btn', icon: 'back', ariaLabel: 'Back' },
  { type: 'btn', icon: 'help-read', ariaLabel: 'Help Read' },
];

const upperToolSet = [
  { type: 'banner', cssModifier: 'topic', text: 'Topic' },
];

export const helpTopicList = [
  { topic: 'about', name: 'About' },
  { topic: 'overview', name: 'Overview' },
  { topic: 'read', name: 'Read' },
  { topic: 'clipboard-mode', name: 'Clipboard Mode' },
  { topic: 'navigator', name: 'Navigator' },
  { topic: 'bookmark', name: 'Bookmark' },
  { topic: 'search', name: 'Search' },
  { topic: 'setting', name: 'Setting' },
  { topic: 'help', name: 'Help' },
  { topic: 'thats-my-king', name: 'That\'s MY KING!' },
];

const templateBtnTopic = (helpTopic) => {
  let btnTopic = templateElement(
    'button', 'btn-topic', helpTopic.topic, helpTopic.name, helpTopic.name);
  btnTopic.dataset.topic = helpTopic.topic;
  return btnTopic;
};

const templateListTopic = () => {
  let list = templateElement(
    'div', 'list', 'topic', null, null);
  for (let topic of helpTopicList) {
    let btn = templateBtnTopic(topic);
    list.appendChild(btn);
  }
  return list;
};

class HelpTopicView {

  constructor() {
    this.initialize();
  }

  addListeners() {
    this.scroll.addEventListener('click', (event) => {
      this.scrollClick(event);
    });
    this.toolbarLower.addEventListener('click', (event) => {
      this.toolbarLowerClick(event);
    });
  }

  buildPage() {
    this.page = templatePage('help-topic');

    this.toolbarUpper = templateToolbarUpper(upperToolSet);
    this.page.appendChild(this.toolbarUpper);

    this.scroll = templateScroll('help-topic');
    this.list = templateListTopic();
    this.scroll.appendChild(this.list);

    this.page.appendChild(this.scroll);

    this.toolbarLower = templateToolbarLower(lowerToolSet);
    this.page.appendChild(this.toolbarLower);

    let container = document.querySelector('.container');
    container.appendChild(this.page);
  }

  getElements() {
    this.btnBack = this.toolbarLower.querySelector('.btn-icon--back');
    this.btnHelpRead = this.toolbarLower.querySelector('.btn-icon--help-read');
  }

  hide() {
    this.page.classList.add('page--hide');
  }

  initialize() {
    this.buildPage();
    this.getElements();
    this.addListeners();
    this.subscribe();
  }

  scrollClick(event) {
    event.preventDefault();
    let btn = event.target.closest('button');
    if (btn) {
      if (btn.classList.contains('btn-topic')) {
        let helpTopic = btn.dataset.topic;
        queue.publish('help-topic.select', helpTopic);
      }
    }
  }

  show() {
    this.page.classList.remove('page--hide');
  }

  subscribe() {
    queue.subscribe('help-topic.show', () => {
      this.show();
    });
    queue.subscribe('help-topic.hide', () => {
      this.hide();
    });
  }

  toolbarLowerClick(event) {
    event.preventDefault();
    let btn = event.target.closest('button');
    if (btn) {
      if (btn === this.btnBack) {
        queue.publish('help.back', null);
      } else if (btn === this.btnHelpRead) {
        queue.publish('help-read', null);
      }
    }
  }

}

export { HelpTopicView };
