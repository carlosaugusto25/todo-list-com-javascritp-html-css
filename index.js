const renderTasksProgressData = (tasks) => {
    let tasksProgress;
    const tasksProgressDOM = document.getElementById('tasks-progress');
    if(tasksProgressDOM) tasksProgress = tasksProgressDOM;
    else {
        const newTasksProgressDom = document.createElement('div');
        newTasksProgressDom.id = 'tasks-progress';
        document.getElementsByTagName('footer')[0].appendChild(newTasksProgressDom);
        tasksProgress = newTasksProgressDom;
    }
    const doneTasks = tasks.filter(task => task.checked).length
    const totalTasks = tasks.length
    tasksProgress.textContent = `${doneTasks}/${totalTasks} concluídas`
}

const getTasksFromLocalStorage = () => {
    const localTasks = JSON.parse(window.localStorage.getItem('tasks'))
    return localTasks ? localTasks : []
}

const setTasksInLocalStorage = (tasks) => {
    window.localStorage.setItem('tasks', JSON.stringify(tasks))
}

const removeTask = (taskId) => {
    const tasks = getTasksFromLocalStorage()
    const updatedTasks = tasks.filter(task => parseInt(task.id) !== parseInt(taskId))
    renderTasksProgressData(updatedTasks)
    setTasksInLocalStorage(updatedTasks)

    document.getElementById('todo-list').removeChild(document.getElementById(taskId))
}

const removeDoneTasks = () => {
    const tasks = getTasksFromLocalStorage()
    const tasksToRemove = tasks.filter(task => task.checked).map(task => task.id)
    const updatedTasks = tasks.filter(task => !task.checked)
    renderTasksProgressData(updatedTasks)
    setTasksInLocalStorage(updatedTasks)

    tasksToRemove.forEach(taskId => {
        document.getElementById('todo-list').removeChild(document.getElementById(taskId))
    })
}

const createTaskListItem = (task, checkbox) => {
    const list = document.getElementById('todo-list')
    const toDo = document.createElement('li')

    const removeTaskButton = document.createElement('button')
    removeTaskButton.textContent = 'x';
    removeTaskButton.ariaLabel = 'Remover tarefa';

    removeTaskButton.onclick = () => removeTask(task.id)

    toDo.id = task.id
    toDo.appendChild(checkbox)
    toDo.appendChild(removeTaskButton)
    list.appendChild(toDo)

    return toDo
}

const onCheckboxClick = (event) => {
    const id = event.target.id.split('-')[1]

    const tasks = getTasksFromLocalStorage()

    const updatedTasks = tasks.map(task => {
        return parseInt(task.id) === parseInt(id) ? { ...task, checked: event.target.checked } : task
    })

    setTasksInLocalStorage(updatedTasks)

    renderTasksProgressData(updatedTasks)
}

const getCheckboxInput = ({ id, description, checked }) => {
    const checkbox = document.createElement('input');
    const label = document.createElement('label');
    const wrapper = document.createElement('div');
    const checkboxId = `checkbox-${id}`;

    checkbox.type = 'checkbox';
    checkbox.id = checkboxId;
    checkbox.checked = checked || false;
    checkbox.addEventListener('change', onCheckboxClick);
    label.htmlFor = checkboxId;
    label.textContent = description;
    wrapper.className = 'checkbox-label-container';

    wrapper.appendChild(checkbox);
    wrapper.appendChild(label);
    return wrapper
}

const getNewTaskId = () => {
    const tasks = getTasksFromLocalStorage()
    const lastId = tasks[tasks.length - 1]?.id;
    return lastId ? lastId + 1 : 1;
}

const getNewTaskData = (event) => {
    const description = event.target.elements.description.value;
    const id = getNewTaskId()

    return { id, description }
}

const createTask = (event) => {
    event.preventDefault();
    const newTaskData = getNewTaskData(event);
    const checkbox = getCheckboxInput(newTaskData);
    createTaskListItem(newTaskData, checkbox);
    const tasks = getTasksFromLocalStorage();
    const updatedTasks = [...tasks, { id: newTaskData.id, description: newTaskData.description, checked: false }]

    setTasksInLocalStorage(updatedTasks)

    renderTasksProgressData(updatedTasks)
    document.getElementById('description').value = '';
}

window.onload = function () {
    const form = document.getElementById('create-todo-form');
    form.addEventListener('submit', createTask);

    const tasks = getTasksFromLocalStorage();

    tasks.forEach(task => {
        const checkbox = getCheckboxInput(task);
        createTaskListItem(task, checkbox);
    })

    renderTasksProgressData(tasks)
}