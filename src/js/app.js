import { interval, of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map, catchError } from 'rxjs/operators';

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

const url = 'https://ahj-homework-11-1.herokuapp.com';

const currentUnreadMessages = [];

const timer = interval(1000);
timer.subscribe(() => {
  const response = ajax.getJSON(`${url}/messages/unread`).pipe(
    map((result) => {
      const unreadMessages = result.messages;
      unreadMessages.forEach((message) => {
        const isExist = currentUnreadMessages.find((item) => item === message.id);
        if (!isExist) {
          const preview = createIncomingMsgPreview(message.from, message.subject, message.received);
          incomingWrapper.prepend(preview);
          currentUnreadMessages.push(message.id);
        }
      });
    }),
    catchError((error) => of(error)),
  );
  response.subscribe();
});
