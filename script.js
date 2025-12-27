const calendar = document.getElementById('calendar');
const monthYear = document.getElementById('month-year');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');

const taskPopup = document.getElementById('task-popup');
const popupDate = document.getElementById('popup-date');
const addTaskBtn = document.getElementById('add-task-btn');
const closePopupBtn = document.getElementById('close-popup');
const tasksList = document.getElementById('tasks-list');

const taskMatiereInput = document.getElementById('task-matiere');
const taskNameInput = document.getElementById('task-name');
const taskDurationInput = document.getElementById('task-duration');

let currentDate = new Date();
let selectedDate = null;
let tasks = {};

// Générer le calendrier pour le mois courant
function generateCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();

let firstDay = new Date(year, month, 1).getDay(); // 0 = dimanche
firstDay = firstDay === 0 ? 6 : firstDay - 1; // Décaler pour que lundi = 0, dimanche = 6
    
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    calendar.innerHTML = '';
    monthYear.textContent = date.toLocaleString('fr-FR', { month: 'long', year: 'numeric' });

    // Cases vides
    for (let i = 0; i < firstDay; i++) {
        const emptyDiv = document.createElement('div');
        calendar.appendChild(emptyDiv);
    }

    // Jours
    for (let i = 1; i <= daysInMonth; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day');
        dayDiv.dataset.date = `${year}-${String(month + 1).padStart(2,'0')}-${String(i).padStart(2,'0')}`;
        dayDiv.innerHTML = `<span>${i}</span><div class="tasks"></div>`;

        // Afficher nombre de tâches
        updateDayTasks(dayDiv);

        dayDiv.addEventListener('click', () => {
            selectedDate = dayDiv.dataset.date;
            popupDate.textContent = selectedDate;
            showTasks(selectedDate);
            taskPopup.style.display = 'block';
        });

        calendar.appendChild(dayDiv);
    }
}

// Mettre à jour le petit indicateur de tâches sur le jour
function updateDayTasks(dayDiv) {
    const date = dayDiv.dataset.date;
    const tasksDiv = dayDiv.querySelector('.tasks');
    tasksDiv.innerHTML = '';
    if (tasks[date]) {
        tasks[date].forEach(task => {
            const t = document.createElement('div');
            t.textContent = `${task.matiere} (${task.duration}min)`;
            tasksDiv.appendChild(t);
        });
    }
}

// Afficher les tâches dans le popup
function showTasks(date) {
    tasksList.innerHTML = '';
    if (tasks[date]) {
        tasks[date].forEach((task, index) => {
            const taskDiv = document.createElement('div');
            taskDiv.classList.add('task');
            taskDiv.innerHTML = `<span>${task.matiere}: ${task.name} (${task.duration} min)</span>
                                 <button class="delete-btn">❌</button>`;
            taskDiv.querySelector('.delete-btn').addEventListener('click', () => {
                tasks[date].splice(index, 1);
                showTasks(date);
                document.querySelectorAll('.day').forEach(d => updateDayTasks(d));
            });
            tasksList.appendChild(taskDiv);
        });
    }
}

// Ajouter tâche
addTaskBtn.addEventListener('click', () => {
    if (!selectedDate) return;
    const matiere = taskMatiereInput.value.trim();
    const name = taskNameInput.value.trim();
    const duration = taskDurationInput.value.trim();
    if (!matiere || !name || !duration) {
        alert('Remplis tous les champs !');
        return;
    }
    if (!tasks[selectedDate]) tasks[selectedDate] = [];
    tasks[selectedDate].push({ matiere, name, duration });
    showTasks(selectedDate);
    document.querySelectorAll('.day').forEach(d => updateDayTasks(d));

    taskMatiereInput.value = '';
    taskNameInput.value = '';
    taskDurationInput.value = '';
});

// Fermer popup
closePopupBtn.addEventListener('click', () => {
    taskPopup.style.display = 'none';
});

// Changer de mois
prevMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    generateCalendar(currentDate);
});

nextMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    generateCalendar(currentDate);
});

// Initialisation
generateCalendar(currentDate);
