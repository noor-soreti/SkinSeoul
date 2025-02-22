import * as SQLite from 'expo-sqlite';

export interface RoutineStep {
  id: number;
  name: string;
  step_number: number;
  image_path: string;
  routine_type: 'morning' | 'evening';
}

export type CompletionStatus = 'completed' | 'skipped' | 'out_of_product';

export interface StepCompletion {
  id?: number;
  date: string;  // Format: YYYY-MM-DD
  step_id: number;
  status: CompletionStatus;
  note?: string;  // Optional note about why step was skipped/incomplete
}

let db: SQLite.SQLiteDatabase;

export async function initDatabase() {
  db = await SQLite.openDatabaseAsync('skincare.db');
  await createTables();
}

async function createTables() {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS routine_steps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      step_number INTEGER NOT NULL,
      image_path TEXT,
      routine_type TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS step_completions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      step_id INTEGER NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('completed', 'skipped', 'out_of_product')),
      note TEXT,
      FOREIGN KEY (step_id) REFERENCES routine_steps (id),
      UNIQUE(date, step_id)
    );
  `);
}

export async function insertRoutineStep(step: Omit<RoutineStep, 'id'>) {
  const result = await db.runAsync(
    'INSERT INTO routine_steps (name, step_number, image_path, routine_type) VALUES (?, ?, ?, ?)',
    [step.name, step.step_number, step.image_path, step.routine_type]
  );
  return result;
}

export async function getRoutineSteps(routineType: 'morning' | 'evening'): Promise<RoutineStep[]> {
  return await db.getAllAsync(
    'SELECT * FROM routine_steps WHERE routine_type = ? ORDER BY step_number',
    [routineType]
  );
}

export async function updateStepStatus(
  stepId: number, 
  date: string, 
  status: CompletionStatus,
  note?: string
): Promise<void> {
  await db.runAsync(
    `INSERT OR REPLACE INTO step_completions (step_id, date, status, note)
     VALUES (?, ?, ?, ?)`,
    [stepId, date, status, note || null]
  );
}

export async function getCompletionsForDate(date: string): Promise<StepCompletion[]> {
  return await db.getAllAsync(
    'SELECT * FROM step_completions WHERE date = ?',
    [date]
  );
}

export async function getStepsWithCompletions(
  date: string, 
  routineType: 'morning' | 'evening'
): Promise<(RoutineStep & { status: CompletionStatus | null })[]> {
  return await db.getAllAsync(`
    SELECT 
      rs.*,
      sc.status
    FROM routine_steps rs
    LEFT JOIN step_completions sc ON rs.id = sc.step_id AND sc.date = ?
    WHERE rs.routine_type = ?
    ORDER BY rs.step_number
  `, [date, routineType]);
}