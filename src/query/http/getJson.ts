export const getJson = async (response: Response) => {
    if (response.status === 204) return undefined;
  
    const data = await response.json();
  
    return data;
  };
  