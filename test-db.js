const { Pool } = require("pg");

// trying to bypass DNS because it is causing issues
const host = "[2a05:d018:837:ae00:ab78:7b45:76d3:d005]";

const pool = new Pool({
  connectionString: `postgresql://postgres:blogapi2supabase@${host}:5432/postgres`,
  ssl: { rejectUnauthorized: false },
});

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("DB FAILED:", err);
  } else {
    console.log("DB WORKS:", res.rows);
  }
});
