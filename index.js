let tasks = [
    { id: 1, title: 'Comprar pão', completed: false },
    { id: 2, title: 'Passear com o cachorro', completed: false },
    { id: 3, title: 'fazer o almoço', completed: false }
]

const getCheckboxInput = ({id, title, completed}) => {
    const checkbox = document.createElement('input');
    const label = document.createElement('label');
    const wrapper = document.createElement('div');
    const checkboxId = `checkbox-${id}`;

    checkbox.type = 'checkbox';
    checkbox.id = checkboxId;
    checkbox.checked = completed;
    label.htmlFor = checkboxId;
    label.textContent = title;
    wrapper.className = 'checkbox-label-container';

    wrapper.appendChild(checkbox);
    wrapper.appendChild(label);
    return wrapper
}

window.onload = function () {
    tasks.forEach(task => {
        const checkbox = getCheckboxInput(task);

        const list = document.getElementById('todo-list')
        const toDo = document.createElement('li')
        // const button = document.createElement('button')

        toDo.id = task.id;
        toDo.appendChild(checkbox);
        // toDo.appendChild(button)
        
        list.appendChild(toDo)
    })
}