const req = await fetch("https://www.ifixit.com/api/2.0/categories/Mac");
const json = await req.json();
console.log(json.children);
