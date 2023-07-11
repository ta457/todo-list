import './style.css';
import { format, endOfToday, endOfWeek, getWeekOfMonth } from 'date-fns';

class Todo {
    status = false;

    constructor(title, desc, dueDate) {
        this.title = title;
        this.desc = desc;
        this.dueDate = dueDate;
    }
    getStatus = () => {
        return this.status;
    }
    getTitle = () => {
        return this.title;
    }
    getDesc = () => {
        return this.desc;
    }
    getDue = () => {
        return this.dueDate;
    }
    getFormatedDue = () => {
        return format(this.dueDate, 'MM/dd/yyyy');
    }
    setStatus = (bool) => {
        this.status = bool;
    }
}

class List {
    constructor(title, array) {
        this.title = title;
        this.array = array;
    }
    getTitle = () => this.title;
    getArray = () => this.array;
}

function todoManager() {
    let todoList = [];
    let lists = [];

    //default data
    let defaultTodo1 = new Todo("Buy groceries", 
                        "Buy some eggs, chicken and veggies",
                        new Date(2023, 6, 11));
    let defaultTodo2 = new Todo("Prepare for tonight's party", 
                        "Make at least 5 dishes",
                        new Date(2023, 6, 11));
    let defaultTodo3 = new Todo("Finish the project", 
                        "It's almost done",
                        new Date(2023, 6, 13));
    let defaultTodo4 = new Todo("Push the project to Github", 
                        "Remember to enable live page.",
                        new Date(2023, 6, 13));
    todoList.push(defaultTodo1); 
    todoList.push(defaultTodo2);
    todoList.push(defaultTodo3);
    todoList.push(defaultTodo4);

    let defaultList = {
        title: "Todo List project",
        tasks: [2,3]
    }
    lists.push(defaultList);

    //functions
    const addTodo = (title, desc, due) => {
        let todo = new Todo(title, desc, due);
        todoList.push(todo);
    }

    const getTodos = () => todoList;

    const getLists = () => lists;

    return {getTodos, addTodo, getLists};
}

function screenController() {
    let todoMan = new todoManager();
    let todoList = todoMan.getTodos();
    let lists = todoMan.getLists();

    const main = document.querySelector('.main-content');

    //tool functions

    const changeTitle = (name) => {
        const title = document.querySelector('.title');
        title.textContent = name;
    }
    
    let lastFocus = document.querySelector('#all');
    const removeFocus = (element) => {
        element.classList.remove('focus');
    }
    const addFocus = (element) => {
        element.classList.add('focus');
    }

    const clearPage = () => {
        while(main.firstChild) {
            main.removeChild(main.lastChild);
        }
    }

    const makeTaskCard = (todo, index) => {
        let item = document.createElement('div');
        item.classList.add('main-item');
        let titleDiv = document.createElement('div');

        let checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.setAttribute('name', 'done');
        checkbox.classList.add('item-checkbox');
        checkbox.setAttribute('id', index);
        if(todo.getStatus() === true) checkbox.setAttribute('checked', 'true');
        checkbox.addEventListener('click', function() {
            todoList[checkbox.id].getStatus() === false ? 
            todoList[checkbox.id].setStatus(true) : todoList[checkbox.id].setStatus(false);
        })

        let title = document.createElement('strong');
        title.textContent = todo.getTitle();
        titleDiv.appendChild(checkbox); 
        titleDiv.appendChild(title);
        
        let dueDate = document.createElement('p');
        dueDate.id = "due-date"; 
        dueDate.textContent = "Due date: " + todo.getFormatedDue();
        
        let desc = document.createElement('p');
        desc.textContent = todo.getDesc();

        item.appendChild(titleDiv);
        item.appendChild(dueDate);
        item.appendChild(desc);
        main.appendChild(item);
    }

    //show all lists in nav
    const listContainer = document.querySelector('.list-container');
    const clearLists = () => {
        while(listContainer.firstChild) {
            listContainer.removeChild(listContainer.lastChild);
        }
    }
    const showLists = () => {
        clearLists();
        lists.forEach( (list, index) => {
            let row = document.createElement('div');
            row.classList.add('row');
            row.classList.add('nav-item');
            row.id = "list-" + index;
            
            let icon = document.createElement('img');
            icon.classList.add('icon')
            icon.setAttribute('src', '../src/icons/format-list-checkbox.svg');
            icon.setAttribute('alt', 'list');
            row.appendChild(icon);
            
            let rowText = document.createElement('p');
            rowText.textContent = list.title;
            row.appendChild(rowText);

            row.addEventListener('click', function(){
                listPage(row, list.title, list.tasks);
            })

            listContainer.appendChild(row);
        });
    }

    //set up new task page

    const newTaskNav = document.querySelector('#add-task');
    newTaskNav.addEventListener('click', function() {
        newTaskPage(newTaskNav);
    });
    const newTaskPage = (element) => {
        //changeFocus(element);
        removeFocus(lastFocus);
        addFocus(element);
        lastFocus = element;
        changeTitle("New task"); clearPage();

        let form = document.createElement('form');
        let rows = [];
        for(let i = 0; i < 5; i++) {
            let row = document.createElement('div');
            row.classList.add('row');
            row.classList.add('inp-row');
            rows.push(row);
        }

        let titleLabel = document.createElement('label');
        titleLabel.setAttribute('for', 'title');
        titleLabel.textContent = "Title";
        let titleInp = document.createElement('input');
        titleInp.setAttribute('type', 'text');
        titleInp.setAttribute('name', 'title');
        titleInp.setAttribute('id', 'title');
        titleInp.required = true;
        rows[0].appendChild(titleLabel); rows[0].appendChild(titleInp);

        let descLabel = document.createElement('label');
        descLabel.setAttribute('for', 'desc');
        descLabel.textContent = "Description";
        let descInp = document.createElement('textarea');
        descInp.setAttribute('rows', '2');
        descInp.setAttribute('name', 'desc');
        descInp.setAttribute('id', 'desc');
        rows[1].appendChild(descLabel); rows[1].appendChild(descInp);

        let dueLabel = document.createElement('label');
        dueLabel.setAttribute('for', 'due');
        dueLabel.textContent = "Due date";
        let dueInp = document.createElement('input');
        dueInp.setAttribute('type', 'date');
        dueInp.setAttribute('name', 'due');
        dueInp.setAttribute('id', 'due');
        dueInp.required = true;
        rows[2].appendChild(dueLabel); rows[2].appendChild(dueInp);

        let listLabel = document.createElement('label');
        dueLabel.setAttribute('for', 'list');
        dueLabel.textContent = "List";
        let listInp = document.createElement('select');
        listInp.setAttribute('name', 'list');
        listInp.setAttribute('id', 'list');
        lists.forEach((list, index) => {
            let option = document.createElement('option');
            option.setAttribute('value', 'select-'+index);
            option.textContent = list.title;
            listInp.appendChild(option);
        });
        rows[3].appendChild(listLabel); rows[3].appendChild(listInp);

        let submitBtn = document.createElement('button');
        submitBtn.setAttribute('type', 'submit');
        submitBtn.setAttribute('id', 'submit');
        submitBtn.textContent = "Save";
        submitBtn.addEventListener('click', function() {
            if(titleInp.value !== "" && dueInp.value !== "") {
                event.preventDefault();
                let date = dueInp.value.split("-");
                todoMan.addTodo(titleInp.value, descInp.value, new Date(date[0], date[1]-1, date[2]));
                
                let value = listInp.value;
                let listIndex = value[value.length -1];
                lists[listIndex].tasks.push(todoList.length-1);
            }
            titleInp.value = ""; descInp.value = ""; dueInp.value = "";
        });
        rows[4].appendChild(submitBtn);

        rows.forEach(row => {
            form.appendChild(row);
        });
        main.appendChild(form);
    }

    //set up the all tasks page

    const allTasksNav = document.querySelector('#all');
    allTasksNav.addEventListener('click', function() {
        allTaskPage(allTasksNav);
    });
    const allTaskPage = (element) => {
        removeFocus(lastFocus);
        addFocus(element);
        lastFocus = element;
        changeTitle("All tasks"); clearPage();

        todoList.forEach((todo, index) => {
            if(todo.getStatus() === false) {
                makeTaskCard(todo, index);
            }
        });
    }

    //set up today page

    const todayNav = document.querySelector('#today');
    todayNav.addEventListener('click', function() {
        todayPage(todayNav);
    });
    const todayPage = (element) => {
        removeFocus(lastFocus);
        addFocus(element);
        lastFocus = element; 
        changeTitle("Today"); clearPage();

        const today = format(endOfToday(), 'MM/dd/yyyy');
        todoList.forEach((todo, index) => {
            if(todo.getFormatedDue() === today && todo.getStatus() === false) {
                makeTaskCard(todo, index);
            }
        });
    }

    //set up this week page 

    const thisWeekNav = document.querySelector('#week');
    thisWeekNav.addEventListener('click', function() {
        thisWeekPage(thisWeekNav);
    });
    const thisWeekPage = (element) => {
        removeFocus(lastFocus);
        addFocus(element);
        lastFocus = element;
        changeTitle("This week"); clearPage();

        todoList.forEach((todo, index) => {
            if(getWeekOfMonth(todo.getDue()) === getWeekOfMonth(endOfToday())
                && todo.getStatus() === false) {
                makeTaskCard(todo, index);
            }
        });
    }

    //set up tasks done page

    const taskDoneNav = document.querySelector('#tasks-done');
    taskDoneNav.addEventListener('click', function() {
        taskDonePage(taskDoneNav);
    });
    const taskDonePage = (element) => {
        removeFocus(lastFocus);
        addFocus(element);
        lastFocus = element;
        changeTitle("Tasks done"); clearPage();

        todoList.forEach((todo, index) => {
            if(todo.getStatus() === true) {
                makeTaskCard(todo, index);
            }
        });
    }

    //set up new list page

    const newListNav = document.querySelector('#add-li');
    newListNav.addEventListener('click', function() {
        newListPage(newListNav);
    });
    const newListPage = (element) => {
        removeFocus(lastFocus);
        addFocus(element);
        lastFocus = element;
        changeTitle("New list"); clearPage();

        let form = document.createElement('form');
        let rows = [];
        for(let i = 0; i < 2; i++) {
            let row = document.createElement('div');
            row.classList.add('row');
            row.classList.add('inp-row');
            rows.push(row);
        }

        let listLabel = document.createElement('label');
        listLabel.setAttribute('for', 'list-title');
        listLabel.textContent = "Title";
        let listInp = document.createElement('input');
        listInp.setAttribute('type', 'text');
        listInp.setAttribute('name', 'list-title');
        listInp.setAttribute('id', 'list-title');
        listInp.required = true;
        rows[0].appendChild(listLabel); rows[0].appendChild(listInp);

        let submitBtn = document.createElement('button');
        submitBtn.setAttribute('type', 'submit');
        submitBtn.setAttribute('id', 'submit-list');
        submitBtn.textContent = "Save";
        submitBtn.addEventListener('click', function() {
            if(listInp.value !== "") {
                event.preventDefault();
                lists.push({
                    title: listInp.value,
                    tasks: []
                })
                showLists();
            }
            listInp.value = "";
        });
        rows[1].appendChild(submitBtn);

        rows.forEach(row => {
            form.appendChild(row);
        });
        main.appendChild(form);
    }

    //set up list page
    const listPage = (element, title, array) => {
        removeFocus(lastFocus);
        addFocus(element);
        lastFocus = element;
        changeTitle(title); clearPage();

        todoList.forEach((todo, index) => {
            if(array.includes(index)) {
                makeTaskCard(todo, index);
            }
        });
    }

    //initialize
    allTaskPage(allTasksNav);
    showLists();
}

screenController();