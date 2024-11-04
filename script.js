const createNote = document.getElementById('createNote');
const deleteNote = document.getElementById('deleteNote');
const notesList = document.getElementById('notesList');
const focusedNote = document.getElementById('focusedNote');

let currentNote = undefined, currentUUID = undefined;

const uuidList = JSON.parse(localStorage.getItem('uuidList'));
if (uuidList) {
  focusNote(uuidList[uuidList.length-1]);
}

createNote.addEventListener('click', createEmptyNote);

deleteNote.addEventListener('click', () => {
  if (currentUUID == undefined) return;

  const uuidList = JSON.parse(localStorage.getItem('uuidList'));
  if (uuidList == undefined) return;
  if (uuidList.length == 0) return;

  if (uuidList.length == 1) {
    localStorage.removeItem(uuidList[0]);
    uuidList.pop();
    localStorage.setItem('uuidList', JSON.stringify(uuidList));
    createEmptyNote();
    return;
  }

  const uuidIndex = uuidList.indexOf(currentUUID);
  localStorage.removeItem(uuidList[uuidIndex]);
  uuidList.splice(uuidIndex, 1); // remove uuid at index uuidIndex
  localStorage.setItem('uuidList', JSON.stringify(uuidList));
  if (uuidIndex == 0) {
    focusNote(uuidList[uuidIndex]);
  } else {
    focusNote(uuidList[uuidIndex-1]);
  }
});

function createEmptyNote() {
  focusNote(crypto.randomUUID());
}

function focusNote(uuid) {
  const uuidList = JSON.parse(localStorage.getItem('uuidList'));
  if (uuidList) {
    if (!uuidList.includes(uuid)) {
      uuidList.push(uuid);
      localStorage.setItem('uuidList', JSON.stringify(uuidList));
    }
  } else {
    localStorage.setItem('uuidList', JSON.stringify([uuid]));
  }

  const note = document.createElement('div');
  note.classList.add('note');
  note.setAttribute('id', uuid);

  if (focusedNote.children.length > 0)
    focusedNote.removeChild(focusedNote.children[0]);
  focusedNote.appendChild(note);

  currentNote = new EditorJS({
    holder: uuid,
    data: localStorage.getItem(uuid) ? JSON.parse(localStorage.getItem(uuid)) : undefined,
    autofocus: true,
    placeholder: 'Start writing whatever you want!',

    onChange: (api, event) => {
      // console.log(api, event);

      currentNote.save().then((outputData) => {
        localStorage[uuid] = JSON.stringify(outputData);
        renderNotesList();
      });
    }
  });
  
  currentUUID = uuid;

  renderNotesList();
}

function renderNotesList() {
  const uuidList = JSON.parse(localStorage.getItem('uuidList'));
  if (!uuidList) return;

  notesList.textContent = '';

  const recentNotesTitle = document.createElement('span');
  recentNotesTitle.classList.add('recentNotesTitle');
  recentNotesTitle.textContent = 'Recent Notes: '
  notesList.appendChild(recentNotesTitle);

  for (const uuid of uuidList) {
    let selectorText = 'Empty Note';
    if (localStorage[uuid] != undefined) {
      let noteContent = JSON.parse(localStorage[uuid]);
      if (noteContent.blocks &&
          noteContent.blocks[0] &&
          noteContent.blocks[0].data && 
          noteContent.blocks[0].data.text) {
        selectorText = truncate(noteContent.blocks[0].data.text, 20);
        selectorText = sanitize(selectorText);
      }
    }

    const noteSelector = document.createElement('button');
    noteSelector.textContent = selectorText;
    noteSelector.classList.add('noteSelector');
    noteSelector.onclick = () => {
      focusNote(uuid);
    }

    notesList.appendChild(noteSelector);
  }
}

function truncate(string, numOfChars) {
  if (string.length <= numOfChars) {
    return string;
  }

  if (numOfChars <= 3) {
    return string.substring(0, numOfChars);
  }

  return string.substring(0, numOfChars-3) + '...';
}

function sanitize(string) {
  return string.replace(/&nbsp;/gi, '').replace(/<b>/gi, '').replace(/<\/b>/gi, '');
}