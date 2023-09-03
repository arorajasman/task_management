import { PrismaClient } from "../../orm";

class Database {
  private static instance: Database;
  public db: PrismaClient;

  private constructor() {
    this.db = new PrismaClient();
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public getDB() {
    return this.db;
  }
}

export default Database;
