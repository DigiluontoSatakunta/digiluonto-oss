export const sendEvent = async (type = "", message = "", uid = "") => {
  // console.log(typeof type, typeof message, typeof uid);
  const query = JSON.stringify({
    query: `mutation { createEvent(input: { data: { type: "${type}", message: "${message}", uid: "${uid}" } } ) { event { id } } }`,
  });

  const response = await fetch(process.env.REACT_APP_GRAPHQL_API, {
    headers: { "content-type": "application/json" },
    method: "POST",
    body: query,
  });

  const responseJson = await response.json();
  return responseJson.data;
};
