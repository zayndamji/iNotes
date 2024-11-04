const createNote = document.getElementById('createNote');
const notesList = document.getElementById('notesList');
const focusedNote = document.getElementById('focusedNote');

let currentNote = undefined;

const uuidList = JSON.parse(localStorage.getItem('uuidList'));
if (uuidList) {
  focusNote(uuidList[uuidList.length-1]);
}

createNote.addEventListener('click', () => {
  focusNote(crypto.randomUUID());
});

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

    onChange: (api, event) => {
      // console.log(api, event);

      currentNote.save().then((outputData) => {
        localStorage[uuid] = JSON.stringify(outputData);
        renderNotesList();
      });
    }
  });

  renderNotesList();
}

function renderNotesList() {
  const uuidList = JSON.parse(localStorage.getItem('uuidList'));
  if (!uuidList) return;

  notesList.textContent = '';

  for (const uuid of uuidList) {
    let selectorText = 'Empty Note';
    if (localStorage[uuid] != undefined) {
      let noteContent = JSON.parse(localStorage[uuid]);
      if (noteContent.blocks &&
          noteContent.blocks[0] &&
          noteContent.blocks[0].data && 
          noteContent.blocks[0].data.text) {
        selectorText = truncate(noteContent.blocks[0].data.text, 35);
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
  return string.replace(/&nbsp;/gi, '');
}