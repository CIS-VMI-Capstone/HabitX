"use strict";

// scripts.js - To-do list behavior
// Runs after the DOM is ready and gracefully exits if the to-do UI is not present.

document.addEventListener('DOMContentLoaded', () => {
    const todoRoot = document.getElementById('todo');
    if (!todoRoot) return; // nothing to do on pages without the to-do

    const STORAGE_KEY = 'habitx-tasks';
    let tasks = loadTasks();

    const newInput = document.getElementById('new-task');
    const addBtn = document.getElementById('add-btn');
    const listEl = document.getElementById('task-list');
    const emptyMsg = document.getElementById('empty-msg');

    if (!newInput || !addBtn || !listEl || !emptyMsg) {
        console.warn('To-do: missing expected elements, aborting script.');
        return;
    }

    addBtn.addEventListener('click', addTask);
    newInput.addEventListener('keydown', (e)=>{ if (e.key === 'Enter') addTask(); });

    function loadTasks(){
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
        catch(e){ return []; }
    }
    function saveTasks(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); }

    function render(){
        listEl.innerHTML = '';
        if (!tasks.length) { emptyMsg.style.display = 'block'; return; }
        emptyMsg.style.display = 'none';

        tasks.forEach((task, idx)=>{
            const li = document.createElement('li'); li.className = 'task';

            const cb = document.createElement('input'); cb.type = 'checkbox'; cb.checked = !!task.done;
            cb.addEventListener('change', ()=>{ toggleDone(idx); });

            const label = document.createElement('span'); label.className = 'task-label'; label.textContent = task.text;
            if (task.done) label.classList.add('done');

            const delBtn = document.createElement('button'); delBtn.type = 'button'; delBtn.textContent = 'Delete';
            delBtn.addEventListener('click', ()=> removeTask(idx));

            const editBtn = document.createElement('button'); editBtn.type = 'button'; editBtn.textContent = 'Edit';
            editBtn.addEventListener('click', ()=> startEdit(idx, label, editBtn, delBtn));

            li.appendChild(cb);
            li.appendChild(label);
            li.appendChild(editBtn);
            li.appendChild(delBtn);

            listEl.appendChild(li);
        });
    }

    function addTask(){
        const text = newInput.value.trim();
        if (!text) return;
        tasks.push({ text, done: false });
        saveTasks(); render(); newInput.value = '';
        newInput.focus();
    }

    function removeTask(i){
        tasks.splice(i,1); saveTasks(); render();
    }

    function toggleDone(i){ tasks[i].done = !tasks[i].done; saveTasks(); render(); }

    function startEdit(idx, labelEl, editBtn, delBtn){
        // replace label with input + save/cancel
        const li = labelEl.parentElement;
        const input = document.createElement('input'); input.className = 'edit-input'; input.value = tasks[idx].text;
        li.replaceChild(input, labelEl);
        editBtn.textContent = 'Save';

        const cancelBtn = document.createElement('button'); cancelBtn.type = 'button'; cancelBtn.textContent = 'Cancel';
        li.replaceChild(cancelBtn, delBtn);

        input.focus(); input.select();

        function finishSave(){
            const v = input.value.trim();
            if (v) tasks[idx].text = v;
            saveTasks(); render();
        }
        function cancel(){ render(); }

        editBtn.onclick = finishSave;
        cancelBtn.onclick = cancel;

        input.addEventListener('keydown', (e)=>{
            if (e.key === 'Enter') finishSave();
            if (e.key === 'Escape') cancel();
        });
    }

    // initial render
    render();
});
