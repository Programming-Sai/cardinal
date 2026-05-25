export const nextReferenceNumber = async (client, entity, prefix) => {
  const year = new Date().getUTCFullYear();
  const { rows } = await client.query(
    `
      INSERT INTO reference_counters (entity, year, last_number)
      VALUES ($1, $2, 1)
      ON CONFLICT (entity, year)
      DO UPDATE SET last_number = reference_counters.last_number + 1
      RETURNING last_number
    `,
    [entity, year]
  );

  const number = String(rows[0].last_number).padStart(4, '0');
  return `${prefix}-${year}-${number}`;
};
