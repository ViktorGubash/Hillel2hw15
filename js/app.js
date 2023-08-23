class Contact {
    constructor(title, figure, phone) {
        this.title = title;
        this.figure = figure;
        this.phone = phone;
    }
}
class UI {
    static displayContacts() {
        const contacts = Store.readContacts();
        contacts.forEach((contact) => UI.addContactToList(contact));
    }
    static addContactToList(contact) {
        const list = document.querySelector('#contact-list');
        const row = document.createElement('tr');
        row.innerHTML = `
         <td>${contact.title}</td>
         <td>${contact.figure}</td>
         <td>${contact.phone}</td>
         <td><a href="#" class="btn btn-danger btn-sm delete">Del</a></td>
      `;
        list.appendChild(row)
    }
    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#figure').value = '';
        document.querySelector('#phone').value = '';
    }
    static deleteContact(e) {
        if (e.classList.contains('delete')) {
            e.parentElement.parentElement.remove();
        }
    }
    static showErorr(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#contact-form');
        container.insertBefore(div, form);
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }
}

class Store {
    static readContacts() {
        let contacts;
        if (localStorage.getItem('contacts') === null) {
            contacts = [];
        } else {
            contacts = JSON.parse(localStorage.getItem('contacts'));
        }
        return contacts;
    }
    static addContact(contact) {
        const contacts = Store.readContacts();
        contacts.push(contact);
        localStorage.setItem('contacts', JSON.stringify(contacts));
    }
    static removeContact(phone) {
        const contacts = Store.readContacts();

        contacts.forEach((contact, index) => {
            if (contact.phone === phone) {
                contacts.splice(index, 1);
            }
        });

        localStorage.setItem('contacts', JSON.stringify(contacts));
    }
}

document.addEventListener('DOMContentLoaded', UI.displayContacts);

document.querySelector('#contact-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.querySelector('#title').value;
    const figure = document.querySelector('#figure').value;
    const phone = document.querySelector('#phone').value;
    if (title === '' || figure === '' || phone === '') {
        UI.showErorr('Check and fill in fields for adding an element.', 'danger');
    } else {
        const contact = new Contact(title, figure, phone);
        UI.addContactToList(contact);
        Store.addContact(contact);
        UI.clearFields();
        UI.showErorr('Додали нову книгу до каталогу.', 'success');
    }
});

document.querySelector('#contact-list').addEventListener('click', (e) => {
    UI.deleteContact(e.target);
    Store.removeContact(e.target.parentElement.previousElementSibling.textContent);
    UI.showErorr('Contact Deleted!', 'warning');
})