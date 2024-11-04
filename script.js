const createNote = document.getElementById('createNote');
const notesList = document.getElementById('notesList');

createNote.addEventListener('click', () => {
  const note = document.createElement('div');
  note.classList.add('note');
  note.setAttribute('uuid', crypto.randomUUID());

  const noteTitle = document.createElement('div');
  noteTitle.classList.add('noteTitle');
  noteTitle.contentEditable = true;

  const noteInput = document.createElement('div');
  noteInput.classList.add('noteInput');
  noteInput.contentEditable = true;

  note.append(noteTitle, noteInput);

  notesList.append(note);
});