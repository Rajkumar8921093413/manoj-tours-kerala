import fs from 'fs/promises';
import path from 'path';
import db from '../lib/db.js';

function escapeSql(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'boolean') return val ? '1' : '0';
  if (typeof val === 'number') return String(val);
  if (val instanceof Date) {
    // Format Date as standard MySQL 'YYYY-MM-DD HH:MM:SS'
    return `'${val.toISOString().slice(0, 19).replace('T', ' ')}'`;
  }
  if (typeof val === 'object') {
    const jsonStr = JSON.stringify(val);
    const escaped = jsonStr.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    return `'${escaped}'`;
  }
  const str = String(val).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  return `'${str}'`;
}

async function exportSql() {
  console.log('Generating 100% Valid Hostinger Live Import SQL...');

  const tables = [
    'admins',
    'rooms',
    'room_images',
    'jeep_safaris',
    'tour_packages',
    'destinations',
    'sightseeing_spots',
    'gallery_items',
    'reviews'
  ];

  let sql = `-- ==============================================================================
-- Manoj Tours and Travels Kerala — Hostinger Live Database Import
-- Target Database: u548109249_testmanoj
-- Domain: manoj.youthprayer.de
-- Date Generated: ${new Date().toISOString()}
--
-- INSTRUCTIONS FOR HOSTINGER PHPMYADMIN:
-- 1. Open Hostinger hPanel -> Databases -> phpMyAdmin for 'u548109249_testmanoj'
-- 2. Click the 'Import' tab at the top.
-- 3. Choose this file 'hostinger_live_database_import.sql' and click 'Go' / 'Import'.
-- ==============================================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

`;

  for (const table of tables) {
    // 1. Drop existing table if any
    sql += `DROP TABLE IF EXISTS \`${table}\`;\n\n`;

    // 2. Exact DDL from database
    const [createRes] = await db.query(`SHOW CREATE TABLE \`${table}\``);
    let ddl = createRes['Create Table'];
    // Make charset & collation universal for Hostinger MySQL & MariaDB
    ddl = ddl.replace(/utf8mb4_0900_ai_ci/g, 'utf8mb4_unicode_ci');
    sql += `${ddl};\n\n`;

    // 3. Dump Rows
    const rows = await db.query(`SELECT * FROM \`${table}\``);
    if (!rows || rows.length === 0) continue;

    sql += `-- Data for table: ${table} (${rows.length} rows)\n`;
    const cols = Object.keys(rows[0]);
    const colList = cols.map(c => `\`${c}\``).join(', ');

    sql += `INSERT INTO \`${table}\` (${colList}) VALUES\n`;
    const valRows = rows.map(r => {
      const vals = cols.map(c => escapeSql(r[c]));
      return `  (${vals.join(', ')})`;
    });

    sql += valRows.join(',\n') + ';\n\n';
  }

  sql += `SET FOREIGN_KEY_CHECKS = 1;\n-- End of Hostinger Live Database Import\n`;

  const outPath = path.join(process.cwd(), 'database', 'hostinger_live_database_import.sql');
  await fs.writeFile(outPath, sql, 'utf8');
  console.log(`Successfully generated clean Hostinger SQL file at:\n${outPath}`);
  process.exit(0);
}

exportSql().catch(err => {
  console.error('Export error:', err);
  process.exit(1);
});
