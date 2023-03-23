// function to send request to API and retrieve data

export const get = async (url, method, ACCESS_TOKEN) => {
  const data = await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + ACCESS_TOKEN,
    },
  });
  const res = await data.json();
  return res;
};
