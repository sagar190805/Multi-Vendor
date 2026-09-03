const { Client } = require('pg');
const client = new Client({ user: 'postgres', host: 'localhost', database: 'marketplace', password: 'password', port: 5432 });
async function run() {
  await client.connect();
  const res = await client.query("SELECT id FROM users WHERE email = 'sagar@gmail.com'");
  if (res.rows.length > 0) {
    const id = res.rows[0].id;
    await client.query("UPDATE users SET role = 'SELLER' WHERE id = $1", [id]);
    const vRes = await client.query("SELECT id FROM vendors WHERE user_id = $1", [id]);
    if (vRes.rows.length === 0) {
      await client.query("INSERT INTO vendors (id, user_id, store_name, store_slug, kyc_status, commission_rate) VALUES (gen_random_uuid(), $1, 'Sagar Store', 'sagar-store', 'APPROVED', 0)", [id]);
    } else {
      await client.query("UPDATE vendors SET kyc_status = 'APPROVED' WHERE user_id = $1", [id]);
    }
    console.log("Successfully converted sagar@gmail.com to SELLER");
  }
  await client.end();
}
run().catch(console.error);
