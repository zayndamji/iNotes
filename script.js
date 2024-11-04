const createNote = document.getElementById('createNote');
const notesList = document.getElementById('notesList');

const notes = {};

const uuidList = JSON.parse(localStorage.getItem('uuidList'));
if (uuidList) {
  const lastUUID = uuidList[uuidList.length-1]
  focusNote(lastUUID, localStorage[lastUUID]);
}

createNote.addEventListener('click', () => {
  focusNote(crypto.randomUUID());
});

function focusNote(uuid, content) {
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
  note.setAttribute('id', uuid);

  Array.from(notesList.children).forEach(e => {
    notes[e.id] = undefined;
    notesList.removeChild(e);
  })

  notesList.append(note);

  notes[uuid] = new EditorJS({
    holder: uuid
  });
}