const createNote = document.getElementById('createNote');
const notesList = document.getElementById('notesList');

createNote.addEventListener('click', () => {
  const note = document.createElement('div');
  note.classList.add('note');

  const noteInput = document.createElement('div');
  noteInput.classList.add('noteInput');
  noteInput.contentEditable = true;

  note.append(noteInput);

  notesList.append(note);
});