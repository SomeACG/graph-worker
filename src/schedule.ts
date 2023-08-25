import GraphAPI from "./api/graph";
import type { AppEnv } from "./types/Env";

export default async function schedule(event: Event, env: AppEnv["Bindings"]) {
    
    const graph = new GraphAPI(env)
    await graph.fetchAccessToken(true)
    
}