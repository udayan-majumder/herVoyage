export default async function handler(req, res) {
  const url = `https://api.countrystatecity.in${req.url.replace("/api/csc", "")}`;

  const response = await fetch(url, {
    headers: {
      "X-CSCAPI-KEY": process.env.CSC_API_KEY,
    },
  });

  const data = await response.text();

  res.status(response.status).send(data);
}
