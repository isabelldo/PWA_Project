const idb = require("./idb.js");

idb.openDB("posts-store", 1, {
  upgrade(db) {
    // Create a store of objects
    const store = db.createObjectStore("posts", {
      // The '_id' property of the object will be the key.
      keyPath: "_id",
    });
    // Create an index on the '_id' property of the objects.
    store.createIndex("_id", "_id");

    const store2 = db.createObjectStore("sync-posts", {
      keyPath: "id",
    });
    store2.createIndex("id", "id");
  },
});

function writeData(st, data) {
  idb.then((dbPosts) => {
    let tx = dbPosts.transaction(st, "readwrite");
    let store = tx.objectStore(st);
    store.put(data);
    return tx.done;
  });
}

function readAllData(st) {
  return idb.then((dbPosts) => {
    let tx = dbPosts.transaction(st, "readonly");
    let store = tx.objectStore(st);
    return store.getAll();
  });
}

function clearAllData(st) {
  return idb.then((dbPosts) => {
    let tx = dbPosts.transaction(st, "readwrite");
    let store = tx.objectStore(st);
    store.clear();
    return tx.done;
  });
}

function deleteOneData(st, id) {
  idb
    .then((dbPosts) => {
      let tx = dbPosts.transaction(st, "readwrite");
      let store = tx.objectStore(st);
      store.delete(id);
      return tx.done;
    })
    .then(() => {
      console.log("Data deleted ...");
    });
}

module.exports = { writeData, readAllData, clearAllData, deleteOneData };
