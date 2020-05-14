import createNewElement from './createNewElement.js';
import readDate from './readDate.js';

export default function createIncomingMsgPreview(email, subject, date) {
  const incomingMsgContainer = createNewElement('div', 'incoming-msg-container');
  const incomingEmail = createNewElement('div', 'incoming-email', `<p>${email}</p>`);
  let subjectTrimmed = subject;
  if (subject.length > 15) {
    subjectTrimmed = subject.substring(0, 15);
    subjectTrimmed += '...';
  }
  const incomingSubject = createNewElement('div', 'incoming-subject', `<p>${subjectTrimmed}</p>`);
  const readedDate = readDate(date);
  const incomingDate = createNewElement('div', 'incoming-date', `<p>${readedDate}</p>`);
  incomingMsgContainer.appendChild(incomingEmail);
  incomingMsgContainer.appendChild(incomingSubject);
  incomingMsgContainer.appendChild(incomingDate);

  return incomingMsgContainer;
}
