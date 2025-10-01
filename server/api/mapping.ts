import { getMappings } from '../controller/mappingController';

export default defineEventHandler(async (event) => {
  return await getMappings(event);
});
