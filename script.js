// DOM elements to interact with
const createNote = document.getElementById('createNote');
const deleteNote = document.getElementById('deleteNote');
const notesList = document.getElementById('notesList');
const focusedNote = document.getElementById('focusedNote');

let currentNote = undefined, currentUUID = undefined;

// displays last edited note OR empty note if no notes have been created
const uuidList = getUUIDList();
if (uuidList && uuidList[0]) {
  focusNote(uuidList[0]);
} else {
  const uuid = crypto.randomUUID();
  localStorage.setItem(uuid, JSON.stringify({"time":1730769988217,"blocks":[{"id":"Ux8d0IhMH9","type":"paragraph","data":{"text":"<b>Demo Note</b>"}},{"id":"9O_ROcctlg","type":"paragraph","data":{"text":"This is the <i>iNotes</i>&nbsp;app, where you can write notes about anything!"}},{"id":"_bNC8nJB3_","type":"paragraph","data":{"text":"In <i>iNotes</i>, you can <b>bold</b>&nbsp;words by clicking Command+B and <i>italicize </i>words by clicking Command+I. You can also <i>bold and italize</i>&nbsp;words/phrases by clicking both of the above shortcuts."}},{"id":"0T2q6iKlZP","type":"paragraph","data":{"text":"To create your own note, click the \"Create Note\" button in the top left."}},{"id":"c-yU7nFQBb","type":"paragraph","data":{"text":"If you want, you can delete this note by clicking the \"Delete Note\" button in the top left. That will automatically delete this note and create a new note for you."}},{"id":"uK68Lr6D3_","type":"paragraph","data":{"text":"<b>All of your notes will be saved in your browser, and loaded back once you reload the page.</b>"}}],"version":"2.30.6"}));
  focusNote(uuid);
}

createNote.addEventListener('click', createEmptyNote);

// deletes the focused note
deleteNote.addEventListener('click', () => {
  if (currentUUID == undefined) return;

  const uuidList = getUUIDList();
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

// creates an empty note with random uuid
function createEmptyNote() {
  focusNote(crypto.randomUUID());
}

// focuses note with uuid
function focusNote(uuid) {
  const uuidList = getUUIDList();

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

// re-renders notes list
function renderNotesList() {
  const uuidList = getUUIDList();

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
        selectorText = sanitize(noteContent.blocks[0].data.text);
        selectorText = truncate(selectorText, 20);
      }
    }

    const noteSelector = document.createElement('button');
    noteSelector.textContent = selectorText;
    noteSelector.classList.add('noteSelector');
    noteSelector.onclick = () => {
      focusNote(uuid);
    }

    if (uuid == currentUUID) {
      noteSelector.classList.add('selected');
    } else {
      noteSelector.classList.remove('selected');
    }

    notesList.appendChild(noteSelector);
  }

  const spacer = document.createElement('span')
  spacer.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
  notesList.appendChild(spacer);
}

// gets and sorts UUID list
function getUUIDList() {
  let uuidList = JSON.parse(localStorage.getItem('uuidList'));
  if (!uuidList) return undefined;

  uuidList = uuidList
  .map(e => {
    const timestamp = localStorage[e] ? JSON.parse(localStorage[e]).time : (new Date().getTime());
    return {
      uuid: e,
      timestamp: timestamp
    }
  })
  .sort((a, b) => b.timestamp - a.timestamp)
  .map(e => e.uuid);

  return uuidList;
}

// truncates string to numOfChars, with trailing dots if the string is too long.
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
  return string.replace(/&nbsp;/gi, '') // remove non-breaking spaces from display
               .replace(/<b>/gi, '').replace(/<\/b>/gi, '') // remove bold (<b>)
               .replace(/<i>/gi, '').replace(/<\/i>/gi, ''); // remove italics (<i>)
}