const path = require("path");
require("dotenv").config({ path: path.join(".env." + process.env.NODE_ENV) });

const dbOptions = {
  type: process.env.DB_TYPE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  synchronize: true,
  logger: process.env.DB_LOGGER,
  logging: process.env.DB_LOGGING.split(","),
  extra: {
    connectionLimit: process.env.DB_CONNECTION_LIMIT,
    queueLimit: process.env.DB_QUEUE_LIMIT,
    charset: process.env.DB_CHARSET,
    timezone: process.env.DB_CHARSET
  },
  maxQueryExecutionTime: process.env.DB_MAX_QUERY_EXECUTION_TIME,
  migrationsRun: false,
  dropSchema: false
};

const cliOptions = {
  entities: [process.env.BASE_DIR + "domain/**/*.{ts,js}"],
  migrations: [process.env.BASE_DIR + "migration/**/*.{ts,js}"],
  subscribers: [process.env.BASE_DIR + "subscriber/**/*.{ts,js}"],
  cli: {
    entitiesDir: "src/domain",
    migrationsDir: "src/migration",
    subscribersDir: "src/subscriber"
  }
};

const setUpDbOptions = () => {
  const profile = process.env.NODE_ENV;
  if (profile !== "local" && profile !== "production") {
    new Error(
      "NODE_ENV 환경변수를 설정해 주세요 :: ex) 'local' or'production'"
    );
  }

  return {
    ...dbOptions,
    ...cliOptions
  };
};

module.exports = setUpDbOptions();
