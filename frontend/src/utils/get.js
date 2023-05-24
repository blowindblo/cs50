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

export const toggle = async (url, method, ACCESS_TOKEN, body = {}) => {
  const condition = !!body; // evalutes to false if body is empty and true otherwise
  const data = await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + ACCESS_TOKEN,
    },
    ...(condition && body),
  });
  console.log(data);

  // Print error message if request fails
  if (data.status === 204 || data.status === 200) {
    return;
  } else {
    const res = await data.json();
    console.log(res);
    return;
  }
};
