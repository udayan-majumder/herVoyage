export default async function handler(req, res) {
  try {
    const { path = [] } = req.query;

    const url = `https://api.countrystatecity.in/${path.join("/")}`;

    const response = await fetch(url, {
      headers: {
        "X-CSCAPI-KEY": process.env.CSC_API_KEY,
      },
    });

    const data = await response.json();

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Proxy error" });
  }
}
