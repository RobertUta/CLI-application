import { nanoid } from "nanoid"; // Importing nanoid function from nanoid module
import { promises as fs } from "fs"; // Importing promises API from fs module
import path from "path"; // Importing path module

const contactsPath = path.join("db", "contacts.json"); // Constructing the file path

// Reading a file with JSON format and parsing it into an Object
async function readJson() {
  try {
    const data = await fs.readFile(contactsPath, "utf-8"); // returns a String
    const contactList = JSON.parse(data); // parses a String (JSON) into an Object (Array)
    return contactList; // returns a Promise
  } catch (error) {
    return error.message;
  }
}

// Displaying the list of contacts in the console
async function listContacts() {
  try {
    const contactsList = await readJson();
    console.table(contactsList); // displaying data in tabular form in the console
  } catch (error) {
    return error.message;
  }
}

// Searching for a contact by id
async function getContactById(id) {
  try {
    const contactsList = await readJson();
    const searchedContact = contactsList.find((contact) => contact.id === id);
    console.log(searchedContact);
    return searchedContact; // returns a Promise with the contact object with the required id
  } catch (error) {
    return error.message;
  }
}

// Deleting a contact from the contacts file by id
async function removeContact(id) {
  try {
    const contactList = await readJson(); // read the JSON file, save a reference to the parsed JSON object
    const updatedContactList = contactList.filter(
      (contact) => contact.id !== id // create a new list of contacts with the contact removed by id
    );
    const updatedContactListJson = JSON.stringify(
      updatedContactList,
      null,
      "\t"
    ); // convert the array of contacts into a JSON string
    await fs.writeFile(contactsPath, updatedContactListJson); // overwrite the contacts.json file with the new content
    console.log("The contact was successfully removed");
  } catch (error) {
    return error.message;
  }
}

// Adding a contact to the contacts.json file
async function addContact(name, email, phone) {
  try {
    const contactList = await readJson();
    const newContact = { id: nanoid(), name, email, phone };
    const isExistingContact = Boolean(
      contactList.find((contact) => contact.email === newContact.email)
    );
    if (isExistingContact) {
      console.log("The contact is already in the list");
      return;
    }
    const newContactList = JSON.stringify(
      [newContact, ...contactList],
      null,
      "\t"
    );
    await fs.writeFile(contactsPath, newContactList);
    console.log("Contact was successfully added");
  } catch (error) {
    return error.message;
  }
}

export { listContacts, getContactById, removeContact, addContact };
