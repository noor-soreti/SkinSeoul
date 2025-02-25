import * as SQLite from 'expo-sqlite';
import { 
  RoutineStep, 
  CompletionStatus, 
  DatabaseErrorType, 
  StepCompletion,
  ProductType 
} from './types/database';
import { AIRoutineResponse } from './aiService';  // Import the type

let db: SQLite.SQLiteDatabase;

export async function initDatabase() {
  try {
    if (!db) {  // Only initialize if not already initialized
      db = await SQLite.openDatabaseAsync('skincare.db');
      await createTables();
      console.log('Database initialized successfully');
    }
    return db;
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

// Add a helper function to ensure db is initialized
async function ensureDatabase() {
  if (!db) {
    await initDatabase();
  }
  return db;
}

async function createTables() {
  try {
    // routine_steps -> stores skincare routine steps
    // step_completions -> tracks which steps were completed on a given date
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS routine_steps (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_name TEXT NOT NULL,
        product_type TEXT NOT NULL CHECK(
          product_type IN (
            'Double Cleanse',
            'Cleanser', 
            'Toner', 
            'Essence', 
            'Moisturizer', 
            'Sunscreen'
          )
        ),
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
      'INSERT INTO routine_steps (product_name, product_type, step_number, image_path, routine_type) VALUES (?, ?, ?, ?, ?)',
      [step.product_name, step.product_type, step.step_number, step.image_path, step.routine_type]
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
    console.log('Updating step status:', { stepId, date, status, note });
    // If status is null, delete the completion record
    if (status === null) {
      console.log('Deleting completion record');
      await db.runAsync(
        'DELETE FROM step_completions WHERE step_id = ? AND date = ?',
        [stepId, date]
      );
    } else {
      console.log('Inserting/updating completion record');
      await db.runAsync(
        `INSERT OR REPLACE INTO step_completions (step_id, date, status, note)
         VALUES (?, ?, ?, ?)`,
        [stepId, date, status, note || null]
      );
    }
    
    // Verify the update
    const verification = await db.getAllAsync(
      'SELECT * FROM step_completions WHERE step_id = ? AND date = ?',
      [stepId, date]
    );
    console.log('Verification after update:', verification);
    
  } catch (e) {
    console.error('Database error in updateStepStatus:', e);
    const error: DatabaseErrorType = {
      message: `Failed to update step status for step ${stepId}`,
      originalError: e instanceof Error ? e.message : String(e),
      operation: 'update',
      table: 'step_completions'
    };
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
    const database = await ensureDatabase();
    
    const steps = await database.getAllAsync(`
      SELECT 
        rs.*,
        sc.status,
        sc.date as completion_date
      FROM routine_steps rs
      LEFT JOIN step_completions sc 
        ON rs.id = sc.step_id 
        AND sc.date = ?
      WHERE rs.routine_type = ?
      ORDER BY rs.step_number
    `, [date, routineType]) as (RoutineStep & { status: CompletionStatus | null })[];
    
    return steps;
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


export async function storeRoutine(routine: AIRoutineResponse): Promise<void> {
  try {
    console.log('Starting to store routine in database...');
    
    // First, clear existing routine steps
    await db.runAsync('DELETE FROM routine_steps');
    console.log('Cleared existing routine steps');
    
    // Store morning routine
    for (let i = 0; i < routine.morning_routine.length; i++) {
      const step = routine.morning_routine[i];
      await insertRoutineStep({
        product_name: step.product,
        product_type: step.step as ProductType,
        step_number: i + 1,
        image_path: `${step.step.toLowerCase()}.png`,
        routine_type: 'morning'
      });
    }
    console.log('Stored morning routine');

    // Store evening routine
    for (let i = 0; i < routine.evening_routine.length; i++) {
      const step = routine.evening_routine[i];
      await insertRoutineStep({
        product_name: step.product,
        product_type: step.step as ProductType,
        step_number: i + 1,
        image_path: `${step.step.toLowerCase()}.png`,
        routine_type: 'evening'
      });
    }
    console.log('Stored evening routine');

    // Verify storage by retrieving the stored routines
    const morningSteps = await getRoutineSteps('morning');
    const eveningSteps = await getRoutineSteps('evening');
    console.log('Verified stored routines:', { 
      morning: morningSteps.length, 
      evening: eveningSteps.length 
    });

  } catch (error) {
    const dbError: DatabaseErrorType = {
      message: 'Failed to store routine in database',
      originalError: error instanceof Error ? error.message : String(error),
      operation: 'create',
      table: 'routine_steps'
    };
    console.error(dbError);
    throw dbError;
  }
}

export async function clearDatabase() {
    try {
        const database = await ensureDatabase();
        await database.execAsync(`
            DROP TABLE IF EXISTS step_completions;
            DROP TABLE IF EXISTS routine_steps;
        `);
        await createTables(); // Recreate empty tables
        console.log('Database cleared successfully');
    } catch (e) {
        const error: DatabaseErrorType = {
            message: 'Failed to clear database',
            originalError: e instanceof Error ? e.message : String(e),
            operation: 'delete'
        };
        console.error(error);
        throw error;
    }
}

export async function insertDummyData() {
  const morningSteps: Omit<RoutineStep, 'id'>[] = [
    {
      product_name: "COSRX Low pH Good Morning Gel Cleanser",
      product_type: "Cleanser",
      step_number: 1,
      image_path: "cleanser.png",
      routine_type: "morning" as const
    },
    {
      product_name: "Klairs Supple Preparation Unscented Toner",
      product_type: "Toner",
      step_number: 2,
      image_path: "toner.png",
      routine_type: "morning" as const
    },
    {
      product_name: "COSRX Advanced Snail 96 Mucin Essence",
      product_type: "Essence",
      step_number: 3,
      image_path: "essence.png",
      routine_type: "morning" as const
    },
    {
      product_name: "ILLIYOON Ceramide Ato Concentrate Cream",
      product_type: "Moisturizer",
      step_number: 4,
      image_path: "moisturizer.png",
      routine_type: "morning" as const
    },
    {
      product_name: "Beauty of Joseon Relief Sun: Rice + Probiotics",
      product_type: "Sunscreen",
      step_number: 5,
      image_path: "sunscreen.png",
      routine_type: "morning" as const
    }
  ];

  const eveningSteps: Omit<RoutineStep, 'id'>[] = [
    {
      product_name: "Banila Co Clean It Zero Cleansing Balm",
      product_type: "Double Cleanse",
      step_number: 1,
      image_path: "oil-cleanser.png",
      routine_type: "evening" as const
    },
    {
      product_name: "COSRX Low pH Good Morning Gel Cleanser",
      product_type: "Cleanser",
      step_number: 2,
      image_path: "cleanser.png",
      routine_type: "evening" as const
    },
    {
      product_name: "Klairs Supple Preparation Unscented Toner",
      product_type: "Toner",
      step_number: 3,
      image_path: "toner.png",
      routine_type: "evening" as const
    },
    {
      product_name: "COSRX Advanced Snail 96 Mucin Essence",
      product_type: "Essence",
      step_number: 4,
      image_path: "essence.png",
      routine_type: "evening" as const
    },
    {
      product_name: "ILLIYOON Ceramide Ato Concentrate Cream",
      product_type: "Moisturizer",
      step_number: 5,
      image_path: "moisturizer.png",
      routine_type: "evening" as const
    }
  ];

  for (const step of [...morningSteps, ...eveningSteps]) {
    await insertRoutineStep(step);
  }
}