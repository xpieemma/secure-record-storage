const base = 'http://localhost:3001/api';

async function test() {
  const timestamp = Date.now(); // Unique timestamp for test users

  // ---- Register Alice ----
  const aliceUsername = `alice${timestamp}`;
  const aliceEmail = `alice${timestamp}@example.com`;
  console.log('Registering Alice:', aliceEmail);

  const registerAlice = await fetch(`${base}/users/register`, {
    method: 'POST',
    body: JSON.stringify({ // JSON.stringfy() converts a JavaScript object to a JSON string
      username: aliceUsername,
      email: aliceEmail,
      password: 'password123'
    }),
    headers: { 'Content-Type': 'application/json' } // Content-Type header specifies the media type of the resource
  });

  if (!registerAlice.ok) {
    console.error('Alice registration failed');
    return;
  }
  const aliceData = await registerAlice.json(); // await waits for the promise to resolve and returns the value
  const aliceToken = aliceData.token;
  console.log('Alice token obtained');

  // ---- Register Bob ----
  const bobUsername = `bob${timestamp}`;
  const bobEmail = `bob${timestamp}@example.com`;
  console.log('Registering Bob:', bobEmail);

  const registerBob = await fetch(`${base}/users/register`, {
    method: 'POST',
    body: JSON.stringify({
      username: bobUsername,
      email: bobEmail,
      password: 'password123'
    }),
    headers: { 'Content-Type': 'application/json' } // Content-Type header specifies the media type of the resource
  });

  if (!registerBob.ok) {
    console.error('Bob registration failed');
    return;
  }
  const bobData = await registerBob.json(); // await waits for the promise to resolve and returns the value
  const bobToken = bobData.token;
  console.log('Bob token obtained');

  //---- Alice creates a note ----
  console.log('\n--- Alice creates a note ---');
  const createRes = await fetch(`${base}/notes`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${aliceToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title: 'Alice Secret', content: 'Only Alice can see this' }) // JSON.stringfy() converts a JavaScript object to a JSON string
  });

  if (!createRes.ok) {
    console.error('Create note failed');
    return;
  }
  const note = await createRes.json(); // await waits for the promise to resolve and returns the value      
  console.log('Created note:', note);
  const noteId = note._id;

  // ---- Alice updates her own note (should succeed) ----
  console.log('\n--- Alice updates her own note (should succeed) ---');
  const updateOwn = await fetch(`${base}/notes/${noteId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${aliceToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title: 'Updated Title', content: 'Updated content' }) // JSON.stringfy() converts a JavaScript object to a JSON string
  });

  if (updateOwn.status === 200) {
    const updated = await updateOwn.json();
    console.log('✅ Update succeeded:', updated);
  } else {
    console.error('❌ Update failed unexpectedly:', updateOwn.status);
  }

  // ---- Bob tries to update Alice's note (should get 403) ----
  console.log('\n--- Bob tries to update Alice\'s note (should get 403) ---');
  const updateBob = await fetch(`${base}/notes/${noteId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${bobToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title: 'Hacked', content: 'Bob trying to hijack' }) // JSON.stringfy() converts a JavaScript object to a JSON string
  });

  if (updateBob.status === 403) {
    const errorMsg = await updateBob.json();
    console.log('✅ Forbidden as expected:', errorMsg.message);
  } else {
    console.error('❌ Bob was able to update (status', updateBob.status, ')');
  }

  // ---- Bob tries to delete Alice's note (should get 403) ----
  console.log('\n--- Bob tries to delete Alice\'s note (should get 403) ---');
  const deleteBob = await fetch(`${base}/notes/${noteId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${bobToken}` } // Authorization header with Bob's token
  });

  if (deleteBob.status === 403) {
    const errorMsg = await deleteBob.json();
    console.log('✅ Forbidden as expected:', errorMsg.message);
  } else {
    console.error('❌ Bob was able to delete (status', deleteBob.status, ')');
  }

  // ---- Alice deletes her own note (should succeed) ----
  console.log('\n--- Alice deletes her own note (should succeed) ---');
  const deleteOwn = await fetch(`${base}/notes/${noteId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${aliceToken}` } // Authorization header with Alice's token 
  });

  if (deleteOwn.status === 200) {
    const result = await deleteOwn.json();
    console.log('✅ Delete succeeded:', result.message);
  } else {
    console.error('❌ Delete failed:', deleteOwn.status);
  }

  // ---- Verify Alice's notes are empty ----
  console.log('\n--- Verify Alice has no notes left ---');
  const aliceNotes = await fetch(`${base}/notes`, {
    headers: { 'Authorization': `Bearer ${aliceToken}` }
  });
  const notesList = await aliceNotes.json();
  console.log('Alice notes after deletion:', notesList);
  if (notesList.length === 0) {
    console.log('✅ Note successfully removed');
  } else {
    console.error('❌ Note still present');
  }

  console.log('\n--- All tests completed ---');
}

test();