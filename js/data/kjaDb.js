'use strict';

import { progress } from '../progress.js';
import { dbUtil } from '../data/dbUtil.js';

const dbSetup = {
  name: 'kja',
  stores: {
    verses: 'k',
    words: 'k',
  },
  url: '/json/kja.json',
  version: '2024-05-12',
};

export let kjaDb = null;
export const kjaName = dbSetup.name;
export let kjaVerseCount = null;
export let kjaWords = null;

export const initializeKjaDb = async () => {
  progress('');
  progress('* kja database *');
  progress('');
  kjaDb = await dbUtil.versionCheck(dbSetup);
  await populateDb();
  await loadKjaWords();
  kjaVerseCount = await kjaDb.verses.count();
  progress('kja initialized.');
};

const loadKjaWords = async () => {
  progress('loading kja words...');
  const wordObjs = await kjaDb.words.toArray();
  kjaWords = wordObjs.map(x => x.k);
};

const populateDb = async () => {
  const wordCount = await kjaDb.words.count();
  if (wordCount === 0) {
    const data = await dbUtil.fetchJson(dbSetup.url);

    progress('populating kja verses...');
    await kjaDb.verses.bulkAdd(data.verses);
    progress('populating kja words...');
    await kjaDb.words.bulkAdd(data.words);
    progress('kja population complete.');
  } else {
    progress('kja already populated.');
  }
};
