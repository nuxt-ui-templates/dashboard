import { getMappingsFromDB } from '../model/mappingModel';

export const getMappings = async (_event: any) => {
  try {
    const mappings = await getMappingsFromDB();
    return { success: true, mappings };
  } catch (error: any) {
    return {
      success: false,
      message: 'Failed to fetch mappings',
      error: error.message || error,
    };
  }
};
