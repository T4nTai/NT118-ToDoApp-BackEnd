import { Sequelize} from 'sequelize';
import { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME } from './env.js';
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  dialect: "mysql",
  timezone: "+07:00",
  dialectOptions: {
    dateStrings: true,
    charset: 'utf8mb4',
    typeCast: true
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
    afterCreate: (conn, done) => {
      conn.query("SET time_zone = '+07:00'", (err) => {
        done(err, conn);
      });
    }
  },
  define: {
    timestamps: true,
    underscored: true,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci'
  }
})

export async function connectDB() {
    try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');
  } catch (err) {
    console.error('Database connection failed:', err);
  }
}