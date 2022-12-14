'use strict';

/*eslint no-unused-vars: ["off"]*/

import { initializeTome } from './data/tomeDb.js';
import { progress } from './load.js';

import { ReadModel } from './Model/ReadModel.js';
import { ReadView } from './View/ReadView.js';
import { ReadController } from './Controller/ReadController.js';

import { NavigatorModel } from './Model/NavigatorModel.js';
import { NavigatorBookView } from './View/NavigatorBookView.js';
import { NavigatorChapterView } from './View/NavigatorChapterView.js';
import { NavigatorController } from './Controller/NavigatorController.js';

import { BookmarkModel } from './Model/BookmarkModel.js';
import { BookmarkListView } from './View/BookmarkListView.js';
import { BookmarkMoveCopyView } from './View/BookmarkMoveCopyView.js';
import { BookmarkFolderView } from './View/BookmarkFolderView.js';
import { BookmarkFolderAddView } from './View/BookmarkFolderAddView.js';
import { BookmarkFolderDeleteView } from './View/BookmarkFolderDeleteView.js';
import { BookmarkFolderRenameView } from './View/BookmarkFolderRenameView.js';
import { BookmarkExportview } from './View/BookmarkExportView.js';
import { BookmarkImportView } from './View/BookmarkImportView.js';
import { BookmarkController } from './Controller/BookmarkController.js';

import { SearchModel } from './Model/SearchModel.js';
import { SearchResultView } from './View/SearchResultView.js';
import { SearchFilterView } from './View/SearchFilterView.js';
import { SearchHistoryView } from './View/SearchHistoryView.js';
import { SearchLookupView } from './View/SearchLookupView.js';
import { SearchController } from './Controller/SearchController.js';

import { SettingModel } from './Model/SettingModel.js';
import { SettingView } from './View/SettingView.js';
import { SettingController } from './Controller/SettingController.js';

import { HelpModel } from './Model/HelpModel.js';
import { HelpReadView } from './View/HelpReadView.js';
import { HelpTopicView } from './View/HelpTopicView.js';
import { HelpController } from './Controller/HelpController.js';

const APP_FONT = 'font--roboto';

let loadMsg = document.querySelector('.load-msg');
let loadScroll = document.querySelector('.load-scroll');

(async () => {
  let body = document.body;
  let load = body.querySelector('.load');

  await initializeTome(progress);

  let readView = new ReadView();
  let readController = new ReadController();
  let readModel = new ReadModel();

  let navigatorBookView = new NavigatorBookView();
  let navigatorChapterView = new NavigatorChapterView();
  let navigatorController = new NavigatorController();
  let navigatorModel = new NavigatorModel();

  let bookmarkListView = new BookmarkListView();
  let bookmarkMoveCopyView = new BookmarkMoveCopyView();
  let bookmarkFolderView = new BookmarkFolderView();
  let bookmarkFolderAddView = new BookmarkFolderAddView();
  let bookmarkFolderDeleteView = new BookmarkFolderDeleteView();
  let bookmarkFolderRenameView = new BookmarkFolderRenameView();
  let bookmarkExportview = new BookmarkExportview();
  let bookmarkImportView = new BookmarkImportView();
  let bookmarkController = new BookmarkController();
  let bookmarkModel = new BookmarkModel();

  let searchResultView = new SearchResultView();
  let searchFilterView = new SearchFilterView();
  let searchHistoryView = new SearchHistoryView();
  let searchLookupView = new SearchLookupView();
  let searchController = new SearchController();
  let searchModel = new SearchModel();

  let settingView = new SettingView();
  let settingController = new SettingController();
  let settingModel = new SettingModel();

  let helpReadView = new HelpReadView();
  let helpTopicView = new HelpTopicView();
  let helpController = new HelpController();
  let helpModel = new HelpModel();

  load.classList.add('load--hide');
  document.documentElement.classList.add(APP_FONT);

  console.log(`intializeApp():     ${Date.now()}`);
  readController.initializeApp();
  console.log(`ready:              ${Date.now()}`);

})();
