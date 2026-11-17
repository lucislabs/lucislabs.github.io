import { stations, hexbin } from '../../lib/geo';
export const GET = () => Response.json(hexbin(stations()));
