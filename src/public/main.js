const socket = io();
const statusLog = document.getElementById('statusLog');

function addLogEntry(message, type = 'info') {
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.textContent = `${new Date().toLocaleTimeString()} - ${message}`;
    statusLog.appendChild(entry);
    statusLog.scrollTop = statusLog.scrollHeight;
}

function navigate() {
    const url = document.getElementById('urlInput').value;
    if (!url) {
        addLogEntry('Please enter a URL', 'error');
        return;
    }

    socket.emit('execute-task', { type: 'navigate', url });
    addLogEntry(`Requesting navigation to: ${url}`);
}

socket.on('connect', () => {
    addLogEntry('Connected to server', 'success');
});

socket.on('disconnect', () => {
    addLogEntry('Disconnected from server', 'error');
});

socket.on('task-completed', (data) => {
    addLogEntry(data.message, 'success');
});

socket.on('error', (data) => {
    addLogEntry(data.message, 'error');
});