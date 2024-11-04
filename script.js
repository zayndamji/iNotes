const createNote = document.getElementById('createNote');
const notesList = document.getElementById('notesList');

let currentNote = undefined;

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

  if (notesList.children.length > 0)
    notesList.removeChild(notesList.children[0]);
  notesList.appendChild(note);

  currentNote = new EditorJS({
    holder: uuid
  });
}