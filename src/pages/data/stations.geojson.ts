import { stations } from '../../lib/geo';
export const GET = () => Response.json(stations());
