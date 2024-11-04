const createNote = document.getElementById('createNote');
const notesList = document.getElementById('notesList');

const notes = {};

const uuidList = JSON.parse(localStorage.getItem('uuidList'));
if (uuidList) {
  for (const uuid of uuidList) {
    appendNoteToGUI(uuid, localStorage[uuid]);
  }
}

createNote.addEventListener('click', () => {
  appendNoteToGUI(crypto.randomUUID());
});

function appendNoteToGUI(uuid, content) {
  console.log(uuid, content);

  if (content == undefined) {
    content = "";
  }

  const uuidList = JSON.parse(localStorage.getItem('uuidList'));
  if (uuidList && !uuidList.includes(uuid)) {
    uuidList.push(uuid);
    localStorage.setItem('uuidList', JSON.stringify(uuidList));
  } else {
    localStorage.setItem('uuidList', JSON.stringify([uuid]));
  }
  localStorage[uuid] = '';

  const note = document.createElement('div');
  note.classList.add('note');
  note.setAttribute('uuid', uuid);

  const noteInput = document.createElement('textarea');

  note.append(noteInput);

  notesList.append(note);

  notes[uuid] = new SimpleMDE({ element: noteInput });

  notes[uuid].codemirror.on('change', () => {
    localStorage[uuid] = notes[uuid].value();
  });

  notes[uuid].value(content);
}