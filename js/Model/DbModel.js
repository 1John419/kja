'use strict';

import { queue } from '../CommandQueue.js';
import { kjaDb, kjaVerseCount, kjaWords } from '../data/kjaDb.js';

export let tomeDb = null;
export let tomeVerseCount = null;
export let tomeWords = null;

class DbModel {

  constructor() {
    this.initialize();
  }

  initialize() {
    this.subscribe();
  }

  restore() {
    tomeDb = kjaDb;
    tomeVerseCount = kjaVerseCount;
    tomeWords = kjaWords;
  }

  subscribe() {
    queue.subscribe('db.restore', () => {
      this.restore();
    });
  }

}

export { DbModel };
