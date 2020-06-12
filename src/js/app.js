import { interval, of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { catchError, pluck, mergeMap } from 'rxjs/operators';

import createNewElement from './createNewElement.js';
import createIncomingMsgPreview from './createIncomingMsgPreview.js';

const bodyEl = document.querySelector('body');

const mainContainer = createNewElement('div', 'main-container');

const incomingContainer = createNewElement('div', 'incoming-container');
const incomingContainerHeader = createNewElement('div', 'container-header', '<p>Incoming</p>');
const incomingWrapper = createNewElement('div', 'incoming-wrapper');
incomingContainer.appendChild(incomingContainerHeader);
incomingContainer.appendChild(incomingWrapper);

mainContainer.appendChild(incomingContainer);
bodyEl.insertBefore(mainContainer, bodyEl.firstChild);

const url = 'http://localhost:7070'; // 'https://ahj-homework-11-1.herokuapp.com';

const currentUnreadMessages = [];

interval(1000)
  .pipe(
    mergeMap(() => {
      const unreadMessages = ajax.getJSON(`${url}/messages/unread`).pipe(
        catchError(() => of({ messages: 'no new messages' })),
        pluck('messages'),
      );
      return unreadMessages;
    }),
  )
  .subscribe((unreadMessages) => {
    if (unreadMessages === 'no new messages') {
      console.log(unreadMessages);
      return;
    }
    unreadMessages.forEach((message) => {
      const isExist = currentUnreadMessages.find((item) => item === message.id);
      if (!isExist) {
        const preview = createIncomingMsgPreview(message.from, message.subject, message.received);
        incomingWrapper.prepend(preview);
        currentUnreadMessages.push(message.id);
      }
    });
  });
