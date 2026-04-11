const DATABASE_NAME = 'terminal-portfolio'
const DATABASE_VERSION = 2
const STORE_NAME = 'shell'
const ROOT_SESSION_KEY = 'root-session'
const LEGACY_SESSION_KEY = 'session'

function openDatabase() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null)
      return
    }

    const request = window.indexedDB.open(DATABASE_NAME, DATABASE_VERSION)

    request.onupgradeneeded = () => {
      const database = request.result

      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME)
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

async function withStore(mode, operation) {
  try {
    const database = await openDatabase()

    if (!database) {
      return null
    }

    return await new Promise((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, mode)
      const store = transaction.objectStore(STORE_NAME)

      const result = operation(store)

      transaction.oncomplete = () => {
        database.close()
        resolve(result)
      }

      transaction.onerror = () => {
        database.close()
        reject(transaction.error)
      }
    })
  } catch {
    return null
  }
}

async function readSession(store, key) {
  return new Promise((resolve, reject) => {
    const request = store.get(key)

    request.onsuccess = () => resolve(request.result ?? null)
    request.onerror = () => reject(request.error)
  })
}

export async function loadRootSession() {
  const database = await openDatabase()

  if (!database) {
    return null
  }

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readonly')
    const store = transaction.objectStore(STORE_NAME)

    transaction.oncomplete = () => {
      database.close()
    }

    transaction.onerror = () => {
      database.close()
      reject(transaction.error)
    }

    readSession(store, ROOT_SESSION_KEY)
      .then((rootSession) => {
        if (rootSession) {
          resolve(rootSession)
          return null
        }

        return readSession(store, LEGACY_SESSION_KEY).then((legacySession) => {
          resolve(legacySession)
        })
      })
      .catch(reject)
  }).catch(() => null)
}

export async function saveRootSession(session) {
  return withStore('readwrite', (store) => {
    store.put(session, ROOT_SESSION_KEY)
  })
}
