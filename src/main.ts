import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import fs from 'fs';

const DATA_FILE = path.join(__dirname, '..', 'counter.json');

function readCounter(): number {
  if (!fs.existsSync(DATA_FILE)) {
    return 0;
  }

  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  return data.value ?? 0;
}

function writeCounter(value: number): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ value }, null, 2), 'utf-8');
}

function createWindow(): void {
  const win = new BrowserWindow({
    width: 500,
    height: 450,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  });

  win.loadFile(
    path.join(__dirname, '..', 'renderer/app/dist/app/browser/index.html')
  );
}

app.whenReady().then(() => {
  createWindow();
});

ipcMain.handle('get-counter', (): number => {
  return readCounter();
});

ipcMain.handle('increment', (): number => {
  const value = readCounter() + 1;
  writeCounter(value);
  return value;
});

ipcMain.handle('decrement', (): number => {
  const value = readCounter() - 1;
  writeCounter(value);
  return value;
});

ipcMain.handle('reset', (): number => {
  writeCounter(0);
  return 0;
});