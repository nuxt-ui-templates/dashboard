import { getDB } from '../db/index';

export const getMappingsFromDB = async () => {
  const db = await getDB(); // no await here

  const [rows] = await db.query(`
    SELECT 
      m.idMapping AS mapping_id,
      c.id AS country_id,
      c.Country AS CountryName, 
      com.id AS commodity_id,
      com.Commodity
    FROM \`News Website\`.Mapping m
    JOIN \`News Website\`.Countries c 
      ON m.Countriesid = c.id
    JOIN \`News Website\`.Commodities com 
      ON m.Commoditiesid = com.id
    ORDER BY c.Country, com.Commodity;
  `);

  return rows as any[];
};
