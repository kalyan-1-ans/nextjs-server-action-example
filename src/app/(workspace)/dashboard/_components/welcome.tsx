import { getWelcomeName } from "../_lib/data";

export async function Welcome() {
  const name = await getWelcomeName();

  return <h1 className="mb-12 text-4xl font-bold">Welcome, {name}!</h1>;
}
