import * as SQLite from 'expo-sqlite';
import { RoutineStep, CompletionStatus, DatabaseErrorType, StepCompletion } from './types/database';

let db: SQLite.SQLiteDatabase;

export async function initDatabase() {
  try {
    db = await SQLite.openDatabaseAsync('skincare.db');
    await createTables();
  } catch (e) {
    const error: DatabaseErrorType = {
      message: 'Failed to initialize database',
      originalError: e instanceof Error ? e.message : String(e),
      operation: 'init'
    };
    console.error(error);
    throw error;
  }
}

async function createTables() {
  try {
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
  } catch (e) {
    const error: DatabaseErrorType = {
      message: 'Failed to create database tables',
      originalError: e instanceof Error ? e.message : String(e),
      operation: 'create',
      table: 'routine_steps, step_completions'
    };
    console.error(error);
    throw error;
  }
}

export async function insertRoutineStep(step: Omit<RoutineStep, 'id'>) {
  try {
    const result = await db.runAsync(
      'INSERT INTO routine_steps (name, step_number, image_path, routine_type) VALUES (?, ?, ?, ?)',
      [step.name, step.step_number, step.image_path, step.routine_type]
    );
    return result;
  } catch (e) {
    const error: DatabaseErrorType = {
      message: 'Failed to insert routine step',
      originalError: e instanceof Error ? e.message : String(e),
      operation: 'create',
      table: 'routine_steps'
    };
    console.error(error);
    throw error;
  }
}

export async function getRoutineSteps(routineType: 'morning' | 'evening'): Promise<RoutineStep[]> {
  try {
    return await db.getAllAsync(
      'SELECT * FROM routine_steps WHERE routine_type = ? ORDER BY step_number',
      [routineType]
    );
  } catch (e) {
    const error: DatabaseErrorType = {
      message: `Failed to get ${routineType} routine steps`,
      originalError: e instanceof Error ? e.message : String(e),
      operation: 'read',
      table: 'routine_steps'
    };
    console.error(error);
    throw error;
  }
}

export async function updateStepStatus(
  stepId: number, 
  date: string, 
  status: CompletionStatus,
  note?: string
): Promise<void> {
  try {
    await db.runAsync(
      `INSERT OR REPLACE INTO step_completions (step_id, date, status, note)
       VALUES (?, ?, ?, ?)`,
      [stepId, date, status, note || null]
    );
  } catch (e) {
    const error: DatabaseErrorType = {
      message: `Failed to update step status for step ${stepId}`,
      originalError: e instanceof Error ? e.message : String(e),
      operation: 'update',
      table: 'step_completions'
    };
    console.error(error);
    throw error;
  }
}

export async function getCompletionsForDate(date: string): Promise<StepCompletion[]> {
  try {
    return await db.getAllAsync(
      'SELECT * FROM step_completions WHERE date = ?',
      [date]
    );
  } catch (e) {
    const error: DatabaseErrorType = {
      message: `Failed to get completions for date ${date}`,
      originalError: e instanceof Error ? e.message : String(e),
      operation: 'read',
      table: 'step_completions'
    };
    console.error(error);
    throw error;
  }
}

export async function getStepsWithCompletions(
  date: string, 
  routineType: 'morning' | 'evening'
): Promise<(RoutineStep & { status: CompletionStatus | null })[]> {
  try {
    return await db.getAllAsync(`
      SELECT 
        rs.*,
        sc.status
      FROM routine_steps rs
      LEFT JOIN step_completions sc ON rs.id = sc.step_id AND sc.date = ?
      WHERE rs.routine_type = ?
      ORDER BY rs.step_number
    `, [date, routineType]);
  } catch (e) {
    const error: DatabaseErrorType = {
      message: `Failed to get steps with completions for ${routineType} routine on ${date}`,
      originalError: e instanceof Error ? e.message : String(e),
      operation: 'read',
      table: 'routine_steps, step_completions'
    };
    console.error(error);
    throw error;
  }
}

export async function insertDummyData() {
  const morningSteps: Omit<RoutineStep, 'id'>[] = [
    {
      name: "COSRX Low pH Good Morning Gel Cleanser",
      step_number: 1,
      image_path: "cleanser.png",
      routine_type: "morning" as const
    },
    {
      name: "Klairs Supple Preparation Unscented Toner",
      step_number: 2,
      image_path: "toner.png",
      routine_type: "morning" as const
    },
    {
      name: "COSRX Advanced Snail 96 Mucin Essence",
      step_number: 3,
      image_path: "essence.png",
      routine_type: "morning" as const
    },
    {
      name: "ILLIYOON Ceramide Ato Concentrate Cream",
      step_number: 4,
      image_path: "moisturizer.png",
      routine_type: "morning" as const
    },
    {
      name: "Beauty of Joseon Relief Sun: Rice + Probiotics",
      step_number: 5,
      image_path: "sunscreen.png",
      routine_type: "morning" as const
    }
  ];

  const eveningSteps: Omit<RoutineStep, 'id'>[] = [
    {
      name: "Banila Co Clean It Zero Cleansing Balm",
      step_number: 1,
      image_path: "oil-cleanser.png",
      routine_type: "evening" as const
    },
    {
      name: "COSRX Low pH Good Morning Gel Cleanser",
      step_number: 2,
      image_path: "cleanser.png",
      routine_type: "evening" as const
    },
    {
      name: "Klairs Supple Preparation Unscented Toner",
      step_number: 3,
      image_path: "toner.png",
      routine_type: "evening" as const
    },
    {
      name: "COSRX Advanced Snail 96 Mucin Essence",
      step_number: 4,
      image_path: "essence.png",
      routine_type: "evening" as const
    },
    {
      name: "ILLIYOON Ceramide Ato Concentrate Cream",
      step_number: 5,
      image_path: "moisturizer.png",
      routine_type: "evening" as const
    }
  ];

  for (const step of [...morningSteps, ...eveningSteps]) {
    await insertRoutineStep(step);
  }
}